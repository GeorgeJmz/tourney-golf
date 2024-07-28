import React, { FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NewTheme from "../../../components/NewTheme/NewTheme";
import { observer } from "mobx-react";
import { confirmThePasswordReset } from "./../../../services/firebase";
import { Button, Stack, Box, Grid, TextField, Typography } from "@mui/material";
import { FirebaseError } from "firebase/app";

export const PasswordReset: React.FC = observer(() => {
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
      alert("Something is wrong; try again later. " + code.message);
    }
  };

  return (
    <React.Fragment>
      <NewTheme hideNav>
        <Stack
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            paddingX: theme.spacing(3),
          })}
        >
          {successMessage ? (
            <Stack
              sx={(theme) => ({
                display: "flex",
                padding: theme.spacing(3),
                gap: theme.spacing(1),
              })}
            >
              <Box>
                <img
                  src="../L2.jpg"
                  style={{
                    width: "200px",
                  }}
                  alt="TEE BOX"
                />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  color="primary"
                  textAlign="center"
                  sx={{ fontWeight: 700 }}
                >
                  Success!
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  color="primary"
                  textAlign="center"
                  sx={{ fontWeight: 700 }}
                >
                  Your Password change successfully
                </Typography>
              </Box>
              <Box>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate("/")}
                >
                  Go to the Login page
                </Button>
              </Box>
            </Stack>
          ) : (
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={3}
              sx={{ height: "100%" }}
            >
              <Box>
                <img
                  src="../L2.jpg"
                  style={{
                    width: "250px",
                  }}
                  alt="TEE BOX"
                />
              </Box>
              <form onSubmit={handleSubmit} autoComplete="false">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
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
                      type="password"
                      name="pass"
                      label="Password"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
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
                      color="secondary"
                      type="submit"
                    >
                      Reset Your Password
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Stack>
          )}
        </Stack>
      </NewTheme>
    </React.Fragment>
  );
});
