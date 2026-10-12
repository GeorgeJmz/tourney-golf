import React, { useEffect } from "react";
import { observer } from "mobx-react";
import TournamentViewModel from "../../../../viewModels/TournamentViewModel";
import { Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import { DateInput } from "../../../../components/DateInput";
import { SwitchInput } from "../../../../components/SwitchInput";
import { MultipleInput } from "../../../../components/MultipleInput";
import {
  getRules,
  rulesFieldsValidations,
} from "../../../../helpers/getTournamentFields";
import dayjs from "dayjs";
import { TextInput } from "../../../../components/TextInput";
import { toJS } from "mobx";
import { MultipleDateInput } from "../../../../components/MultipleDateInput";
import { MultipleRangesInput } from "../../../../components/MultipleRangesInput";
// removed unused import
import Typography from "@mui/material/Typography";
import { getTournamentsById } from "../../../../services/firebase";

interface RulesSetupFormProps {
  tournamentViewModel: TournamentViewModel;
  handleNext: () => void;
  handlePrev: () => void;
}

const RulesSetup: React.FC<RulesSetupFormProps> = ({
  tournamentViewModel,
  handleNext,
  handlePrev,
}) => {
  const validationSchema = rulesFieldsValidations;
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  // Refrescar el torneo desde Firestore al montar el componente
  useEffect(() => {
    const refreshTournament = async () => {
      if (tournamentViewModel.tournament.id) {
        try {
          setIsRefreshing(true);
          const tournaments = await getTournamentsById([tournamentViewModel.tournament.id]);
          if (tournaments && tournaments.length > 0) {
            tournamentViewModel.setTournament(tournaments[0]);
          }
        } catch (error) {
          console.error("Error refreshing tournament:", error);
        } finally {
          setIsRefreshing(false);
        }
      }
    };
    
    refreshTournament();
  }, [tournamentViewModel]);

  const formik = useFormik({
    initialValues: tournamentViewModel.getRulesValues(),
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("values ----", values);
      const nextDayAfterCutoff = dayjs(values.cutOffDate).add(1, "day");
      const currentPlayoffsStart = dayjs(values.playOffsStartDate);
      const currentPlayoffsCutOff = dayjs(values.playOffsCutOff);
      const enforcedPlayoffsStart =
        currentPlayoffsStart.isValid() &&
        currentPlayoffsStart.isAfter(nextDayAfterCutoff)
          ? currentPlayoffsStart.format()
          : nextDayAfterCutoff.format();
      const enforcedPlayoffsCutOff =
        currentPlayoffsCutOff.isValid() &&
        currentPlayoffsCutOff.isAfter(nextDayAfterCutoff)
          ? currentPlayoffsCutOff.format()
          : nextDayAfterCutoff.format();
      const cutoff = dayjs(values.cutOffDate).endOf("day");
      const rawStages = (toJS(values.stagesDates) as {
        start: string;
        end: string;
      }[]) || [];
      const enforcedStages = rawStages.map((stage) => {
        const start = dayjs(stage.start).startOf("day");
        let end = dayjs(stage.end).endOf("day");
        if (end.isAfter(cutoff)) {
          end = cutoff;
        }
        if (end.isBefore(start)) {
          // asegura coherencia: si end < start, mueve end al final del día de start
          end = start.endOf("day");
        }
        return { start: start.format("MM/DD/YYYY"), end: end.format("MM/DD/YYYY") };
      });
      const newValues = {
        playOffs: values.playoffs,
        startDate: values.startDate?.toString(),
        cutOffDate: values.cutOffDate?.toString(),
        matchesPerRound: toJS(values.matchesPerRound),
        pointsPerWin: values.pointsPerWin || 3,
        pointsPerTie: values.pointsPerTie || 1,
        pointsPerWinMedal: values.pointsPerWinMedal || 3,
        pointsPerTieMedal: values.pointsPerTieMedal || 1,
        numberOfRounds:
          parseInt(values?.numberOfRounds?.toString() || "") || "1",
        numberOfStages:
          parseInt(values?.numberOfStages?.toString() || "") || "1",
        roundDates: toJS(values.roundDates) || [],
        championshipRound: values.championshipRound || false,
        weightedChampionshipRound: values.weightedChampionshipRound || 1,
        championshipDate: values.championshipDate?.toString() || "",
        stagesDates: toJS(values.stagesDates) || [],
        minRounds: values.minRounds || 1,
      };
      console.log("newValues", newValues);
      await tournamentViewModel.updateTournament({
        ...newValues,
        playOffsStartDate: enforcedPlayoffsStart,
        playOffsCutOff: enforcedPlayoffsCutOff,
        stagesDates: enforcedStages,
        numberOfRounds: parseInt(newValues.numberOfRounds.toString()),
        championshipRound: newValues.championshipRound as boolean,
        weightedChampionshipRound: newValues.weightedChampionshipRound as number,
        minRounds: parseInt(newValues.minRounds.toString()),
        roundDates: (toJS(values.roundDates) as string[]) || [], // Fix: Ensure roundDates is always an array
        numberOfStages: parseInt(newValues.numberOfStages.toString()),
      });
      handleNext();
    },
  });
  console.log("tournamentViewModel", toJS(tournamentViewModel.tournament));

  // Sincronizar stagesDates/roundDates con numberOfStages para mantener el largo correcto
  useEffect(() => {
    const numberOfStages = Number(formik.values.numberOfStages) || 0;
    const isDerby = tournamentViewModel.tournament.tournamentType === "derby";
    const fieldName = isDerby ? "roundDates" : "stagesDates";
    const currentStages = (toJS(formik.values[fieldName]) as {
      start: string;
      end: string;
    }[]) || [];

    if (numberOfStages <= 0) {
      if (currentStages.length !== 0) {
        formik.setFieldValue(fieldName, []);
      }
      return;
    }

    if (currentStages.length === numberOfStages) {
      return;
    }

    const cutoff = dayjs(formik.values.cutOffDate).endOf("day");
    const padded: { start: string; end: string }[] = Array.from(
      { length: numberOfStages },
      (_, i) => {
        const existing = currentStages[i];
        const start = (existing?.start ? dayjs(existing.start) : dayjs()).startOf("day");
        let end = (existing?.end ? dayjs(existing.end) : dayjs()).endOf("day");
        if (cutoff.isValid() && end.isAfter(cutoff)) {
          end = cutoff;
        }
        if (end.isBefore(start)) {
          end = start.endOf("day");
        }
        return { start: start.format("MM/DD/YYYY"), end: end.format("MM/DD/YYYY") };
      }
    );

    formik.setFieldValue(fieldName, padded);
  }, [formik.values.numberOfStages, formik.values.cutOffDate, tournamentViewModel.tournament.tournamentType]);
  const nOR = Number(formik.values.numberOfRounds); // Convert nOR to a number
  const prevValues = Array.from({ length: nOR }, (_, i) => {
    return (formik.values.roundDates as string[])?.[i] || dayjs().format();
  });

  const nOS = Number(formik.values.numberOfStages); // Convert nOS to a number
  const isDerbyType = tournamentViewModel.tournament.tournamentType === "derby";
  const stagesFieldName = isDerbyType ? "roundDates" : "stagesDates";
  const prevValuesStages = Array.from({ length: nOS }, (_, i) => {
    return (
      (
        formik.values[stagesFieldName] as {
          start: string;
          end: string;
        }[]
      )?.[i] || { start: dayjs().format(), end: dayjs().format() }
    );
  });

  console.log("prevValuesStages ---", prevValuesStages);

  if (isRefreshing) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body1" color="text.secondary">
            Cargando datos del torneo...
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        {getRules(
          tournamentViewModel.tournament.playType,
          tournamentViewModel.tournament.tournamentType
        ).map((inputElement, key) => {
          const isError = Boolean(
            formik.touched[inputElement.name] &&
              Boolean(formik.errors[inputElement.name])
          );
          if (inputElement.input === "multiple") {
            return (
              <MultipleInput
                inputElement={inputElement}
                isError={isError}
                onChangeHandler={(e) => {
                  let valueToSet = [...e.target.value];
                  if (inputElement.name === "matchesPerRound") {
                    const cuadruple = "cuadruple";
                    const triple = "triple";
                    const double = "double";
                    if (e.target.value.includes(double)) {
                      valueToSet = ["double"];
                    }
                    if (e.target.value.includes(triple)) {
                      valueToSet = ["triple", "double"];
                    }
                    if (e.target.value.includes(cuadruple)) {
                      valueToSet = ["cuadruple", "triple", "double"];
                    }
                  }
                  formik.setFieldValue(inputElement.name, valueToSet);
                }}
                value={formik.values[inputElement.name] as unknown as string}
                error={formik.errors[inputElement.name]}
                key={key}
              />
            );
          }
          if (inputElement.input === "number") {
            return (
              <TextInput
                inputElement={inputElement}
                isError={isError}
                inputProps={{ inputMode: "numeric" }}
                onChangeHandler={formik.handleChange}
                error={
                  formik.touched[inputElement.name]
                    ? formik.errors[inputElement.name]
                    : ""
                }
                value={formik.values[inputElement.name] as number}
                key={key}
              />
            );
          }
          if (inputElement.input === "switch") {
            return (
              <SwitchInput
                inputElement={inputElement}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  formik.setFieldValue(inputElement.name, event.target.checked)
                }
                value={formik.values[inputElement.name] as unknown as boolean}
                key={key}
              />
            );
          }
          if (inputElement.input === "multipleDates") {
            return (
              <MultipleDateInput
                inputElement={inputElement}
                isError={isError}
                onChange={(value: string | null, index: number) => {
                  const newArray = formik.values[inputElement.name] as string[];
                  newArray[index] = dayjs(value).format();
                  formik.setFieldValue(inputElement.name, newArray);
                }}
                error={
                  formik.touched[inputElement.name]
                    ? formik.errors[inputElement.name]
                    : ""
                }
                values={prevValues}
                key={key}
              />
            );
          }
          if (inputElement.input === "multipleDatesStages") {
            return (
              <>{
                tournamentViewModel.tournament.tournamentType !== "derby" && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        {"Team stage must end on or before Regular Season Cutoff date"}
                      </Typography>
                    </Grid>
                  </>
                )
              }
                <MultipleRangesInput
                  inputElement={inputElement}
                  isError={isError}
                  isTeamStage={tournamentViewModel.tournament.tournamentType !== "derby"}
                  onChange={(
                    value: {
                      start: string;
                      end: string;
                    } | null,
                    index: number
                  ) => {
                    console.log("value", value);
                    console.log("index", index);
                    console.log("inputElement", inputElement);

                    const current = (formik.values[inputElement.name] as {
                      start: string;
                      end: string;
                    }[]) || [];
                    const newArray = current.map((it) => ({ ...it }));
                    const start = dayjs(value?.start).startOf("day");
                    let end = dayjs(value?.end).endOf("day");
                    const cutoff = dayjs(formik.values.cutOffDate).endOf("day");
                    if (cutoff.isValid() && end.isAfter(cutoff)) {
                      end = cutoff;
                    }
                    if (end.isBefore(start)) {
                      end = start.endOf("day");
                    }
                    newArray[index] = {
                      start: start.format("MM/DD/YYYY"),
                      end: end.format("MM/DD/YYYY"),
                    };
                    console.log("newArray", newArray);
                    formik.setFieldValue(inputElement.name, newArray);
                  }}
                  error={
                    formik.touched[inputElement.name]
                      ? formik.errors[inputElement.name]
                      : ""
                  }
                  values={prevValuesStages}
                  key={key}
                />
              </>
            );
          }
          return (
            <DateInput
              inputElement={inputElement}
              isError={isError}
              disabledPast={inputElement.name === "championshipDate" ? true : false}
                minDate={
                  inputElement.name === "playOffsStartDate"
                    ? dayjs(formik.values.cutOffDate).add(1, "day").format()
                    : inputElement.name === "playOffsCutOff"
                    ? dayjs(formik.values.playOffsStartDate as unknown as string)
                        .add(1, "day")
                        .format()
                    : undefined
                }
              onChange={(value: string | null) => {
                if (inputElement.name === "cutOffDate") {
                  const nextDay = dayjs(value).add(1, "day").format();
                  formik.setFieldValue(
                    "championshipDate",
                    dayjs(value).format()
                  );
                  formik.setFieldValue("playOffsStartDate", nextDay);
                  formik.setFieldValue("playOffsCutOff", nextDay);
                  }
                  if (inputElement.name === "playOffsStartDate") {
                    const minCut = dayjs(value).add(1, "day").format();
                    const currentCut = formik.values["playOffsCutOff"] as string;
                    if (!currentCut || dayjs(currentCut).isBefore(minCut)) {
                      formik.setFieldValue("playOffsCutOff", minCut);
                    }
                }
                formik.setFieldValue(inputElement.name, dayjs(value).format());
              }}
              error={
                formik.touched[inputElement.name]
                  ? formik.errors[inputElement.name]
                  : ""
              }
              value={formik.values[inputElement.name] as unknown as string}
              key={key}
            />
          );
        })}
        <Grid item xs={12}>
          <FormControl>
            <Button
              type="submit"
              variant="contained"
              size="large"
              data-testid="save-and-next-step-rules-setup"
            >
              {"Save and next step"}
            </Button>
          </FormControl>
        </Grid>
        {/* <Grid item xs={12}>
          <FormControl fullWidth>
            <Button type="submit" variant="contained" size="large">
              {"Save"}
            </Button>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={handlePrev}
            >
              Previous Step
            </Button>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={handleNext}
            >
              Next Step
            </Button>
          </FormControl>
        </Grid> */}
      </Grid>
    </form>
  );
};

export default observer(RulesSetup);
