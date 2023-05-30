import TextField from "@mui/material/TextField";
import type { InputBaseComponentProps } from "@mui/material/InputBase";
import Grid from "@mui/material/Grid";
import type { ITournamentElement } from "../helpers/getTournamentFields";
import { ChangeEventHandler } from "react";

interface TextInputProps {
  inputElement: ITournamentElement;
  isError: boolean;
  onChangeHandler: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  error: string | undefined;
  value: string | number | undefined;
  inputProps?: InputBaseComponentProps | undefined;
}
export const TextInput: React.FC<TextInputProps> = ({
  inputElement,
  isError,
  onChangeHandler,
  inputProps,
  error,
  value,
}) => (
  <Grid item xs={inputElement.size.xs} md={inputElement.size.md}>
    <TextField
      fullWidth
      margin="normal"
      type={inputElement.input}
      name={inputElement.name}
      inputProps={inputProps}
      label={inputElement.placeholder}
      value={value}
      onChange={onChangeHandler}
      error={isError}
      helperText={error}
      required
    />
  </Grid>
);
