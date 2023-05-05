import React from 'react'
import { observer } from 'mobx-react'
import { useForm } from './hooks/useForm'
import { accountFields } from './helpers/getAccountFields'
import type UserViewModel from './UserViewModel'

interface CreateAccountProps {
  userViewModel: UserViewModel
}
const CreateAccount: React.FC<CreateAccountProps> = ({ userViewModel }) => {
  const { values, handleInputChange, isValid } = useForm(accountFields)

  const handleAccount = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    if (isValid()) {
      await userViewModel.createUser({
        id: '',
        name: values.name,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        ghinNumber: '',
        handicap: 0
      })
    }
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleAccount}>
      {accountFields.map((inputElement, key) => (
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
  )
}

export default observer(CreateAccount)
