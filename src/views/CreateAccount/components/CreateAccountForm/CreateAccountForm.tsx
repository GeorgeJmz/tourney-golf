import React from "react";
import { observer } from "mobx-react";
import { useForm } from "../../../../hooks/useForm";
import { accountFields } from "../../../../helpers/getAccountFields";
import type UserViewModel from "../../../../viewModels/UserViewModel";
import { Button, TextField, Box } from "@mui/material";

interface CreateAccountFormProps {
  userViewModel: UserViewModel;
}

const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
  userViewModel,
}) => {
  const { values, handleInputChange, isValid } = useForm(accountFields);

  const handleAccount = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (isValid()) {
      await userViewModel.createUser({
        id: "",
        name: values.name,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        ghinNumber: "",
        handicap: 0,
      });
    }
  };

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleAccount}
    >
      {accountFields.map((inputElement, key) => (
        <TextField
          key={key}
          type={inputElement.input}
          name={inputElement.name}
          label={inputElement.placeholder}
          value={values[inputElement.name]}
          onChange={handleInputChange}
          margin="normal"
          required
        />
      ))}
      <Button
        type="submit"
        variant="contained"
        disabled={!isValid()}
        size="large"
        sx={{ minWidth: "250px" }}
      >
        Create Account
      </Button>
    </Box>
  );
};

export default observer(CreateAccountForm);
