import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

const mess = () => {
  toast.success('Successfully toasted!');
};

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Animation variants
  const navContainerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 12 }
    },
    hover: {
      scale: 1.05,
      backgroundColor: "#01384D",
      color: "white",
      transition: { type: "spring", stiffness: 300, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    },
    hover: {
      scale: 1.05,
      textShadow: "0px 0px 8px rgba(1, 56, 77, 0.3)",
      transition: { type: "spring", stiffness: 300, damping: 10 }
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: 300, scale: 0.8 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    },
    exit: { 
      opacity: 0, 
      x: 300, 
      scale: 0.8,
      transition: { duration: 0.2, ease: "easeInOut" }
    }
  };

  const menuIconVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
  };

  return (
    <motion.div 
      className="flex border border-gray-100 font-secondary w-full justify-between p-4 font-bold text-[#01384D] items-center"
      variants={navContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={logoVariants}
        whileHover="hover"
        whileTap={{ scale: 0.98 }}
      >
        <Link to={'/'} className="lg:text-2xl text-xl">FaceMatrix</Link>
      </motion.div>
      
      {/* Desktop Menu */}
      <div className="md:flex space-x-4 items-center hidden">
        <motion.div variants={linkVariants}>
          <Link to={"/home"}>
            <motion.div 
              className="text-sm lg:text-md rounded-lg hover:cursor-pointer px-4 py-2"
              whileHover="hover"
              whileTap="tap"
            >
              Camera
            </motion.div>
          </Link>
        </motion.div>
        
        <motion.div variants={linkVariants}>
          <Link to="/gallery">
            <motion.div 
              className="text-sm lg:text-md rounded-lg hover:cursor-pointer px-4 py-2"
              whileHover="hover"
              whileTap="tap"
            >
              Captures
            </motion.div>
          </Link>
        </motion.div>
        
        <Toaster />
        
        <motion.div variants={linkVariants}>
          <Link to={"/contact"}>
            <motion.div 
              className="text-sm lg:text-md rounded-lg hover:cursor-pointer px-4 py-2"
              whileHover="hover"
              whileTap="tap"
            >
              Contact us
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Mobile Menu Icon */}
      <motion.div 
        className="md:hidden"
        variants={menuIconVariants}
        animate={menuOpen ? "open" : "closed"}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <CloseRoundedIcon className="text-sky-900 cursor-pointer" />
          ) : (
            <MenuRoundedIcon className="text-sky-900 cursor-pointer" />
          )}
        </motion.div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="md:hidden absolute top-16 right-0 bg-white shadow-lg p-4 space-y-2 z-50 rounded-bl-lg flex flex-col mr-2"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div 
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
              className="rounded-lg"
            >
              <Link to="/gallery" className="text-sm block w-full px-4 py-2">
                Captures
              </Link>
            </motion.div>
            
            <motion.div 
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
              className="rounded-lg"
            >
              <Link to={"/home"} className="text-sm block w-full px-4 py-2">
                Camera
              </Link>
            </motion.div>
            
            <motion.div 
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
              className="rounded-lg"
            >
              <Link to={"/contact"} className="text-sm block w-full px-4 py-2">
                Contact us
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Nav;