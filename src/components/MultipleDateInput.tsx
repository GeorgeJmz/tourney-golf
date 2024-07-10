import * as React from "react";
import FormControl from "@mui/material/FormControl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { ITournamentElement } from "../helpers/getTournamentFields";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";

interface MultipleDateInputProps {
  inputElement: ITournamentElement;
  isError: boolean;
  error: string | undefined;
  values: string[] | null;
  onChange: ((value: string | null, index: number) => void) | undefined;
}

export const MultipleDateInput: React.FC<MultipleDateInputProps> = ({
  inputElement,
  isError,
  onChange,
  values,
}) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Grid
      item
      xs={inputElement.size.xs}
      md={inputElement.size.md}
      lg={inputElement.size.lg}
    >
      {values &&
        values.map((_, index) => (
          <FormControl fullWidth margin="normal" error={isError}>
            <DatePicker
              value={dayjs(values[index]) as unknown as string}
              onChange={(value) => {
                onChange ? onChange(value, index) : null;
              }}
              label={`Round ${index + 1}`}
            />
          </FormControl>
        ))}
    </Grid>
  </LocalizationProvider>
);
