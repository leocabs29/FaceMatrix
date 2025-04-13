import React, { useEffect, useState } from "react";
import bin from "../../assets/bin.png";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
function Capture() {
  const [captures, setCaptures] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [clickTimeouts, setClickTimeouts] = useState({});

  useEffect(() => {
    const storedCaptures = JSON.parse(localStorage.getItem("captures")) || [];
    // Add `selected: false` to each capture
    const updatedCaptures = storedCaptures.map((c) => ({ ...c, selected: false }));
    setCaptures(updatedCaptures);
  }, []);

  const handleDeleteAll = () => {
    const selectedCaptures = captures.filter((c) => c.selected);
    if (selectedCaptures.length === 0) return; // Do nothing if none selected
  
    const remainingCaptures = captures.filter((c) => !c.selected);
    localStorage.setItem("captures", JSON.stringify(remainingCaptures));
    setCaptures(remainingCaptures);
  };
  

  const handleClick = (index, imageSrc) => {
    // Clear any existing timeout for this index
    if (clickTimeouts[index]) {
      clearTimeout(clickTimeouts[index]);
    }

    // Set a timeout: if it doesn't get interrupted, treat as single click
    const timeout = setTimeout(() => {
      setZoomedImage(imageSrc);
    }, 250);

    // Save the timeout to allow cancellation
    setClickTimeouts((prev) => ({ ...prev, [index]: timeout }));
  };

  const handleDoubleClick = (index) => {
    // Cancel the single click
    if (clickTimeouts[index]) {
      clearTimeout(clickTimeouts[index]);
    }

    // Toggle selection
    const updated = [...captures];
    updated[index].selected = !updated[index].selected;
    setCaptures(updated);
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };

  return (
    <div className="bg-slate-100 w-full p-4 flex flex-col  h-screen">
      {/* Header */}
      <div className="w-full flex justify-between items-center ">
        <div className="flex space-x-4 lg:w-1/4 w-1/2 justify-center">
          <span className="font-bold text-xl text-sky-900">Captures</span>
          <div className="bg-sky-200 w-max rounded-lg text-xs h-max py-2 flex items-center space-x-1">
            <select className="text-sky-900 font-bold pl-2 hover:cursor-pointer">
              <option value="">Recent</option>
              <option value="">Name</option>
            </select>
          </div>
        </div>
        <div className="flex text-end w-1/2 p-4 justify-end hover:cursor-pointer">
          <div className="bg-sky-200 rounded-lg font-bold px-4 py-2 text-sky-900 text-xs">
            Select
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="w-full flex p-4 flex-wrap gap-x-20 gap-y-10 justify-center items-start">
        {captures.length === 0 ? (
          <p className="text-gray-500">No captures found.</p>
        ) : (
          captures.map((capture, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow p-4 w-64 space-y-2 transition-all duration-200 ${
                capture.selected ? "border-4 border-sky-500" : ""
              }`}
            >
              <img
                src={capture.image}
                alt={`Capture ${index + 1}`}
                className="rounded-md w-full h-40 object-cover cursor-pointer"
                onClick={() => handleClick(index, capture.image)}
                onDoubleClick={() => handleDoubleClick(index)}
              />
              <div className="text-sm text-sky-900 font-bold">Emotions:</div>
              <ul className="text-xs space-y-2">
                {Array.isArray(capture.emotion) ? (
                  capture.emotion.map((e, i) => (
                    <li className="" key={i}>
                      <span className="capitalize">{e.mood}:</span>{" "}
                      {e.number.toFixed(2)}
                    </li>
                  ))
                ) : (
                  <li>No emotion data</li>
                )}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* Delete All Button */}
      <div className="w-full flex justify-center hover:cursor-pointer mt-4">
      <Tooltip title="Delete" onClick={handleDeleteAll}>
      <IconButton>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
      </div>

      {/* Zoomed Image Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeZoom}
        >
          <img
            src={zoomedImage}
            alt="Zoomed"
            className="transform scale-150 transition-transform duration-300 ease-in-out max-w-[90%] max-h-[90%]"
          />
        </div>
      )}
    </div>
  );
}

export default Capture;
