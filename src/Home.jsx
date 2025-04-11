import Nav from "./components/header/Nav";
import Analysis from "./components/body/Analysis";
import Camera from "./components/body/Camera";
import React, { useState } from "react";
function Home() {
  
    
  return (
    <div className="w-full ">
      <Nav />
      <div className="flex  h-screen">
        <Camera  />
      </div>
    </div>
  );
}

export default Home;
