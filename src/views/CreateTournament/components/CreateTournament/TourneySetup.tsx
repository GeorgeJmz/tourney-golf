import React from "react";
import { observer } from "mobx-react";
import {
  step1,
  getStep1,
  step1FieldsValidations,
} from "../../../../helpers/getTournamentFields";
import { Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import TournamentViewModel from "../../../../viewModels/TournamentViewModel";
import { SelectInput } from "../../../../components/SelectInput";
import { TextInput } from "../../../../components/TextInput";

interface TourneySetupFormProps {
  tournamentViewModel: TournamentViewModel;
  handleNext: () => void;
}
const TourneySetup: React.FC<TourneySetupFormProps> = ({
  tournamentViewModel,
  handleNext,
}) => {
  const validationSchema = step1FieldsValidations;
  const isNewTournament = tournamentViewModel.idTournament === "";
  const formik = useFormik({
    initialValues: tournamentViewModel.getTournamentValues(),
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const tournamentAction = isNewTournament
        ? "createTournament"
        : "updateTournament";
      const newValues = {
        name: values.name,
        tournamentType: values.type,
        playType: values.playType,
      };
      await tournamentViewModel[tournamentAction](newValues);
      handleNext();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        {getStep1(formik.values.type).map((inputElement, key) => {
          const isError = Boolean(
            formik.touched[inputElement.name] &&
              Boolean(formik.errors[inputElement.name])
          );
          if (inputElement.input === "select") {
            return (
              <SelectInput
                inputElement={inputElement}
                isError={isError}
                onChangeHandler={(e) =>
                  formik.setFieldValue(inputElement.name, e.target.value)
                }
                value={formik.values[inputElement.name]}
                error={formik.errors[inputElement.name]}
                key={key}
              />
            );
          }
          // Remove This validation when we have the backend
          if (inputElement.name === "players") {
            return <p></p>;
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
                value={formik.values[inputElement.name]}
                key={key}
              />
            );
          }
          return (
            <TextInput
              inputElement={inputElement}
              isError={isError}
              onChangeHandler={formik.handleChange}
              error={
                formik.touched[inputElement.name]
                  ? formik.errors[inputElement.name]
                  : ""
              }
              value={formik.values[inputElement.name]}
              key={key}
            />
          );
        })}
        <Grid item xs={12}>
          <FormControl>
            <Button type="submit" variant="contained" size="large">
              {isNewTournament ? "Save and next step" : "Update League"}
            </Button>
          </FormControl>
        </Grid>
        {/* <Grid item xs={4}>
          <FormControl fullWidth>
            <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={handleNext}
              disabled={isNewTournament}
            >
              Next Step
            </Button>
          </FormControl>
        </Grid> */}
      </Grid>
    </form>
  );
};

export default observer(TourneySetup);
