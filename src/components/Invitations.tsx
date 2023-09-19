import React, { useState } from "react";
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

import { Autocomplete, TextField } from "@mui/material";

import { useFormik } from "formik";
import type { IPlayer } from "../models/Tournament";
import type { IInvitationsInputElement } from "../helpers/getTournamentFields";
import { invitationsFields } from "../helpers/getTournamentFields";
import * as yup from "yup";
import { getUsersByName } from "../services/firebase";
import type { IUser } from "../models/User";

interface InvitationsProps {
  fields: ITournamentElement[];
  emailList: Array<Partial<IPlayer>>;
  validationSchema: yup.ObjectSchema<IInvitationsInputElement>;
  playersLeft?: number;
  onSubmit: (email: string, name: string, handicap: number) => void;
  onDelete: (index: number) => void;
  onUpdate: (
    email: string,
    name: string,
    handicap: number,
    key: number
  ) => void;
}

export const Invitations: React.FC<InvitationsProps> = ({
  fields,
  emailList,
  validationSchema,
  playersLeft,
  onSubmit,
  onUpdate,
  onDelete,
}) => {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [matchingUsers, setMatchingUsers] = useState<IUser[]>([]);
  const formik = useFormik({
    initialValues: invitationsFields,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      onSubmit(values.email, values.name, values.handicap || 0);
    },
  });

  const handleInputChange = async (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    if (value) {
      const users = await getUsersByName(value);
      setMatchingUsers(users || []);
    } else {
      setMatchingUsers([]);
    }
  };

  const isDisabled = playersLeft !== undefined ? playersLeft === 0 : false;
  const playersLeftText =
    playersLeft !== undefined ? `${playersLeft} left` : "";
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid item xs={12} md={3} lg={3}>
        <Typography variant="h6">Invite Players</Typography>
        <Autocomplete
          options={matchingUsers}
          getOptionLabel={(user) =>
            `${user.name} ${user.lastName} - ${user.email}`
          }
          value={selectedUser}
          onChange={(event, value) => {
            setSelectedUser(value);
            const name = `${value?.name} ${value?.lastName}` || "";
            formik.setFieldValue(fields[0].name, name);
            formik.setFieldValue(fields[1].name, value?.email || "");
          }}
          onInputChange={handleInputChange}
          renderInput={(params) => (
            <TextField {...params} label="Search Users" />
          )}
        />
      </Grid>

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
        <Grid item xs={12} md={3} lg={3}>
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
                  <TableCell align="left">Handicap</TableCell>
                  <TableCell align="right">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emailList.map(({ email, name, handicap }, index) => (
                  <TableRow
                    key={`${email}-${name}-${index}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="left">
                      {name}
                    </TableCell>
                    <TableCell align="left">{email}</TableCell>
                    <TableCell align="left">
                      <TextField
                        label="Handicap"
                        variant="outlined"
                        defaultValue={handicap}
                        onBlur={(event) => {
                          const value = parseInt(event.target.value);
                          if (value >= 0) {
                            onUpdate(email || "", name || "", value, index);
                          } else {
                            event.target.value = "0";
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {index !== 0 && (
                        <IconButton
                          edge="end"
                          aria-label="comments"
                          onClick={() => onDelete(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
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
