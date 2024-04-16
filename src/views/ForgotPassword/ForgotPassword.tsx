import React, { FormEvent, useState } from "react";
import { observer } from "mobx-react";
import { passwordReset } from "./../../services/firebase";
import {
  Button,
  Stack,
  Typography,
  Paper,
  Container,
  Grid,
  TextField,
} from "@mui/material";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await passwordReset(email);
    setEmailMessage(true);
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
            {emailMessage ? (
              <h3>The Email has been sent; Check your Inbox!</h3>
            ) : (
              <form onSubmit={handleSubmit} autoComplete="false">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="email"
                      name="email"
                      label="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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

export default observer(ForgotPassword);
