import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import angry from "../../assets/angry.png";
import happy from "../../assets/happy.png";
import sad from "../../assets/sad.png";
import neutral from "../../assets/neutral.png";
import disgust from "../../assets/disgust.png";
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/icon.jpg";
import { v4 as uuidv4 } from 'uuid'; // Import the uuid function

function LandingPage() {
    const navigate = useNavigate();
    const [animateEmotions, setAnimateEmotions] = useState(false);

    // Check if the user already has a UUID in localStorage, if not, generate one
    useEffect(() => {
        const existingUserId = localStorage.getItem('userId');
        if (!existingUserId) {
            const newUserId = uuidv4();  // Generate a new UUID
            localStorage.setItem('userId', newUserId);  // Save the UUID to localStorage
        }
        setTimeout(() => setAnimateEmotions(true), 300);
    }, []);

    const goToHome = () => {
        navigate('/home');
    }

    const goToGuide = () => {
        navigate('/about');
    }

    // Emotion icons and their styles
    const emotionIcons = [
        { emoji: happy, top: "10%", left: "10%", delay: "0s", color: "bg-yellow-100" },
        { emoji: neutral, top: "30%", left: "20%", delay: "0.3s", color: "bg-blue-100" },
        { emoji: sad, top: "10%", right: "10%", delay: "0.6s", color: "bg-red-100" },
        { emoji: happy, bottom: "30%", right: "10%", delay: "0.9s", color: "bg-yellow-100" },
        { emoji: angry, bottom: "20%", left: "10%", delay: "1.2s", color: "bg-red-100" },
        { emoji: disgust, bottom: "10%", right: "20%", delay: "1.5s", color: "bg-green-100" },
    ];

    return (
        <>
            <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex items-center justify-center relative overflow-hidden">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-5" 
                    style={{ 
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
                        backgroundSize: '20px 20px'
                    }}></div>

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
                    <h1 className={`text-5xl font-bold text-teal-800 mb-2 transition-all duration-700 ${animateEmotions ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'}`} style={{ transitionDelay: '0.3s' }}>
                        Capture Emotions
                    </h1>
                    <h2 className={`text-4xl font-bold text-teal-800 mb-6 transition-all duration-700 ${animateEmotions ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'}`} style={{ transitionDelay: '0.5s' }}>
                        as they happen
                    </h2>
                    <p className={`text-gray-600 mb-12 text-xl transition-all duration-700 ${animateEmotions ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'}`} style={{ transitionDelay: '0.7s' }}>
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
    );
}

export default LandingPage;
