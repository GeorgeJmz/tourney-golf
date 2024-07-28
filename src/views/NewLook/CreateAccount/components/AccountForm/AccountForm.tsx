import React from "react";
import { observer } from "mobx-react";
import type UserViewModel from "../../../../../viewModels/UserViewModel";
import {
  Button,
  TextField,
  Grid,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  FormHelperText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface AccountFormProps {
  userViewModel: UserViewModel;
}

interface IAccountInput {
  name: string;
  lastName: string;
  email: string;
  password: string;
  ghin?: string;
}

const AccountForm: React.FC<AccountFormProps> = ({ userViewModel }) => {
  const { register, handleSubmit, formState } = useForm<IAccountInput>();
  const onSubmit: SubmitHandler<IAccountInput> = async (data) => {
    const { email, password, name, lastName, ghin } = data;
    if (email && password && name && lastName) {
      await userViewModel.createUser({
        id: "",
        name,
        lastName,
        email: email.toLowerCase(),
        password: password,
        ghinNumber: ghin?.toLowerCase() || "",
        handicap: 0,
      });
    }
  };

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="true">
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
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
            label="Name"
            variant="outlined"
            error={false}
            fullWidth
            {...register("name", {
              required: "Name is required",
              maxLength: 20,
              pattern: /^[A-Za-z]+$/i,
            })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
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
            label="Last Name"
            variant="outlined"
            error={false}
            fullWidth
            {...register("lastName", {
              required: "Last Name is required",
              maxLength: 20,
              pattern: /^[A-Za-z]+$/i,
            })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
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
            label="Email"
            variant="outlined"
            error={false}
            fullWidth
            {...register("email", {
              required: "Email is required",
              maxLength: 50,
              pattern: /\S+@\S+\.\S+/,
            })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Tooltip title="Pasword minimum requirements: 8 Characters, One Capital Letter, One Number">
            <FormControl fullWidth variant="outlined" error={false}>
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
                label="Password"
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
                {...register("password", {
                  required: "Password is required",
                  maxLength: 20,
                  pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{7,}$/,
                })}
              />
              <FormHelperText
                id="component-helper-text"
                sx={{
                  color: "white",
                }}
              >
                {formState.errors.password?.message}
              </FormHelperText>
            </FormControl>
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={4}>
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
            label="GHIN#"
            variant="outlined"
            error={false}
            fullWidth
            {...register("ghin", {
              required: false,
              maxLength: 20,
            })}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            color="secondary"
            type="submit"
          >
            Create Account
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" color="primary">
            Have an account?{" "}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Link to="/login">
            <Button fullWidth variant="outlined" color="primary" size="large">
              Login
            </Button>
          </Link>
        </Grid>
      </Grid>
    </form>
  );
};

export default observer(AccountForm);
