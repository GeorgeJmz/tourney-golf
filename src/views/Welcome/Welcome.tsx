import React from 'react'
import { observer } from 'mobx-react'

const Welcome: React.FC = () => {
  const page = 'Welcome Page'

  return <p>{page}</p>
}

export default observer(Welcome)
