import * as React from "react";
import FormControl from "@mui/material/FormControl";
import type { ITournamentElement } from "../helpers/getTournamentFields";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button } from "@mui/material";
import { TextInput } from "./TextInput";
import type { TextInputProps } from "./TextInput";
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
  onSubmit: (email: string, name: string) => void;
  onEdit: (email: string, name: string, index: number) => void;
  onDelete: (index: number) => void;
}

export const SendInvitations: React.FC<SendInvitationsProps> = ({
  fields,
  emailList,
  validationSchema,
  onSubmit,
  onEdit,
  onDelete,
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  const formik = useFormik({
    initialValues: step2Fields,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      focusInput();
      onSubmit(values.email, values.name);
      formik.setValues(step2Fields); // Reset the form values
    },
  });

  const editFormik = useFormik({
    initialValues: step2Fields,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      onSubmit(values?.email.toLowerCase(), values.name);
      editFormik.setValues(step2Fields); // Reset the form values
    },
  });

  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [editIndex, setEditIndex] = React.useState<number | null>(null);

  const startEditing = (index: number) => {
    const name = emailList[index].name;
    const email = emailList[index].email;
    editFormik.setFieldValue(fields[0].name, name);
    editFormik.setFieldValue(fields[1].name, email?.toLowerCase());
    setIsEditing(true);
    setEditIndex(index);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditIndex(null);
  };

  const isDisabled = isEditing;

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        {fields.map((inputElement, key) => {
          const isError = Boolean(
            formik.touched[inputElement.name] &&
              Boolean(formik.errors[inputElement.name])
          );
          let TextInputObject: TextInputProps = {
            inputElement,
            isError,
            onChangeHandler: formik.handleChange,
            error: formik.touched[inputElement.name]
              ? formik.errors[inputElement.name]
              : "",
            value: formik.values[inputElement.name],
          };

          if (inputElement.name === "name") {
            TextInputObject = {
              ...TextInputObject,
              inputRef: inputRef,
            };
          }

          return <TextInput key={key} {...TextInputObject} />;
        })}
        <Grid item xs={4}>
          <FormControl margin="normal" fullWidth>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isDisabled}
            >
              Add Player
            </Button>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography>{`${emailList.length} players invited`}</Typography>
        </Grid>
        <Grid item xs={12} justifyContent="center" alignItems="center">
          <TableContainer component={Paper} sx={{ marginBottom: "50px" }}>
            <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="right">Actions</TableCell>{" "}
                </TableRow>
              </TableHead>
              <TableBody>
                {emailList.map(({ email, name }, index) => (
                  <TableRow
                    key={`${email}-${name}-${index}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="left">
                      {isEditing && editIndex === index ? (
                        <TextInput
                          inputElement={fields[0]} // Replace with actual name field name
                          isError={false}
                          onChangeHandler={editFormik.handleChange}
                          error={
                            editFormik.touched.name
                              ? editFormik.errors.name
                              : ""
                          }
                          value={editFormik.values.name}
                        />
                      ) : (
                        name
                      )}
                    </TableCell>
                    <TableCell align="left">
                      {isEditing && editIndex === index ? (
                        <TextInput
                          inputElement={fields[1]} // Replace with actual email field name
                          isError={false}
                          onChangeHandler={editFormik.handleChange}
                          error={
                            editFormik.touched.email
                              ? editFormik.errors.email
                              : ""
                          }
                          value={editFormik.values.email}
                        />
                      ) : (
                        email
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {isEditing && editIndex === index ? (
                        <div>
                          <IconButton
                            aria-label="save"
                            onClick={() => {
                              // Add logic to save edited data
                              onEdit(
                                editFormik.values.email.toLowerCase(),
                                editFormik.values.name,
                                index
                              );
                              cancelEditing();
                            }}
                          >
                            <SaveIcon />
                          </IconButton>
                          <IconButton
                            aria-label="cancel"
                            onClick={cancelEditing}
                          >
                            <CancelIcon />
                          </IconButton>
                        </div>
                      ) : (
                        <React.Fragment>
                          {/* <IconButton
                            aria-label="edit"
                            onClick={() => startEditing(index)}
                          >
                            <EditIcon />
                          </IconButton> */}
                          <IconButton
                            aria-label="delete"
                            onClick={() => onDelete(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </React.Fragment>
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
