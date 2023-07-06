import * as React from "react";
import FormControl from "@mui/material/FormControl";
import type { ITournamentElement } from "../helpers/getTournamentFields";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import { TextInput } from "./TextInput";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import type { IPlayer } from "../models/Tournament";
import type { IStep2InputElement } from "../helpers/getTournamentFields";
import { step2Fields } from "../helpers/getTournamentFields";
import * as yup from "yup";

interface SendInvitationsProps {
  fields: ITournamentElement[];
  emailList: Array<Partial<IPlayer>>;
  validationSchema: yup.ObjectSchema<IStep2InputElement>;
  playersLeft?: number;
  onSubmit: (email: string, name: string) => void;
}

export const SendInvitations: React.FC<SendInvitationsProps> = ({
  fields,
  emailList,
  validationSchema,
  playersLeft,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues: step2Fields,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      onSubmit(values.email, values.name);
    },
  });

  const isDisabled = playersLeft !== undefined ? playersLeft === 0 : false;
  const playersLeftText =
    playersLeft !== undefined ? `${playersLeft} left` : "";
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        {fields.map((inputElement, key) => {
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
              disabled={isDisabled}
            >
              Send Invitation
            </Button>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography>{`${emailList.length} players invited ${playersLeftText}`}</Typography>
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
      </Grid>
    </form>
  );
};
