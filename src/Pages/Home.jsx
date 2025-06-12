import React from 'react'
import Hero from "../Components/Hero.jsx";
import FloorCard from '../Components/floorcard.jsx';
import Navbar from "../Components/Navbar.jsx"

function Home() {
  return (
    <div>
      <Hero/>
      <FloorCard/>
      <Navbar/>
    </div>
  )
}

export default Home
