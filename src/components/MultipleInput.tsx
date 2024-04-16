import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import type { ITournamentElement } from "../helpers/getTournamentFields";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";

interface MultipleInputProps {
  inputElement: ITournamentElement;
  isError: boolean;
  onChangeHandler: (event: SelectChangeEvent<string>) => void;
  error: string | undefined;
  value: string;
}
export const MultipleInput: React.FC<MultipleInputProps> = ({
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
        multiple
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={value}
        label={inputElement.placeholder}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {Array.isArray(selected)
              ? selected.map((value) => <Chip key={value} label={value} />)
              : selected}
          </Box>
        )}
        error={isError}
        onChange={onChangeHandler}
      >
        {inputElement.options?.map((option, key) => (
          <MenuItem key={`${key}-${option.displayName}`} value={option.value}>
            <Checkbox checked={value.indexOf(option.value) > -1} />
            <ListItemText primary={option.displayName} />
          </MenuItem>
        ))}
      </Select>
      {isError && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  </Grid>
);
