import TextField from "@mui/material/TextField";
import React from "react";

interface InputTextProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const InputText: React.FC<InputTextProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <TextField
      InputLabelProps={{
        style: {
          color: "white",
        },
      }}
      InputProps={{
        style: {
          color: "white",
        },
      }}
      variant="outlined"
      fullWidth
      type={type}
      name={name}
      label={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default InputText;
