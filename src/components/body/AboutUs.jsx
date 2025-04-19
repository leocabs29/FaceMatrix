import React from 'react'
import Nav from '../header/Nav'
import { User, Camera, Image, Filter, Trash } from 'lucide-react';
function AboutUs() {
  return (
    <>
    <Nav/>
    <div className="bg-gray-100 p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Login Section */}
    
          
          {/* Camera Setup Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <div className="bg-teal-800 p-3 rounded-full">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-teal-800 font-medium text-xl text-center mb-2">Camera Setup and Face Scan Warning</h2>
            
            <div className="mb-4">
              <p className="font-medium mb-2">Before Starting:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Clean your camera with a soft cloth for the best results.</li>
              </ul>
            </div>
            
            <div>
              <p className="font-medium mb-2">Start Camera:</p>
              <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                <li>Click the <span className="font-medium">"Camera"</span> button at the upper right.</li>
                <li>Grant permission to access your device's camera.</li>
                <li>Once activated, your live camera will be displayed along with the emotions detected.</li>
              </ol>
            </div>
          </div>
          
          {/* Capturing Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <div className="bg-teal-800 p-3 rounded-full">
                <Image size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-teal-800 font-medium text-xl text-center mb-4">Capturing an Image</h2>
            
            <ol className="list-decimal pl-6 space-y-2 text-gray-600">
              <li>Position your face clearly in the frame.</li>
              <li>Click the <span className="font-medium">"Capture Image"</span> button below.</li>
              <li>The app will process your facial expression and assign an emotion label (e.g., Happy, Sad, Angry, etc.).</li>
              <li>The captured image will appear in your captures with the detected emotion shown below.</li>
            </ol>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Filtering Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <div className="bg-teal-800 p-3 rounded-full">
                <Filter size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-teal-800 font-medium text-xl text-center mb-4">Filtering Images by Emotion</h2>
            
            <ol className="list-decimal pl-6 space-y-2 text-gray-600">
              <li>At the top of the captures, find the Emotion Filter Dropdown on the upper left.</li>
              <li>Click to open it and select an emotion (e.g., Happy, Neutral, Sad, Angry, Disgust).</li>
              <li>The gallery will automatically show only images that match the selected emotion.</li>
              <li>To reset the view, select <span className="font-medium">"All Emotions"</span>.</li>
            </ol>
          </div>
          
          {/* Deleting Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <div className="bg-teal-800 p-3 rounded-full">
                <Trash size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-teal-800 font-medium text-xl text-center mb-4">Deleting an Image</h2>
            
            <ol className="list-decimal pl-6 space-y-2 text-gray-600">
              <li>Go to the <span className="font-medium">"Captures"</span> section.</li>
              <li>Click the <span className="font-medium">"Select"</span> button on the upper right.</li>
              <li>Select the images you want to delete and then click the <span className="font-medium">"Trash Icon"</span> at the bottom to delete.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default AboutUs