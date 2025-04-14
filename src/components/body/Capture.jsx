import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

function Capture() {
  const [captures, setCaptures] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [filterEmotion, setFilterEmotion] = useState("All");

  useEffect(() => {
    const storedCaptures = JSON.parse(localStorage.getItem("captures")) || [];
    const updatedCaptures = storedCaptures.map((c) => ({
      ...c,
      selected: false,
    }));
    setCaptures(updatedCaptures);
  }, []);

  const handleDeleteAll = () => {
    const remainingCaptures = captures.filter((c) => !c.selected);
    localStorage.setItem("captures", JSON.stringify(remainingCaptures));
    setCaptures(remainingCaptures);
  };

  const handleSelectClick = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      const cleared = captures.map((c) => ({ ...c, selected: false }));
      setCaptures(cleared);
    }
  };

  const handleImageClick = (index) => {
    if (selectionMode) {
      const updated = [...captures];
      updated[index].selected = !updated[index].selected;
      setCaptures(updated);
    } else {
      setZoomedImage(captures[index].image);
    }
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };

  // Get unique emotions from captures
  const uniqueEmotions = Array.from(
    new Set(
      captures.flatMap((c) =>
        c.emotion ? c.emotion.map((e) => e.mood) : []
      )
    )
  );

  // Filter and sort captures by selection and emotion
  const filteredCaptures = captures
    .filter((capture) => {
      if (filterEmotion !== "All") {
        if (!capture.emotion) return false;
        const hasEmotion = capture.emotion.some(
          (e) => e.mood.toLowerCase() === filterEmotion.toLowerCase()
        );
        return hasEmotion;
      }
      return true;
    })
    .map((capture) => {
      if (capture.emotion) {
        capture.emotion.sort((a, b) => b.number - a.number);
      }
      return capture;
    })
    .sort((a, b) => {
      const moodA = a.emotion.find((e) => e.mood.toLowerCase() === filterEmotion.toLowerCase());
      const moodB = b.emotion.find((e) => e.mood.toLowerCase() === filterEmotion.toLowerCase());

      if (moodA && moodB) {
        return moodB.number - moodA.number;
      }
      return 0;
    });
 
  return (
    <div className="bg-gradient-to-r bg-slate-100 w-full p-8 flex flex-col h-screen">
      <div className="w-full flex justify-between items-center mb-6">
        <div className="flex space-x-4 lg:w-1/4 w-full justify-center">
          <span className="font-semibold text-3xl text-sky-900">Captures</span>
          <div className="bg-sky-200 w-max rounded-lg text-sm h-max py-2 flex items-center space-x-1">
            <select
              className="text-sky-900 font-bold pl-2 hover:cursor-pointer bg-transparent outline-none rounded-md focus:ring-2 focus:ring-sky-400"
              value={filterEmotion}
              onChange={(e) => setFilterEmotion(e.target.value)}
            >
              <option value="All">All</option>
              {uniqueEmotions.map((mood, index) => (
                <option key={index} value={mood}>
                  {mood}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex text-end w-full lg:w-1/2 justify-end">
          <div
            onClick={handleSelectClick}
            className={`rounded-lg font-bold px-6 py-2 text-sm hover:cursor-pointer transition-all duration-200 ease-in-out transform ${
              selectionMode
                ? "bg-sky-900 text-white hover:bg-sky-800"
                : "bg-sky-200 text-sky-900 hover:bg-sky-300"
            }`}
          >
            {selectionMode ? "Cancel" : "Select"}
          </div>
        </div>
      </div>

      <div className="w-full flex p-6 flex-wrap gap-6 justify-center items-start">
        {filteredCaptures.length === 0 ? (
          <p className="text-gray-500 text-lg">No captures found.</p>
        ) : (
          filteredCaptures.map((capture, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-lg p-6 w-64 space-y-3 transition-all duration-300 ease-in-out transform hover:scale-105 ${
                capture.selected ? "border-4 border-sky-500" : "hover:shadow-xl"
              }`}
            >
              <img
                src={capture.image}
                alt="Capture"
                className="rounded-md w-full h-40 object-cover cursor-pointer transition-transform duration-300 ease-in-out"
                onClick={() => handleImageClick(captures.indexOf(capture))}
              />
              <div className="text-sm text-sky-900 font-bold">Emotions:</div>
              <ul className="text-xs space-y-1 text-gray-700">
                {Array.isArray(capture.emotion) ? (
                  capture.emotion.map((e, i) => (
                    <li key={i}>
                      <span className="capitalize font-semibold">{e.mood}:</span>{" "}
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

      <div className="w-full flex justify-center hover:cursor-pointer mt-6">
        <Tooltip title="Delete Selected" onClick={handleDeleteAll}>
          <IconButton className="transition-all duration-300 ease-in-out hover:bg-sky-500 hover:text-white">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>

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
