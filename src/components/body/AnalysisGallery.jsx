import angry from "../../assets/angry.png";
import sad from "../../assets/sad.png";
import neutral from "../../assets/neutral.png";
import happy from "../../assets/happy.png";
import camera from "../../assets/camera.png";
import surprised from "../../assets/surprised.png";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import sample from "../../assets/samplehappy.jpg";
import { useState } from "react";
import { Link } from "react-router-dom";
function AnalysisGallery() {
    const [imgname, setImgname] = useState("imgname");
    const [showRename , setShowRename] = useState(false);
    const emotion = [
          { icon: happy, mood: "Happy", number: 0.0 },
        { icon: neutral, mood: "Neutral", number: 0.0 },
        { icon: sad, mood: "Sad", number: 0.0 },
        { icon: surprised, mood: "Surprised", number: 0.0 },
        { icon: angry, mood: "Angry", number: 0.0 },
      ];


  return (
    <div className="w-1/4 ">
        <div className="w-full  h-full border border-gray-100  ">

        <div className="  flex justify-between p-4 w-full relative">
            <span className="font-secondary font-bold text-sky-900 text-lg  lg:text-lg">imgname</span>
            <MoreVertIcon/>
        </div>

        <div className="w-full bg-red-200 flex jusfify-center items-center    ">
            <img src={sample} className="w-96"/>
        </div>

        <p className="font-secondary text-lg text-center font-bold text-sky-900 lg:text-lg text-sm ">Analysis</p>
        {emotion.map((item, index) => (
          <div key={index} className="flex justify-between p-4 mb-2">
            <div className="flex space-x-4 items-center">
              <img src={item.icon} className="w-5 lg:w-7" alt={item.mood} />
              <p className="font-secondary text-xs lg:text-sm font-bold text-sm text-gray-700 text-sky-900">{item.mood}</p>
            </div>
            <p className="items-center text-xs lg:text-md flex font-secondary font-bold text-sky-900">
              {item.number}
            </p>
          </div>
        ))}
        <Link to="/" className="  flex items-center justify-center p-4 space-x-4">
          <img src={camera} className="w-5 "/>
          <p className="font-secondary font-bold text-sm  text-sky-900 text-xs lg:text-md " >Go to Camera</p>
        </Link>
      </div>
    </div>
  )
}

export default AnalysisGallery
