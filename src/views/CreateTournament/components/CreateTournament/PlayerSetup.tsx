import React from "react";
import { observer } from "mobx-react";
import {
  step2,
  step2Fields,
  step2FieldsValidations,
} from "../../../../helpers/getTournamentFields";
import { Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import Typography from "@mui/material/Typography";
import TournamentViewModel from "../../../../viewModels/TournamentViewModel";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { TextInput } from "../../../../components/TextInput";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface PlayerSetupFormProps {
  tournamentViewModel: TournamentViewModel;
  handleNext: () => void;
  handlePrev: () => void;
}

const PlayerSetup: React.FC<PlayerSetupFormProps> = ({
  tournamentViewModel,
  handleNext,
  handlePrev,
}) => {
  const validationSchema = step2FieldsValidations;
  const formik = useFormik({
    initialValues: step2Fields,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      tournamentViewModel.addEmailToList(values.email, values.name);
    },
  });

  const emailList = tournamentViewModel.getEmailList();
  const players = tournamentViewModel.getPlayers();
  const playersLeft = players - emailList.length;

  const onNextHandler = () => {
    const i = tournamentViewModel.getPlayersPerGroup();
    if (i.length === 0) {
      tournamentViewModel.setupGroups();
    }
    handleNext();
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        {step2.map((inputElement, key) => {
          const isError = Boolean(
            formik.touched[inputElement.name] &&
              Boolean(formik.errors[inputElement.name])
          );
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
        <Grid item xs={4}>
          <FormControl margin="normal" fullWidth>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={playersLeft === 0}
            >
              Send Invitation
            </Button>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography>{`${emailList.length} players invited ${playersLeft} left`}</Typography>
        </Grid>
        <Grid item xs={12} justifyContent="center" alignItems="center">
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="right">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emailList.map(({ email, name }, index) => (
                  <TableRow
                    key={`${email}-${name}-${index}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="left">
                      {name}
                    </TableCell>
                    <TableCell align="left">{email}</TableCell>
                    <TableCell align="right">
                      <IconButton edge="end" aria-label="comments">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
              onClick={onNextHandler}
              disabled={playersLeft !== 0}
            >
              Next Step
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
};

export default observer(PlayerSetup);
