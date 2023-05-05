import React from 'react'
import { observer } from 'mobx-react'
import CreateAccountForm from './components/CreateAccountForm/CreateAccountForm'
import UserViewModel from '../../viewModels/UserViewModel'

const CreateAccount: React.FC = () => {
  const page = 'Create Account Page'
  const uvm = new UserViewModel()
  return (
    <React.Fragment>
      <h2>{page}</h2>
      <CreateAccountForm userViewModel={uvm} />
    </React.Fragment>
  )
}

export default observer(CreateAccount)
