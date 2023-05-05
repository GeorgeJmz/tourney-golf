import React from 'react'
import { observer } from 'mobx-react'

const Login: React.FC = () => {
  const page = 'Login Page'

  return <p>{page}</p>
}

export default observer(Login)
