import React from "react";
import angry from "../../assets/angry.png";
import sad from "../../assets/sad.png";
import neutral from "../../assets/neutral.png";
import happy from "../../assets/happy.png";
import surprised from "../../assets/surprised.png";
import disgust from "../../assets/disgust.png";
import PropTypes from "prop-types";

function Analysis({ emotions }) {
  const emotion = [
    { icon: happy, mood: "Happy", number: Math.floor((emotions?.happy ?? 0) * 100) / 100 },
    { icon: neutral, mood: "Neutral", number: Math.floor((emotions?.neutral ?? 0) * 100) / 100 },
    { icon: sad, mood: "Sad", number: Math.floor((emotions?.sad ?? 0) * 100) / 100 },
    { icon: surprised, mood: "Surprised", number: Math.floor((emotions?.surprised ?? 0) * 100) / 100 },
    { icon: angry, mood: "Angry", number: Math.floor((emotions?.angry ?? 0) * 100) / 100 },
    { icon: disgust, mood: "Disgust", number: Math.floor((emotions?.disgust ?? 0) * 100) / 100 },
  ];
  

  return (
    <div className="w-1/4 border border-gray-100">
      <p className="font-secondary text-sky-900 lg:text-xl p-4 text-center font-bold">Analysis</p>
      <div>
        {emotion.map((item, index) => (
          <div key={index} className="flex justify-between p-4 mb-2">
            <div className="flex space-x-4 items-center">
              <img src={item.icon} className="w-5 lg:w-7" alt={item.mood} />
              <p className="font-secondary font-bold text-sky-900 text-xs lg:text-sm">{item.mood}</p>
            </div>
            <p className="items-center flex font-secondary font-bold text-sky-900 text-sm">
              {item.number}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
Analysis.propTypes = {
  emotions: PropTypes.object.isRequired,
};
export default Analysis;
