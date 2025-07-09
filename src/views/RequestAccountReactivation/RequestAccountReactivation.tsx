import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { requestAccountReactivation } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { NavbarTitleContext } from "../../hooks/useNavContext";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

const RequestAccountReactivation: React.FC = () => {
  const { setTitle } = React.useContext(NavbarTitleContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setTitle("Request Account Reactivation");
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setError(null);
      try {
        await requestAccountReactivation(values.email);
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (success) {
    return (
      <Container sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}>
        <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Paper sx={{ p: 4, width: "100%" }}>
            <Typography variant="h5" component="h1" gutterBottom align="center">
              Reactivation Email Sent
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 3 }}>
              We've sent a reactivation link to your email address. 
              Please check your inbox and click the link to reactivate your account.
            </Typography>
            <Typography variant="body2" align="center" sx={{ mb: 3, color: "text.secondary" }}>
              The link will expire in 1 hour.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setSuccess(false);
                  formik.resetForm();
                }}
              >
                Request Another
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}>
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Paper sx={{ p: 4, width: "100%" }}>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Request Account Reactivation
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Enter your email address and we'll send you a link to reactivate your account.
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
              disabled={isSubmitting}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? "Sending..." : "Send Reactivation Email"}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/login")}
                disabled={isSubmitting}
              >
                Back to Login
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default RequestAccountReactivation; 