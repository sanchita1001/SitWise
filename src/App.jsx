import { useState } from 'react'
import Home from './Pages/Home'
import './App.css'
import React from "react";
import FloorCard from './Components/floorcard';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <Home/>
       <FloorCard />
    </>
  )
}

export default App
