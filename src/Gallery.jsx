import Nav from "./components/header/Nav"
import AnalysisGallery from "./components/body/AnalysisGallery"
import Capture from "./components/body/Capture"
import React, {useState } from "react";
function Gallery() {
  const [emotions, setEmotions] = useState([]);
  const handleEmotionUpdate = (newEmotions) => {
    setEmotions((prevEmotions) => [...prevEmotions, newEmotions]);
  };
  
  return (
    
    <>
       <div className="w-full h-screen">
              <Nav/>
              <div className="flex">
              <Capture onEmotionUpdate={handleEmotionUpdate} />
              </div>
            </div>
    </>
  )
}

export default Gallery
