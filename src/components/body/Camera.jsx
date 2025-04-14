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

const EMOTIONS = [
  { icon: happy, mood: "Happy" },
  { icon: neutral, mood: "Neutral" },
  { icon: sad, mood: "Sad" },
  { icon: surprised, mood: "Surprised" },
  { icon: angry, mood: "Angry" },
  { icon: disgust, mood: "Disgust" },
];

function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [allExpressions, setAllExpressions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCamera, setCurrentCamera] = useState("user"); // 'user' (front) or 'environment' (back)

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
    startVideo();
    loadModels();

    return () => {
      clearInterval(intervalRef.current);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      console.log("Models loaded successfully");
      startFaceDetection();
    } catch (err) {
      console.error("Error loading models:", err);
    }
  };

  const startVideo = (facingMode = "user") => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing webcam:", err);
      });
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
    const video = videoRef.current;
    return await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
  };

  const drawDetections = (detections) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Mirror canvas context
    context.save();
    context.scale(-1, 1); // Flip horizontally
    context.translate(-canvas.width, 0); // Move back into view

    const resizedDetections = faceapi.resizeResults(detections, {
      width: video.videoWidth,
      height: video.videoHeight,
    });

    // Draw mirrored detections
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

    return EMOTIONS.map(({ icon, mood }) => {
      const moodKey = mood.toLowerCase();
      const value = totals[moodKey] || 0;

      return {
        icon,
        mood,
        number: parseFloat(value.toFixed(2)),
      };
    });
  };

  // Function to capture the current frame and save it to localStorage
 

  const captureImageAndEmotion = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (video.readyState === 4) {
      // Video is fully loaded
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/png");
      const existingCaptures =
        JSON.parse(localStorage.getItem("captures")) || [];

      // Generate a unique ID using timestamp
      const uniqueId = Date.now(); // You could use UUID too if needed

      // Sum emotions across all detected faces
      const emotion =
        allExpressions.length > 0 ? getEmotionData(allExpressions) : null;

      const newCapture = {
        id: uniqueId, // ✅ Add this line
        image: imageData,
        emotion: emotion,
      };

      existingCaptures.push(newCapture);
      localStorage.setItem("captures", JSON.stringify(existingCaptures));

      toast.success("Successfully captured with emotion!");
    } else {
      toast.error("Video not ready. Try again in a moment.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      {/* Analysis Panel */}
      <div className="w-full lg:w-1/4 border border-gray-100 p-4">
        <p className="font-secondary text-sky-900 text-xl text-center font-bold mb-4">
          Analysis
        </p>

        {allExpressions.length === 0 ? (
          <p className="text-center text-gray-400 font-secondary">
            No face detected
          </p>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-sm font-semibold text-sky-700 mb-2">
              Emotions ({allExpressions.length} face
              {allExpressions.length > 1 ? "s" : ""})
            </p>
            {allExpressions.map((expressions, idx) => (
              <div key={idx} className="border-t border-gray-200 pt-2">
                <p className="text-center text-sm font-semibold text-sky-700 mb-2">
                  Face #{idx + 1}
                </p>
                {getEmotionData([expressions]).map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between  space-y-4 items-center px-2 py-1"
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={item.icon}
                        className="w-5 lg:w-6"
                        alt={item.mood}
                      />
                      <span className="font-secondary font-bold text-sky-900 text-xs lg:text-sm">
                        {item.mood}
                      </span>
                    </div>
                    <span className="font-secondary font-bold text-sky-900 text-sm">
                      {item.number}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Camera Preview */}
      <div className="flex-1 bg-slate-100 flex flex-col justify-center items-center p-4 space-y-4">
        <div className="relative w-full h-[600px] lg:h-[600px]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain rounded-lg"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full -scale-x-100"
          />
        </div>
        <div className="space-x-2 flex items-center justify-center">
          <img
            src={cameraButton}
            className="w-12 sm:w-16 p-2 cursor-pointer"
            onClick={captureImageAndEmotion}
            alt="Capture"
          />
          <CameraswitchIcon
            fontSize="medium"
            className="hover:cursor-pointer"
            onClick={switchCamera}
          />
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Camera;
