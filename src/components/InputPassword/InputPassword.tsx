import React from "react";
import {
  Tooltip,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { RefCallBack } from "react-hook-form";

interface InputPasswordProps {
  hasError: boolean;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  name: string;
  ref: RefCallBack;
  helperText?: string;
}
const InputPassword: React.FC<InputPasswordProps> = ({
  hasError,
  placeholder,
  helperText,
  ref,
  name,
  onBlur,
  onChange,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  return (
    <Tooltip title="Pasword minimum requirements: 8 Characters, One Capital Letter, One Number">
      <FormControl fullWidth variant="outlined" error={hasError}>
        <InputLabel
          htmlFor="outlined-adornment-password"
          sx={{
            color: "white",
          }}
        >
          Password
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          ref={ref}
          label={placeholder}
          sx={{
            color: "white",
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? (
                  <VisibilityOff color="primary" />
                ) : (
                  <Visibility color="primary" />
                )}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText id="component-helper-text">{helperText}</FormHelperText>
      </FormControl>
    </Tooltip>
  );
};

export default InputPassword;
