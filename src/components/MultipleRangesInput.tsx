import * as React from "react";
import FormControl from "@mui/material/FormControl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { ITournamentElement } from "../helpers/getTournamentFields";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";

interface MultipleRangesInputProps {
  inputElement: ITournamentElement;
  isError: boolean;
  error: string | undefined;
  values:
    | {
        start: string;
        end: string;
      }[]
    | null;
  onChange:
    | ((
        value: {
          start: string;
          end: string;
        } | null,
        index: number
      ) => void)
    | undefined;
}

export const MultipleRangesInput: React.FC<MultipleRangesInputProps> = ({
  inputElement,
  isError,
  onChange,
  values,
}) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    {values &&
      values.map((_, index) => (
        <>
          <Grid
            item
            xs={inputElement.size.xs / 2}
            md={inputElement.size.md / 2}
            lg={inputElement.size.lg / 2}
          >
            <FormControl fullWidth margin="normal" error={isError}>
              <DatePicker
                value={dayjs(values[index].start) as unknown as string}
                onChange={(value) => {
                  onChange
                    ? onChange(
                        {
                          start: value || "",
                          end: values[index].end,
                        },
                        index
                      )
                    : null;
                }}
                label={`Stage ${index + 1}`}
              />
            </FormControl>
          </Grid>
          <Grid
            item
            xs={inputElement.size.xs / 2}
            md={inputElement.size.md / 2}
            lg={inputElement.size.lg / 2}
          >
            <FormControl fullWidth margin="normal" error={isError}>
              <DatePicker
                value={dayjs(values[index].end) as unknown as string}
                onChange={(value) => {
                  onChange
                    ? onChange(
                        {
                          start: values[index].start,
                          end: value || "",
                        },
                        index
                      )
                    : null;
                }}
                label={`Stage ${index + 1}`}
              />
            </FormControl>
          </Grid>
        </>
      ))}
  </LocalizationProvider>
);
