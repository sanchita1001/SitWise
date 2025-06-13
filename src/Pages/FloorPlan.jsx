import React from 'react'
import { useParams } from 'react-router-dom'
import { motion } from "framer-motion";
import Floorplan from '../Components/Floorplan'

function FloorPlan() {
  const { floorId } = useParams();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
    >
      <Floorplan floor={floorId} />
    </motion.div>
  );
}

export default FloorPlan;
