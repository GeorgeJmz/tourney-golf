import React from "react";
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
  const formik = useFormik({
    initialValues: tournamentViewModel.getRulesValues(),
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("values", values);
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
        roundDates: toJS(values.roundDates) || [],
        championshipRound: values.championshipRound || false,
        championshipDate: values.championshipDate?.toString() || "",
        minRounds: values.minRounds || 1,
      };
      console.log("newValues", newValues);
      await tournamentViewModel.updateTournament({
        ...newValues,
        numberOfRounds: parseInt(newValues.numberOfRounds.toString()),
        championshipRound: newValues.championshipRound as boolean,
        minRounds: parseInt(newValues.minRounds.toString()),
      });
      handleNext();
    },
  });
  console.log("tournamentViewModel", toJS(tournamentViewModel.tournament));
  const nOR = Number(formik.values.numberOfRounds); // Convert nOR to a number
  const prevValues = Array.from({ length: nOR }, (_, i) => {
    return (formik.values.roundDates as string[])?.[i] || dayjs().format();
  });
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
                onChangeHandler={(e) =>
                  formik.setFieldValue(inputElement.name, e.target.value)
                }
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
          return (
            <DateInput
              inputElement={inputElement}
              isError={isError}
              onChange={(value: string | null) => {
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
            <Button type="submit" variant="contained" size="large">
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
