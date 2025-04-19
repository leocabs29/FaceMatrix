import React, { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react';
import angry from "../../assets/angry.png";
import happy from "../../assets/happy.png";
import sad from "../../assets/sad.png";
import neutral from "../../assets/neutral.png";
import disgust from "../../assets/disgust.png";
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/icon.jpg";

function LandingPage() {
    const navigate = useNavigate();
    const [animateEmotions, setAnimateEmotions] = useState(false);
    
    // Enhanced emotion icons with animations
    const emotionIcons = [
        { emoji: happy, top: "10%", left: "10%", delay: "0s", color: "bg-yellow-100" },
        { emoji: neutral, top: "30%", left: "20%", delay: "0.3s", color: "bg-blue-100" },
        { emoji: sad, top: "10%", right: "10%", delay: "0.6s", color: "bg-red-100" },
        { emoji: happy, bottom: "30%", right: "10%", delay: "0.9s", color: "bg-yellow-100" },
        { emoji: angry, bottom: "20%", left: "10%", delay: "1.2s", color: "bg-red-100" },
        { emoji: disgust, bottom: "10%", right: "20%", delay: "1.5s", color: "bg-green-100" },
    ];

    useEffect(() => {
        // Trigger animations after component mounts
        setTimeout(() => setAnimateEmotions(true), 300);
    }, []);

    const goToHome = () => {
        navigate('/home');
    }

    const goToGuide = () => {
        navigate('/about');
    }

    return (
        <>
            <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex items-center justify-center relative overflow-hidden">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-5" 
                    style={{ 
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
                        backgroundSize: '20px 20px'
                    }}>
                </div>

                {/* Alert banner */}
                <div className="absolute top-0 left-0 right-0 bg-blue-50 border-b border-blue-200 p-3 flex justify-center items-center">
                    <div className="text-blue-700 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Please ensure your camera lens is clean to improve face scan accuracy.
                    </div>
                </div>

                {/* Emotion icons floating around with animations */}
                {emotionIcons.map((icon, index) => (
                    <div 
                        key={index}
                        className={`absolute ${icon.color || 'bg-gray-100'} w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-1000 ease-in-out ${animateEmotions ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'}`}
                        style={{
                            top: icon.top || 'auto',
                            left: icon.left || 'auto', 
                            right: icon.right || 'auto',
                            bottom: icon.bottom || 'auto',
                            transitionDelay: icon.delay,
                            animation: animateEmotions ? `float 6s ease-in-out ${index * 0.5}s infinite alternate` : 'none'
                        }}
                    >
                        <img src={icon.emoji} alt="emoji" className="w-8 h-8" />
                    </div>
                ))}
                
                <div className="text-center z-10 px-4">
                    {/* Logo with animation */}
                    <div className={`mx-auto w-40 h-40 relative mb-8 transition-all duration-1000 ${animateEmotions ? 'opacity-100 transform-none' : 'opacity-0 scale-95'}`}>
                        <img src={Logo} className='rounded-full shadow-lg' alt="Logo" />
                        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-teal-800 rounded-tl-lg"></div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-teal-800 rounded-tr-lg"></div>
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-teal-800 rounded-bl-lg"></div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-teal-800 rounded-br-lg"></div>
                    </div>
                    
                    {/* Main Text with animations */}
                    <h1 className={`text-5xl font-bold text-teal-800 mb-2 transition-all duration-700 ${animateEmotions ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'}`}
                        style={{ transitionDelay: '0.3s' }}>
                        Capture Emotions
                    </h1>
                    <h2 className={`text-4xl font-bold text-teal-800 mb-6 transition-all duration-700 ${animateEmotions ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'}`}
                        style={{ transitionDelay: '0.5s' }}>
                        as they happen
                    </h2>
                    <p className={`text-gray-600 mb-12 text-xl transition-all duration-700 ${animateEmotions ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'}`}
                        style={{ transitionDelay: '0.7s' }}>
                        Real-Time emotion recognition, anytime, anywhere.
                    </p>
                    
                    {/* CTA Button with animation and enhanced hover effect */}
                    <button 
                        onClick={goToHome} 
                        className={`bg-teal-800 text-white font-bold py-3 px-12 rounded-full text-lg hover:bg-teal-700 transition-all duration-700 shadow-md hover:shadow-lg hover:scale-105 mb-12 ${animateEmotions ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'}`}
                        style={{ transitionDelay: '0.9s' }}
                    >
                        GET STARTED
                    </button>
                    
                    {/* User Guide Link with animation */}
                    <div 
                        onClick={goToGuide} 
                        className={`flex justify-center transition-all duration-700 ${animateEmotions ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'}`}
                        style={{ transitionDelay: '1.1s' }}
                    >
                        <a href="#" className="text-gray-400 flex items-center hover:text-teal-800 transition-colors">
                            User Guide
                            <ArrowUpRight size={16} className="ml-1" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Add CSS for floating animation */}
            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </>
    )
}

export default LandingPage