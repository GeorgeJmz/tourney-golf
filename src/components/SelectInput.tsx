import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import type { ITournamentElement } from "../helpers/getTournamentFields";

interface SelectInputProps {
  inputElement: ITournamentElement;
  isError: boolean;
  onChangeHandler: (event: SelectChangeEvent<string>) => void;
  error: string | undefined;
  value: string | number | undefined;
}
export const SelectInput: React.FC<SelectInputProps> = ({
  inputElement,
  isError,
  onChangeHandler,
  error,
  value,
}) => (
  <Grid item xs={inputElement.size.xs} md={inputElement.size.md}>
    <FormControl fullWidth margin="normal" error={isError}>
      <InputLabel id="demo-simple-select-helper-label" error={isError}>
        {inputElement.placeholder}
      </InputLabel>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={value as string}
        label={inputElement.placeholder}
        error={isError}
        onChange={onChangeHandler}
      >
        {inputElement.options?.map((option, key) => (
          <MenuItem key={`${key}-${option.displayName}`} value={option.value}>
            {option.displayName}
          </MenuItem>
        ))}
      </Select>
      {isError && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  </Grid>
);
