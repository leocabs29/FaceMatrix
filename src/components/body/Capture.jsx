import React, { useEffect, useState } from 'react';
import bin from '../../assets/bin.png';

function Capture() {
  const [captures, setCaptures] = useState([]);

  useEffect(() => {
    const storedCaptures = JSON.parse(localStorage.getItem('captures')) || [];
    setCaptures(storedCaptures);
  }, []);

  const handleDeleteAll = () => {
    localStorage.removeItem('captures');
    setCaptures([]);
  };

  return (
    <div className='bg-slate-100 w-full p-4 flex flex-col justify-evenly'>
      <div className="w-full flex justify-between items-center">
        <div className="flex space-x-4 lg:w-1/4 w-1/2 justify-center">
          <span className='font-bold text-xl text-sky-900'>Captures</span>
          <div className="bg-sky-200 w-max rounded-lg text-xs h-max py-2 flex items-center space-x-1">
            <select className='text-sky-900 font-bold pl-2 hover:cursor-pointer'>
              <option value="">Recent</option>
              <option value="">Name</option>
            </select>
          </div>
        </div>
        <div className="flex text-end w-1/2 p-4 justify-end hover:cursor-pointer">
          <div className="bg-sky-200 rounded-lg font-bold px-4 py-2 text-sky-900 text-xs">Select</div>
        </div>
      </div>

      <div className="w-full flex p-4 flex-wrap gap-x-20 gap-y-10 justify-center items-start">
        {captures.length === 0 ? (
          <p className="text-gray-500">No captures found.</p>
        ) : (
          captures.map((capture, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4 w-64 space-y-2">
              <img
                src={capture.image}
                alt={`Capture ${index + 1}`}
                className="rounded-md w-full h-40 object-cover"
              />
              <div className="text-sm text-sky-900 font-bold">Emotions:</div>
              <ul className="text-xs space-y-1">
                {capture.emotion ? (
                  Object.entries(capture.emotion).map(([key, value]) => (
                    <li key={key}>
                      <span className="capitalize">{key}:</span> {value.toFixed(2)}
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

      <div className="w-full flex justify-center hover:cursor-pointer mt-4">
        <img
          src={bin}
          className="w-10"
          onClick={handleDeleteAll}
          alt="Delete All"
        />
      </div>
    </div>
  );
}

export default Capture;
