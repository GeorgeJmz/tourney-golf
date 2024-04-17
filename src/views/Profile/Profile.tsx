import React from "react";
import { observer } from "mobx-react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useUserContext";
import {
  Button,
  Box,
  Grid,
  Paper,
  Container,
  FormControl,
} from "@mui/material";
import {
  profileFieldsValidation,
  profileFields,
  profileElementsSettings,
  IProfileElement,
} from "../../helpers/getAccountFields";
import { useFormik } from "formik";
import { TextInput } from "../../components/TextInput";
import { NavbarTitleContext } from "../../hooks/useNavContext";
import UserViewModel from "../../viewModels/UserViewModel";
import { useNavigate } from "react-router-dom";

import { toJS } from "mobx";

interface IProfilePageProps {
  user: UserViewModel;
}

const Profile: React.FC<IProfilePageProps> = ({ user }) => {
  const { setTitle } = React.useContext(NavbarTitleContext);
  const navigate = useNavigate();

  const validationSchema = profileFieldsValidation;

  const formik = useFormik({
    initialValues: {
      name: user.user.name,
      email: user.user.email,
      lastName: user.user.lastName,
    } as IProfileElement,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const newUser = {
        name: values.name,
        lastName: values.lastName,
        id: user.user.id,
        email: user.user.email,
      };
      user.updateUser(newUser);
      setTimeout(() => navigate("/dashboard"), 1000);
    },
  });

  React.useEffect(() => {
    setTitle("Edit Profile");
  }, []);

  return (
    <Box sx={{ height: "100vh" }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} sx={{ p: 3 }}>
          {profileElementsSettings.map((inputElement, key) => {
            const isError = Boolean(
              formik.touched[inputElement.name] &&
                Boolean(formik.errors[inputElement.name])
            );

            const isDisabled = inputElement.name === "email";

            return (
              <TextInput
                inputElement={inputElement}
                isError={isError}
                onChangeHandler={formik.handleChange}
                error={
                  formik.touched[inputElement.name]
                    ? formik.errors[inputElement.name]
                    : ""
                }
                isDisabled={isDisabled}
                value={formik.values[inputElement.name]}
                key={key}
              />
            );
          })}
          <Grid item xs={12}>
            <FormControl>
              <div style={{ display: "flex" }}>
                <Button type="submit" variant="contained" size="large">
                  Update Profile
                </Button>
                <Button
                  sx={{ marginLeft: "20px" }}
                  type="button"
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
              </div>
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default observer(Profile);
