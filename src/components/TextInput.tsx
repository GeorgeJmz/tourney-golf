import React, { useRef } from "react";
import TextField from "@mui/material/TextField";
import type { InputBaseComponentProps } from "@mui/material/InputBase";
import Grid from "@mui/material/Grid";
import type { ITournamentElement } from "../helpers/getTournamentFields";
import { ChangeEventHandler } from "react";

export interface TextInputProps {
  inputElement: ITournamentElement;
  isError: boolean;
  onChangeHandler: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  error: string | undefined;
  value: string | number | undefined;
  inputProps?: InputBaseComponentProps | undefined;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  isDisabled?: boolean;
}
export const TextInput: React.FC<TextInputProps> = ({
  inputElement,
  isError,
  onChangeHandler,
  inputProps,
  error,
  value,
  inputRef,
  isDisabled,
}) => {
  return (
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
        disabled={isDisabled}
        inputRef={inputRef}
      />
    </Grid>
  );
};
