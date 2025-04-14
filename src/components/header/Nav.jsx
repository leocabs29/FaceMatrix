import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { useState } from 'react';
const mess = () => {
  toast.success('Successfully toasted!');
};

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle mobile menu visibility

  return (
    <div className="flex border border-gray-100 font-secondary w-full justify-between p-4 font-bold text-sky-900 items-center">
      <Link to={'/'} className="lg:text-2xl text-xl">FaceMatrix</Link>
      
      {/* Desktop Menu */}
      <div className="md:flex space-x-4 items-center hidden">
        <Link to="/gallery" className="text-sm lg:text-md rounded-lg hover:cursor-pointer px-4 py-2 hover:bg-sky-900 hover:text-white">Captures</Link>
        <Toaster />
        <Link to={"/"} className="text-sm lg:text-md rounded-lg hover:cursor-pointer px-4 py-2 hover:bg-sky-900 hover:text-white">Camera</Link>
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <MenuRoundedIcon 
          className="text-sky-900 cursor-pointer" 
          onClick={() => setMenuOpen(!menuOpen)} 
        />
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-15 right-0  bg-white shadow-lg p-4 space-y-4 z-50 flex flex-col">
          <Link to="/gallery" className="text-sm lg:text-md rounded-lg hover:cursor-pointer px-4 py-2 hover:bg-sky-900 hover:text-white">Captures</Link>
          <Link to={"/"} className="text-sm lg:text-md rounded-lg hover:cursor-pointer px-4 py-2 hover:bg-sky-900 hover:text-white">Camera</Link>
        </div>
      )}
    </div>
  );
}

export default Nav;
