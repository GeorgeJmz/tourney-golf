import * as React from "react";
import FormControl from "@mui/material/FormControl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { ITournamentElement } from "../helpers/getTournamentFields";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";

interface DateInputProps {
  inputElement: ITournamentElement;
  isError: boolean;
  error: string | undefined;
  value: string | null;
  onChange: ((value: string | null) => void) | undefined;
}

export const DateInput: React.FC<DateInputProps> = ({
  inputElement,
  isError,
  onChange,
  value,
}) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Grid
      item
      xs={inputElement.size.xs}
      md={inputElement.size.md}
      lg={inputElement.size.lg}
    >
      <FormControl fullWidth margin="normal" error={isError}>
        <DatePicker
          value={dayjs(value) as unknown as string}
          onChange={onChange}
          label={inputElement.placeholder}
        />
      </FormControl>
    </Grid>
  </LocalizationProvider>
);
