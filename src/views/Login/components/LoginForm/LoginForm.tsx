/* eslint-disable @typescript-eslint/no-misused-promises */
import React from "react";
import { observer } from "mobx-react";
import { useForm } from "../../../../hooks/useForm";
import type UserViewModel from "../../../../viewModels/UserViewModel";
import { loginFields } from "../../../../helpers/getAccountFields";

interface LoginFormProps {
  userViewModel: UserViewModel;
}
const LoginForm: React.FC<LoginFormProps> = ({ userViewModel }) => {
  const { values, handleInputChange, isValid } = useForm(loginFields);

  const handleAccount = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    const { email, password } = values;
    event.preventDefault();
    if (isValid()) {
      await userViewModel.loginUser(email, password);
    }
  };

  return (
    <form onSubmit={handleAccount}>
      {loginFields.map((inputElement, key) => (
        <input
          key={key}
          type={inputElement.input}
          name={inputElement.name}
          placeholder={inputElement.placeholder}
          value={values[inputElement.name]}
          onChange={handleInputChange}
        />
      ))}
      <button type="submit">Login</button>
    </form>
  );
};

export default observer(LoginForm);
