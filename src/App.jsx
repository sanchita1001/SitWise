import { useState } from 'react'
import Home from './Pages/Home'
import './App.css'
import React from "react";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <Home/>
    </>
  )
}

export default App
