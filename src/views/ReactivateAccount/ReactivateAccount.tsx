import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { reactivateAccountWithToken } from "../../services/firebase";
import { NavbarTitleContext } from "../../hooks/useNavContext";

const ReactivateAccount: React.FC = () => {
  const { setTitle } = React.useContext(NavbarTitleContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get("token");

  React.useEffect(() => {
    setTitle("Reactivate Account");
  }, []);

  useEffect(() => {
    if (!token) {
      setError("Invalid reactivation link. Please request a new one.");
      return;
    }

    const processReactivation = async () => {
      setIsProcessing(true);
      setError(null);
      try {
        await reactivateAccountWithToken(token);
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsProcessing(false);
      }
    };

    processReactivation();
  }, [token]);

  if (isProcessing) {
    return (
      <Container sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}>
        <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Paper sx={{ p: 4, width: "100%", textAlign: "center" }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Reactivating your account...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we process your reactivation request.
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

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
            <Typography variant="h5" component="h1" gutterBottom align="center" color="success.main">
              Account Reactivated Successfully!
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 3 }}>
              Your account has been reactivated. You can now log in with your email and password.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/login")}
              >
                Go to Login
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
          <Typography variant="h5" component="h1" gutterBottom align="center" color="error.main">
            Reactivation Failed
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            We couldn't reactivate your account. This could be because:
          </Typography>
          
          <Typography variant="body2" align="center" sx={{ mb: 3, color: "text.secondary" }}>
            • The link has expired (links expire after 1 hour)
            <br />
            • The link has already been used
            <br />
            • The link is invalid
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/request-account-reactivation")}
            >
              Request New Link
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ReactivateAccount; 