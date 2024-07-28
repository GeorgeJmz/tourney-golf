import React from "react";
import { observer } from "mobx-react";
import type UserViewModel from "../../../../../viewModels/UserViewModel";
import { Button, TextField, Grid } from "@mui/material";
import { withStyles } from "@mui/styles";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { URLS } from "../../../../../helpers/URLS";

interface ProfileFormProps {
  userViewModel: UserViewModel;
}

interface IAccountInput {
  name: string;
  lastName: string;
  email: string;
  ghin?: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ userViewModel }) => {
  const DisabledTextField = withStyles({
    root: {
      "input.Mui-disabled": {
        "-webkit-text-fill-color": "green !important",
        fillColor: "green !important",
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: "green",
      },
      "& .MuiOutlinedInput-root.Mui-disabled": {
        "& fieldset": {
          borderColor: "gray",
        },
        "& input": {
          "-webkit-text-fill-color": "gray",
        },
      },
    },
  })(TextField);
  const { register, handleSubmit } = useForm<IAccountInput>();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<IAccountInput> = async (data) => {
    const { email, name, lastName, ghin } = data;
    if (email && name && lastName) {
      const newUser = {
        name,
        lastName,
        id: userViewModel.user.id,
        email: userViewModel.user.email,
        ghinNumber: ghin?.toLowerCase() || "",
      };
      await userViewModel.updateUser(newUser);
      navigate(URLS.DASHBOARD);
    }
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
              value: userViewModel.user.name,
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
              value: userViewModel.user.lastName,
            })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DisabledTextField
            InputLabelProps={{
              style: {
                color: "white",
              },
            }}
            InputProps={{
              style: {
                color: "gray !important",
              },
            }}
            label="Email"
            variant="outlined"
            error={false}
            disabled
            fullWidth
            {...register("email", {
              required: "Email is required",
              maxLength: 50,
              pattern: /\S+@\S+\.\S+/,
              value: userViewModel.user.email,
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
            label="GHIN#"
            variant="outlined"
            error={false}
            fullWidth
            {...register("ghin", {
              required: false,
              maxLength: 20,
              value: userViewModel.user.ghinNumber,
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
            Update Profile
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Link to={URLS.DASHBOARD}>
            <Button fullWidth variant="outlined" color="primary" size="large">
              Cancel
            </Button>
          </Link>
        </Grid>
      </Grid>
    </form>
  );
};

export default observer(ProfileForm);
