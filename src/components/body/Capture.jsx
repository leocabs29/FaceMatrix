import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import toast, { Toaster } from "react-hot-toast";
function Capture() {
  const [captures, setCaptures] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [filterEmotion, setFilterEmotion] = useState("All");
  let userId = localStorage.getItem('userId')
  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        const response = await fetch(`http://localhost:5000/images/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const images = await response.json();
        const updatedCaptures = images.map((c) => ({
          ...c,
          selected: false,
        }));
        setCaptures(updatedCaptures);
      } catch (error) {
        console.error("Error fetching images:", error);
        toast.error("Error fetching images. Please try again.");
      }
    };

    fetchUserImages();
  }, [userId]);



  const handleDeleteSelected = () => {
    const selectedCaptures = captures.filter((c) => c.selected);
    
    if (selectedCaptures.length === 0) {
      toast.error("No images selected to delete.");
      return;
    }

    // Make an API request to delete selected images
    const idsToDelete = selectedCaptures.map((capture) => capture._id);

    fetch("http://localhost:5000/images/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: idsToDelete }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update captures to remove the deleted ones
        const remainingCaptures = captures.filter((c) => !c.selected);
        setCaptures(remainingCaptures);
        toast.success(`${data.message}`);
      })
      .catch((error) => {
        console.error("Error deleting images:", error);
        toast.error("Error deleting images. Please try again.");
      });
  };

  const handleDeleteAll = () => {
    toast.success("Deleted");
    const remainingCaptures = captures.filter((c) => !c.selected);
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
      const moodA = a.emotion?.find((e) => e.mood.toLowerCase() === filterEmotion.toLowerCase());
      const moodB = b.emotion?.find((e) => e.mood.toLowerCase() === filterEmotion.toLowerCase());

      if (moodA && moodB) {
        return moodB.number - moodA.number;
      }
      return 0;
    });

  // Variants for framer-motion animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.15 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)"
    },
    tap: { 
      scale: 0.95 
    }
  };
  
  return (
    <motion.div 
      className="bg-gradient-to-r bg-slate-100 w-full p-8 flex flex-col h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-full flex justify-between items-center mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        <div className="flex space-x-4 lg:w-1/4 w-full justify-center">
          <motion.span 
            className="font-semibold text-3xl text-sky-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Captures
          </motion.span>
          <motion.div 
            className="bg-sky-200 w-max rounded-lg text-sm h-max py-2 flex items-center space-x-1"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
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
          </motion.div>
        </div>

        <div className="flex text-end w-full lg:w-1/2 justify-end">
          <motion.div
            onClick={handleSelectClick}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className={`rounded-lg font-bold px-6 py-2 text-sm hover:cursor-pointer transition-all duration-200 ease-in-out transform ${
              selectionMode
                ? "bg-[#01384D] text-white hover:bg-[#CAE7EF]"
                : "bg-sky-200 text-sky-900 hover:bg-sky-300"
            }`}
          >
            {selectionMode ? "Cancel" : "Select"}
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="w-full flex p-6 flex-wrap gap-6 justify-center items-start"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {filteredCaptures.length === 0 ? (
            <motion.p 
              key="no-captures"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-500 text-lg"
            >
              No captures found.
            </motion.p>
          ) : (
            filteredCaptures.map((capture, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                layout
                layoutId={`card-${captures.indexOf(capture)}`}
                className={`bg-white rounded-lg shadow-lg p-6 w-64 space-y-3 transition-all duration-300 ease-in-out ${
                  capture.selected ? "border-4 border-sky-500" : ""
                }`}
              >
                <motion.img
                  src={capture.image}
                  alt="Capture"
                  className="rounded-md w-full h-40 object-cover cursor-pointer"
                  onClick={() => handleImageClick(captures.indexOf(capture))}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <motion.div 
                  className="text-sm text-sky-900 font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Emotions:
                </motion.div>
                <motion.ul 
                  className="text-xs space-y-1 text-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {Array.isArray(capture.emotion) ? (
                    capture.emotion.map((e, i) => (
                      <motion.li 
                        key={i}
                        initial={{ x: -5, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                      >
                        <span className="capitalize font-semibold">{e.mood}:</span>{" "}
                        {e.number.toFixed(2)}
                      </motion.li>
                    ))
                  ) : (
                    <motion.li>No emotion data</motion.li>
                  )}
                </motion.ul>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div 
        className="w-full flex justify-center mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Tooltip title="Delete Selected">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <IconButton 
              onClick={handleDeleteSelected}
              className="transition-all duration-300 ease-in-out hover:bg-sky-500 hover:text-red-400"
            >
              <DeleteIcon />
            </IconButton>
          </motion.div>
        </Tooltip>
      </motion.div>

      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeZoom}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={zoomedImage}
              alt="Zoomed"
              className="max-w-[90%] max-h-[90%]"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Capture;