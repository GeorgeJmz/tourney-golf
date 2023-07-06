import * as React from "react";
import FormControl from "@mui/material/FormControl";
import type { ITournamentElement } from "../helpers/getTournamentFields";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { ChangeEvent } from "react";
import Grid from "@mui/material/Grid";

interface SwitchInputProps {
  inputElement: ITournamentElement;
  value: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export const SwitchInput: React.FC<SwitchInputProps> = ({
  inputElement,
  onChange,
  value,
}) => (
  <Grid
    item
    xs={inputElement.size.xs}
    md={inputElement.size.md}
    lg={inputElement.size.lg}
  >
    <FormControl fullWidth margin="normal">
      <FormControlLabel
        control={
          <Switch
            checked={value}
            onChange={onChange}
            name={inputElement.name}
          />
        }
        label={inputElement.placeholder}
      />
    </FormControl>
  </Grid>
);
