import React from "react";
import { observer } from "mobx-react";
import { useForm } from "../../../../hooks/useForm";
import { accountFields } from "../../../../helpers/getAccountFields";
import type UserViewModel from "../../../../viewModels/UserViewModel";
import { Button, TextField, Box } from "@mui/material";

interface CreateAccountFormProps {
  userViewModel: UserViewModel;
}

const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
  userViewModel,
}) => {
  const { values, handleInputChange, isValid } = useForm(accountFields);

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
  const handleAccount = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (isValid()) {
      await userViewModel.createUser({
        id: "",
        name: values.name,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        ghinNumber: "",
        handicap: 0,
      });
    }
  };

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleAccount}
    >
      {accountFields.map((inputElement, key) => (
        <TextField
          key={key}
          type={inputElement.input}
          name={inputElement.name}
          label={inputElement.placeholder}
          value={values[inputElement.name]}
          onChange={handleInputChange}
          margin="normal"
          required
        />
      ))}
      <Button
        type="submit"
        variant="contained"
        disabled={!isValid()}
        size="large"
        sx={{ minWidth: "250px" }}
      >
        Create Account
      </Button>
      {/* <Button
        type="button"
        variant="contained"
        size="large"
        sx={{ minWidth: "250px" }}
        onClick={() => {
          createMultipleAccounts();
        }}
      >
        Create Multiple Accounts
      </Button> */}
    </Box>
  );
};

export default observer(CreateAccountForm);
