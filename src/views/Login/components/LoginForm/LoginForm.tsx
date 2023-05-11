import React from "react";
import { observer } from "mobx-react";
import { useForm } from "../../../../hooks/useForm";
import type UserViewModel from "../../../../viewModels/UserViewModel";
import { loginFields } from "../../../../helpers/getAccountFields";
import { Button, TextField, Grid } from "@mui/material";

interface LoginFormProps {
  userViewModel: UserViewModel;
}

const LoginForm: React.FC<LoginFormProps> = ({ userViewModel }) => {
  const { values, handleInputChange, isValid } = useForm(loginFields);

  const handleAccount = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    const { email, password } = values;
    event.preventDefault();
    if (isValid()) {
      await userViewModel.loginUser(email, password);
    }
  };

  return (
    <form onSubmit={handleAccount}>
      <Grid container spacing={2}>
        {loginFields.map((inputElement, key) => (
          <Grid item xs={12} key={key}>
            <TextField
              fullWidth
              type={inputElement.input}
              name={inputElement.name}
              label={inputElement.placeholder}
              value={values[inputElement.name]}
              onChange={handleInputChange}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            type="submit"
          >
            Login
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default observer(LoginForm);
