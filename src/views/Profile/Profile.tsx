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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
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
import { deleteAccount, logout } from "../../services/firebase";

import { toJS } from "mobx";

interface IProfilePageProps {
  user: UserViewModel;
}

const Profile: React.FC<IProfilePageProps> = ({ user }) => {
  const { setTitle } = React.useContext(NavbarTitleContext);
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const validationSchema = profileFieldsValidation;

  const formik = useFormik({
    initialValues: {
      name: user.user.name,
      email: user.user.email,
      lastName: user.user.lastName,
      ghinNumber: user.user.ghinNumber,
      sequentialUserId: user.user.sequentialUserId,
    } as IProfileElement,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const newUser = {
        name: values.name,
        lastName: values.lastName,
        id: user.user.id,
        email: user.user.email,
        ghinNumber: values.ghinNumber,
        sequentialUserId: user.user.sequentialUserId,
      };
      user.updateUser(newUser);
      setTimeout(() => navigate("/dashboard"), 1000);
    },
  });

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteAccount(user.user.id || "");
      await logout();
      setDeleteDialogOpen(false);
      navigate("/");
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Error deleting account");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteError(null);
  };

  React.useEffect(() => {
    setTitle("Edit Profile");
  }, []);

  return (
    <Box sx={{ height: "100vh" }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} sx={{ background: "white", p: 3 }}>
          {profileElementsSettings.map((inputElement, key) => {
            const isError = Boolean(
              formik.touched[inputElement.name] &&
                Boolean(formik.errors[inputElement.name])
            );

            const isDisabled =
              inputElement.name === "email" ||
              inputElement.name === "sequentialUserId";

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
                <Button
                  sx={{ marginLeft: "20px" }}
                  type="button"
                  variant="outlined"
                  color="error"
                  size="large"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
              </div>
            </FormControl>
          </Grid>
        </Grid>
      </form>

      {/* Dialog de confirmación para eliminar cuenta */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        aria-labelledby="delete-account-dialog-title"
        aria-describedby="delete-account-dialog-description"
      >
        <DialogTitle id="delete-account-dialog-title">
          CONFIRM DELETE ACCOUNT
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-account-dialog-description">
          This action will:
            <br />
            • Temporarily disable your account
            <br />
            • You won't be able to access your account unless it's reactivated
            <br />
            • It will be permanently deleted in 30 days
            <br />
            <br />
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Disabling..." : "Yes, delete account"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default observer(Profile);
