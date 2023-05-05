import React from 'react'
import { ToastContainer } from 'react-toastify'
import { Routes, Route } from 'react-router-dom'
import CreateAccount from './views/CreateAccount/CreateAccount'
import Login from './views/Login/Login'
import Welcome from './views/Welcome/Welcome'
import './App.css'
import 'react-toastify/dist/ReactToastify.css'

function App (): JSX.Element {
  return (
    <div className="App">
      <h1>Tourney Golf</h1>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
      </Routes>
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
