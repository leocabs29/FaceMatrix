import React, { useRef, useEffect, useState, useCallback } from "react";
import * as faceapi from "face-api.js";
import cameraButton from "../../assets/camerabutton.png";
import angry from "../../assets/angry.png";
import sad from "../../assets/sad.png";
import neutral from "../../assets/neutral.png";
import happy from "../../assets/happy.png";
import surprised from "../../assets/surprised.png";
import disgust from "../../assets/disgust.png";
import toast, { Toaster } from "react-hot-toast";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import { motion } from "framer-motion";

const EMOTIONS = [
  { icon: happy, mood: "Happy", color: "bg-yellow-100" },
  { icon: neutral, mood: "Neutral", color: "bg-blue-100" },
  { icon: sad, mood: "Sad", color: "bg-indigo-100" },
  { icon: surprised, mood: "Surprised", color: "bg-purple-100" },
  { icon: angry, mood: "Angry", color: "bg-red-100" },
  { icon: disgust, mood: "Disgust", color: "bg-green-100" },
];

function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [allExpressions, setAllExpressions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCamera, setCurrentCamera] = useState("user"); // 'user' (front) or 'environment' (back)
  const [cameraActive, setCameraActive] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);

  const updateExpressions = useCallback(
    (detections) => {
      if (!isProcessing) {
        setIsProcessing(true);
        setAllExpressions(detections.map((d) => d.expressions));
        requestAnimationFrame(() => setIsProcessing(false));
      }
    },
    [isProcessing]
  );

  useEffect(() => {
    const init = async () => {
      await startVideo();
      await loadModels();
    };
    
    init();

    return () => {
      clearInterval(intervalRef.current);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const loadModels = async () => {
    try {
      setLoadingModels(true);

      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      
      console.log("Models loaded successfully");
      setLoadingModels(false);
      startFaceDetection();
    } catch (err) {
      toast.error("Error loading models. Please refresh.", { id: "models-loading" });
      console.error("Error loading models:", err);
      setLoadingModels(false);
    }
  };

  const startVideo = async (facingMode = "user") => {
    try {
      const constraints = { 
        video: { 
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setCameraActive(true);
        };
      }
    } catch (err) {
      toast.error("Error accessing camera. Please check permissions.");
      console.error("Error accessing webcam:", err);
    }
  };

  const switchCamera = () => {
    const newCamera = currentCamera === "user" ? "environment" : "user";
    setCurrentCamera(newCamera);

    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }

    startVideo(newCamera);
  };

  const startFaceDetection = () => {
    intervalRef.current = setInterval(async () => {
      if (videoRef.current && canvasRef.current && !isProcessing) {
        const detections = await detectFaces();
        drawDetections(detections);
        if (detections.length > 0) {
          updateExpressions(detections);
        } else {
          setAllExpressions([]); // Clear if no faces
        }
      }
    }, 200);
  };

  const detectFaces = async () => {
    try {
      const video = videoRef.current;
      return await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
    } catch (error) {
      console.error("Error detecting faces:", error);
      return [];
    }
  };

  const drawDetections = (detections) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Mirror canvas context if using front camera
    context.save();
    if (currentCamera === "user") {
      context.scale(-1, 1); // Flip horizontally
      context.translate(-canvas.width, 0); // Move back into view
    }

    const resizedDetections = faceapi.resizeResults(detections, {
      width: video.videoWidth,
      height: video.videoHeight,
    });

    // Draw detection boxes with custom styles
    context.lineWidth = 3;
    context.strokeStyle = '#2DD4BF'; // Teal color
    
    // Draw detections
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    context.restore();
  };

  const getEmotionData = (allExpressions) => {
    const totals = {};

    allExpressions.forEach((expressions) => {
      EMOTIONS.forEach(({ mood }) => {
        const key = mood.toLowerCase();
        totals[key] = (totals[key] || 0) + (expressions[key] || 0);
      });
    });

    return EMOTIONS.map(({ icon, mood, color }) => {
      const moodKey = mood.toLowerCase();
      const value = totals[moodKey] || 0;

      return {
        icon,
        mood,
        color,
        number: parseFloat(value.toFixed(2)),
      };
    }).sort((a, b) => b.number - a.number); // Sort by highest emotion
  };

  const captureImageAndEmotion = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) {
      toast.error("Camera not ready. Please try again.");
      return;
    }
    
    const context = canvas.getContext("2d");

    if (video.readyState === 4) {
      // Video is fully loaded
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (currentCamera === "user") {
        // Mirror the image for front camera
        context.save();
        context.scale(-1, 1);
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        context.restore();
      } else {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      const imageData = canvas.toDataURL("image/png");
      const existingCaptures =
        JSON.parse(localStorage.getItem("captures")) || [];

      // Generate a unique ID using timestamp
      const uniqueId = Date.now();

      // Sum emotions across all detected faces
      const emotion =
        allExpressions.length > 0 ? getEmotionData(allExpressions) : null;

      // Get dominant emotion
      const dominantEmotion = emotion && emotion.length > 0 ? emotion[0].mood : "Unknown";

      const newCapture = {
        id: uniqueId,
        image: imageData,
        emotion: emotion,
        timestamp: new Date().toISOString(),
        dominantEmotion: dominantEmotion
      };

      existingCaptures.push(newCapture);
      localStorage.setItem("captures", JSON.stringify(existingCaptures));

      // Create animation effect for capture
      const flashEffect = document.createElement('div');
      flashEffect.className = 'fixed inset-0 bg-white z-50';
      flashEffect.style.opacity = '0.8';
      document.body.appendChild(flashEffect);
      
      setTimeout(() => {
        flashEffect.style.opacity = '0';
        flashEffect.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
          document.body.removeChild(flashEffect);
        }, 500);
      }, 100);

      toast.success(`Captured! Dominant emotion: ${dominantEmotion}`, {
        icon: '📸',
        duration: 3000
      });
    } else {
      toast.error("Video not ready. Try again in a moment.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
    
      

      <div className="flex flex-col lg:flex-row w-full">
        {/* Analysis Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/4 p-4 bg-white border-r border-gray-200 shadow-md"
        >
          <h2 className="text-center font-bold text-xl text-teal-800 mb-4 border-b pb-2">
            Emotion Analysis
          </h2>

          {loadingModels ? (
            <div className="flex flex-col items-center justify-center h-40">
              <div className="w-12 h-12 border-4 border-teal-800 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : allExpressions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No face detected</p>
              <p className="text-gray-400 text-sm mt-2">Position your face in the frame</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-sm font-semibold text-teal-700 mb-2">
                <span className="bg-teal-100 px-3 py-1 rounded-full">
                  {allExpressions.length} face{allExpressions.length > 1 ? "s" : ""} detected
                </span>
              </p>
              {allExpressions.map((expressions, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="border rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="bg-teal-50 py-2 px-4 border-b border-teal-100">
                    <p className="text-center text-sm font-bold text-teal-800">
                      Face #{idx + 1}
                    </p>
                  </div>
                  <div className="bg-white">
                    {getEmotionData([expressions]).map((item, i) => (
                      <div 
                        key={i} 
                        className={`flex justify-between items-center py-2 px-4 ${i === 0 ? `${item.color} border-l-4 border-teal-500` : ''}`}
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={item.icon}
                            className="w-6 h-6"
                            alt={item.mood}
                          />
                          <span className={`text-sm font-bold ${i === 0 ? 'text-teal-800' : 'text-gray-700'}`}>
                            {item.mood}
                          </span>
                        </div>
                        <div className="w-1/3 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-teal-600 h-2.5 rounded-full" 
                            style={{ width: `${item.number * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-700 ml-2 w-12 text-right">
                          {item.number}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Camera Preview */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 bg-gray-100 flex flex-col justify-center items-center p-4 space-y-4"
        >
          <div className="relative w-full max-w-4xl h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] mx-auto rounded-lg overflow-hidden shadow-lg">
            {!cameraActive && !loadingModels && (
              <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-10">
                <div className="text-center text-white p-6">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-xl font-bold">Camera Access Required</p>
                  <p className="mt-2">Please allow camera access to use the emotion detection features</p>
                </div>
              </div>
            )}
            {loadingModels && (
              <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-10">
                <div className="text-center text-white p-6">
                  <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-xl font-bold">Loading AI Models</p>
                  <p className="mt-2">This may take a few moments...</p>
                </div>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-lg"
            />
            <canvas
              ref={canvasRef}
              className={`absolute top-0 left-0 w-full h-full ${currentCamera === "user" ? "-scale-x-100" : ""}`}
            />
            
            {/* Camera corner brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-teal-500 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-teal-500 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-teal-500 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-teal-500 rounded-br-lg"></div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 p-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white p-3 rounded-full shadow-lg"
              onClick={captureImageAndEmotion}
              disabled={loadingModels || allExpressions.length === 0}
            >
              <img
                src={cameraButton}
                className="w-10 h-10 object-contain"
                alt="Capture"
              />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white p-3 rounded-full shadow-lg"
              onClick={switchCamera}
              disabled={loadingModels}
            >
              <CameraswitchIcon fontSize="medium" className="text-teal-800" />
            </motion.button>
          </div>
          
          <p className="text-sm text-gray-500 text-center max-w-md">
            Position your face in the frame and click the camera button to capture your emotion
          </p>
        </motion.div>
      </div>
      
      {/* CSS for camera flash effect */}
      <style jsx>{`
        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default Camera;