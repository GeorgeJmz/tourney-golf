import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import type { ITournamentElement } from "../../helpers/getTournamentFields";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button } from "@mui/material";
import { TextInput } from "../TextInput";
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
import type { IPlayer } from "../../models/Tournament";
import type { IInvitationsInputElement } from "../../helpers/getTournamentFields";
import { invitationsFields } from "../../helpers/getTournamentFields";
import * as yup from "yup";
import type { IUser } from "../../models/User";

interface OpponentInvitationsProps {
  playersToInvite: IUser[];
  fields: ITournamentElement[];
  showAll: boolean;
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

export const OpponentInvitations: React.FC<OpponentInvitationsProps> = ({
  fields,
  showAll,
  playersToInvite,
  emailList,
  validationSchema,
  playersLeft,
  onSubmit,
  onUpdate,
  onDelete,
}) => {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [matchingUsers, setMatchingUsers] = useState<IUser[]>(playersToInvite);
  const formik = useFormik({
    initialValues: invitationsFields,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values, "values");
      console.log(selectedUser, "selecedUser");
      //onSubmit(values.email, values.name, values.handicap || 0);
    },
  });

  const handleInputChange = async (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    const users = playersToInvite; //await getUsersByName(value);
    setMatchingUsers(users || []);
    // if (value) {
    //   const users = playersToInvite;//await getUsersByName(value);
    //   setMatchingUsers(users || []);
    // } else {
    //   setMatchingUsers([]);
    // }
  };

  const isDisabled = playersLeft !== undefined ? playersLeft === 0 : false;
  const playersLeftText =
    playersLeft !== undefined ? `${playersLeft} left` : "";

  const isMobile = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  return (
    <form onSubmit={formik.handleSubmit}>
      <Box paddingTop={2} paddingLeft="5%" paddingRight="5%" width="auto">
        <Autocomplete
          options={matchingUsers}
          getOptionLabel={(user) => `${user.name} - ${user.email}`}
          value={selectedUser}
          onChange={(event, value) => {
            setSelectedUser(value);
            const name = `${value?.name}` || "";
            formik.setFieldValue(fields[0].name, name);
            formik.setFieldValue(fields[1].name, value?.email || "");
          }}
          onInputChange={handleInputChange}
          renderInput={(params) => (
            <TextField {...params} label="Search Users" />
          )}
        />
        <Box>
          {showAll &&
            fields.map((inputElement, key) => {
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
          <Box>
            <FormControl margin="normal" fullWidth>
              <Button
                type="submit"
                variant="outlined"
                size="large"
                color="success"
                disabled={isDisabled}
                sx={{ width: "100%", color: "white" }}
                onClick={(e) => {
                  if (selectedUser) {
                    onSubmit(selectedUser.email, selectedUser.name, 0);
                    setSelectedUser(null);
                  }
                }}
              >
                Add Player
              </Button>
            </FormControl>
          </Box>
        </Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              color: "white",
              justifyContent: "space-between",
              padding: "10px",
              fontSize: "10px",
              textTransform: "uppercase",
            }}
          >
            <Box
              sx={{
                width: "25%",
                textAlign: "left",
              }}
            >
              Name
            </Box>
            {/* {!isMobile() && <Box>Email</Box>} */}
            <Box
              sx={{
                width: "10%",
                textAlign: "left",
              }}
            >
              Handicap
            </Box>
            <Box
              sx={{
                width: "25%",
                textAlign: "right",
              }}
            >
              Delete
            </Box>
          </Box>
          <Box>
            {emailList.map(({ email, name, handicap }, index) => (
              <Box
                sx={{
                  display: "flex",
                  color: "white",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "14px",
                  borderBottom: "2px solid #fff",
                  borderLeft: "2px solid #fff",
                  marginBottom: "40px",
                }}
              >
                <Box
                  sx={{
                    width: "25%",
                    padding: "10px",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                >
                  {name}
                </Box>
                {/* {!isMobile() && <Box sx={{
                  width: "25%",
                  padding:"10px",
                }}>{email}</Box>} */}
                <Box
                  sx={{
                    width: "15%",
                    padding: "10px",
                    textAlign: "left",
                  }}
                >
                  <TextField
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
                </Box>
                <Box
                  sx={{
                    width: "20%",
                    padding: "10px",
                    textAlign: "right",
                  }}
                >
                  {index !== 0 && (
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={() => onDelete(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </form>
  );
};
