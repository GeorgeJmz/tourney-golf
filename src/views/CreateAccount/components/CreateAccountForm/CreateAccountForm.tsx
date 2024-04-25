import React from "react";
import { observer } from "mobx-react";
import { useForm } from "../../../../hooks/useForm";
import {
  createAccountElements,
  accountFieldsValidation,
  accountFieldsEmpty,
  IAccountElement,
} from "../../../../helpers/getAccountFields";
import type UserViewModel from "../../../../viewModels/UserViewModel";
import {
  Button,
  TextField,
  Box,
  Tooltip,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Grid,
  FormHelperText,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { TextInput } from "../../../../components/TextInput";
import { useFormik } from "formik";

interface CreateAccountFormProps {
  userViewModel: UserViewModel;
}

const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
  userViewModel,
}) => {
  //const { values, handleInputChange, isValid } = useForm(accountFields);

  const createMultipleAccounts = async () => {
    const createAllUsers = [
      {
        id: "ddVdnjGRzoMBJRS8aKLVfl9pBB33",
        name: "Adrian",
        lastName: "Aburto",
        email: "jeckox@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "Oyuy6KqXvQfJlUldPrM2KScenRC3",
        name: "Matias",
        lastName: "Aburto",
        email: "matias@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "27dFibaJ2YbAAUilteidEsboAdD3",
        name: "Daniela",
        lastName: "Cuenca",
        email: "daniela@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "sIfGnUHyuVNANPwI0jFgeXW5x7A3",
        name: "Jorge",
        lastName: "Jimenez",
        email: "jjimenez@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "6B5gPW9CEUOZGJXmWodHiNh5un22",
        name: "Player 1",
        lastName: "Test",
        email: "player1@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "7aPYG740DuTT9MJi0CrzEYF5kNX2",
        name: "Player 2",
        lastName: "Test",
        email: "player2@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "mkewqo7BubZxnBkwCSo50FKFYSj2",
        name: "Player 3",
        lastName: "Test",
        email: "player3@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "V4kj9hyvgsQVbrFnS0inTKvI9qn1",
        name: "Player 4",
        lastName: "Test",
        email: "player4@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "yQEjxI16GTQDMgA9Pm74X1KnPgx2",
        name: "Player 5",
        lastName: "Test",
        email: "player5@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "CqnHxXEhyefDdzcbCDdd8CO5sq62",
        name: "Player 6",
        lastName: "Test",
        email: "player6@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "vgqWzIcsCOPo4K5p1gIW0NhK1Yn1",
        name: "Player 7",
        lastName: "Test",
        email: "player7@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "TLTxQQDjYcMM2bC7i6qfLjkrHKq2",
        name: "Player 8",
        lastName: "Test",
        email: "player8@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "bV7mRoFZ8pOsQ4wHPjn4LCOV2uC3",
        name: "Player 9",
        lastName: "Test",
        email: "player9@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "dG4CKQuUNKMOm1KTPudd7kh3eN42",
        name: "Player 10",
        lastName: "Test",
        email: "player10@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "lXhtAMY4mZYttcKUTDF0laimZxn2",
        name: "Player 11",
        lastName: "Test",
        email: "player11@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "cnF76rsfNChjI16NRppqhxab2Y33",
        name: "Player 12",
        lastName: "Test",
        email: "player12@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "PcRR1cIRzrV1r6zYKinGO81AAO23",
        name: "Player 13",
        lastName: "Test",
        email: "player13@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "JCuUKhVwdHO4XnDr4aZVku09ajL2",
        name: "Player 14",
        lastName: "Test",
        email: "player14@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "DKp7o30czcd69acv7GnpNTJKnw92",
        name: "Player 15",
        lastName: "Test",
        email: "player15@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "Jl9OLROGJwNuSD64DeLg0lir3ep1",
        name: "Player 16",
        lastName: "Test",
        email: "player16@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "0yaQmJkHb1N5wSgMZDy840bn7Er1",
        name: "Player 17",
        lastName: "Test",
        email: "player17@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "zVuPito3GEPe1Pi65WD2I6V5XNX2",
        name: "Player 18",
        lastName: "Test",
        email: "player18@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "MNCJswbVL6XaJhoAPO8A89qkkFH3",
        name: "Player 19",
        lastName: "Test",
        email: "player19@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
      {
        id: "GDzmdvsqjzUsoB3xeW6k4tv4uZk2",
        name: "Player 20",
        lastName: "Test",
        email: "player20@gmail.com",
        password: "Pass12345",
        ghinNumber: "",
        handicap: 0,
      },
    ];
    createAllUsers.forEach(
      async (user) => await userViewModel.createDBUser(user)
    );
  };
  // const handleAccount = async (
  //   event: React.FormEvent<HTMLFormElement>
  // ): Promise<void> => {
  //   event.preventDefault();
  //   if (isValid()) {
  //     await userViewModel.createUser({
  //       id: "",
  //       name: values.name,
  //       lastName: values.lastName,
  //       email: values.email,
  //       password: values.password,
  //       ghinNumber: "",
  //       handicap: 0,
  //     });
  //   }
  // };

  const validationSchema = accountFieldsValidation;

  const formik = useFormik({
    initialValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
    } as IAccountElement,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await userViewModel.createUser({
        id: "",
        name: values.name,
        lastName: values.lastName,
        email: values?.email.toLowerCase() || "",
        password: values.password,
        ghinNumber: "",
        handicap: 0,
      });
      //user.updateUser(newUser);
      //setTimeout(() => navigate("/dashboard"), 1000);
    },
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        "& > :not(style)": { m: 1 },
      }}
    >
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Grid direction="column" container spacing={2} sx={{ p: 3 }}>
          {createAccountElements.map((inputElement, key) => {
            const isError = Boolean(
              formik.touched[inputElement.name] &&
                Boolean(formik.errors[inputElement.name])
            );
            if (inputElement.input === "password") {
              return (
                <Grid
                  key={inputElement.name}
                  item
                  xs={inputElement.size.xs}
                  md={inputElement.size.md}
                >
                  <Tooltip title="Pasword minimum requirements: 8 Characters, One Capital Letter, One Number">
                    <FormControl
                      sx={{ my: 2, width: "100%" }}
                      variant="outlined"
                      error={isError}
                    >
                      <InputLabel htmlFor="outlined-adornment-password">
                        Password
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        key={key}
                        type={showPassword ? "text" : "password"}
                        name={inputElement.name}
                        label={inputElement.placeholder}
                        value={formik.values[inputElement.name]}
                        onChange={formik.handleChange}
                        required
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText id="component-helper-text">
                        {formik.touched[inputElement.name]
                          ? formik.errors[inputElement.name]
                          : ""}
                      </FormHelperText>
                    </FormControl>
                  </Tooltip>
                </Grid>
              );
            }
            return (
              <TextInput
                key={inputElement.name}
                inputElement={inputElement}
                isError={isError}
                onChangeHandler={formik.handleChange}
                error={
                  formik.touched[inputElement.name]
                    ? formik.errors[inputElement.name]
                    : ""
                }
                value={formik.values[inputElement.name]}
              />
            );
          })}
          <Grid item xs={12}>
            <FormControl>
              <div style={{ display: "flex" }}>
                <Button type="submit" variant="contained" size="large">
                  Create Account
                </Button>
              </div>
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </Box>
    //<Box
    //   component="form"
    //   sx={{
    //     "& > :not(style)": { m: 1, width: "25ch" },
    //   }}
    //   noValidate
    //   autoComplete="off"
    //   onSubmit={handleAccount}
    // >
    //   {accountFields.map((inputElement, key) => {
    //     return inputElement.input !== "password" ? (
    //       <TextField
    //         key={key}
    //         type={inputElement.input}
    //         name={inputElement.name}
    //         label={inputElement.placeholder}
    //         value={values[inputElement.name]}
    //         onChange={handleInputChange}
    //         margin="normal"
    //         required
    //       />
    //     ) : (
    //       <React.Fragment>
    //         <Tooltip title="Pasword minimum requirements: 8 Characters, One Capital Letter, One Number">
    //           <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
    //             <InputLabel htmlFor="outlined-adornment-password">
    //               Password
    //             </InputLabel>
    //             <OutlinedInput
    //               id="outlined-adornment-password"
    //               key={key}
    //               type={showPassword ? "text" : "password"}
    //               name={inputElement.name}
    //               label={inputElement.placeholder}
    //               value={values[inputElement.name]}
    //               onChange={handleInputChange}
    //               required
    //               endAdornment={
    //                 <InputAdornment position="end">
    //                   <IconButton
    //                     aria-label="toggle password visibility"
    //                     onClick={handleClickShowPassword}
    //                     onMouseDown={handleMouseDownPassword}
    //                     edge="end"
    //                   >
    //                     {showPassword ? <VisibilityOff /> : <Visibility />}
    //                   </IconButton>
    //                 </InputAdornment>
    //               }
    //             />
    //           </FormControl>
    //         </Tooltip>
    //       </React.Fragment>
    //     );
    //   })}
    //   <Button
    //     type="submit"
    //     variant="contained"
    //     disabled={!isValid()}
    //     size="large"
    //     sx={{ minWidth: "250px" }}
    //   >
    //     Create Account
    //   </Button>
    //   {/* <Button
    //     type="button"
    //     variant="contained"
    //     size="large"
    //     sx={{ minWidth: "250px" }}
    //     onClick={() => {
    //       createMultipleAccounts();
    //     }}
    //   >
    //     Create Multiple Accounts
    //   </Button> */}
    // </Box>
  );
};

export default observer(CreateAccountForm);
