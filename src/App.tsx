import React from 'react'
import UserViewModel from './components/CreateAccount/UserViewModel'
import CreateAccount from './components/CreateAccount/CreateAccount'
import { ToastContainer } from 'react-toastify'
import './App.css'
import 'react-toastify/dist/ReactToastify.css'

function App (): JSX.Element {
  const uvm = new UserViewModel()
  return (
    <div className="App">
      <h1>Tourney Golf</h1>
      <CreateAccount userViewModel={uvm} />
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}

export default App
