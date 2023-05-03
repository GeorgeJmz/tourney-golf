import React, { useState } from 'react'
import { observer } from 'mobx-react'
import type UserViewModel from './UserViewModel'

interface CreateAccountProps {
  userViewModel: UserViewModel
}

const CreateAccount: React.FC<CreateAccountProps> = ({ userViewModel }) => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPassword(event.target.value)
  }

  const handleAccount = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    try {
      await userViewModel.createUser({
        id: '',
        name: '',
        lastName: '',
        email,
        password,
        ghinNumber: '',
        handicap: 0
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleAccount}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <button type="submit">Login</button>
    </form>
  )
}

export default observer(CreateAccount)
