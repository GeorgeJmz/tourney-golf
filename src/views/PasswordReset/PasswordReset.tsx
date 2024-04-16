import React, { FormEvent, useState } from "react";
import { observer } from "mobx-react";
import { confirmThePasswordReset } from "./../../services/firebase";
import {
  Button,
  Stack,
  Typography,
  Paper,
  Container,
  Grid,
  TextField,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FirebaseError } from "firebase/app";

const PasswordReset: React.FC = () => {
  const [searchParams] = useSearchParams();
  const oobCode: string | null = searchParams.get("oobCode");
  const navigate = useNavigate();
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (pass !== confirm) {
      alert("Passwords did not match.");
      return;
    }

    try {
      if (oobCode) {
        await confirmThePasswordReset(oobCode, confirm);
        setPass("");
        setConfirm("");
        setSuccessMessage(true);
      } else {
        alert("Something is wrong; try again later!");
        console.log("missing oobCode");
      }
    } catch (error) {
      const code = error as FirebaseError;
      alert("Something is wrong; try again later.");
    }
  };
  return (
    <React.Fragment>
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{ width: "95%", height: "85vh", padding: "0 20px" }}
        >
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={3}
            sx={{ height: "100%" }}
          >
            {successMessage ? (
              <div>
                <h3>Success! Your Password change successfully</h3>
                <button onClick={() => navigate("/")}>
                  Go to the Login page
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} autoComplete="false">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      name="pass"
                      label="Password"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      type="password"
                      name="confirmPassword"
                      label="Confirm Password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      size="large"
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Reset Your Password
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Stack>
        </Paper>
      </Container>
    </React.Fragment>
  );
};

export default observer(PasswordReset);
