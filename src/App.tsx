import React from 'react'
import UserViewModel from './components/CreateAccount/UserViewModel'
import CreateAccount from './components/CreateAccount/CreateAccount'
import './App.css'

function App (): JSX.Element {
  const uvm = new UserViewModel()
  return (
    <div className="App">
      <h1>Tourney Golf</h1>
      <CreateAccount userViewModel={uvm} />
    </div>
  )
}

export default App
