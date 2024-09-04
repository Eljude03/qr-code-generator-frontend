import React, { useState } from 'react'
import './App.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [qrCode, setQrCode] = useState("")
  const [inputError, setInputError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const notifySuccess = () => {
    toast("Successfully Generated!");
  }

  const notifyError = (message) => {
    toast.error(message);
  }

  const handleError = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const url = e.target[0].value

    if (!handleError(url)) {
      setInputError(true)
      setErrorMessage("Invalid URL. Please enter a valid URL.")
      notifyError("Invalid URL. Please enter a valid URL.");
      return;
    }

    setInputError(false)
    setErrorMessage("")

    try {
      const response = await fetch(
        `https://qr-generator-0215.azurewebsites.net/api/GenerateQR?url=${url}`,
        { method: "GET", headers: { "Content-Type": "application/json" }}
      );

      if(response.ok) {
        const data = await response.json()
        setQrCode(data.qr_code_url)
        console.log(data)
        notifySuccess()
      }

    } catch (error) {
      console.log(error)
      notifyError("An error occurred while generating the QR code. Please try again.");
    }
  }

  return (
    <>
     <div className="App">
        <h2>QR Code Generator</h2>
        <form action="" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Enter a URL" 
            style={{ borderColor: inputError ? 'red' : 'initial' }} 
          />
          {inputError && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <button type="submit">Generate</button>
        </form>

        {qrCode && (<div className='qrCode'>
          <img src={qrCode} alt="qrCode" />
        </div>)}
        <ToastContainer />
     </div>
    </>
  )
}

export default App
