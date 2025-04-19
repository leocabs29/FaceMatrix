import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import Nav from "./header/Nav";
import toast, { Toaster } from "react-hot-toast";

function ContactUs() {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const templateParams = {
      email: email,
      reason: reason,
      message: message,
    };

    emailjs
      .send(
        "service_dchr0is", // Your service ID
        "template_znxvrog", // You can name your template 'template_default'
        templateParams,
        "wh_q8_uMSHPXg8cu8" // Your public key
      )
      .then(
        () => {
          toast.success("Submitted successfully");
          setIsSubmitting(false);
          setFormSubmitted(true);
          
          // Reset form after showing success state
          setTimeout(() => {
            setReason("");
            setMessage("");
            setEmail("");
            setFormSubmitted(false);
          }, 2000);
        },
        (error) => {
          console.error("Failed to send email:", error);
          toast.error("Failed to send message.");
          setIsSubmitting(false);
        }
      );
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.02,
      boxShadow: "0px 5px 15px rgba(1, 56, 77, 0.2)"
    },
    tap: { 
      scale: 0.98 
    },
    loading: {
      scale: [1, 1.02, 1],
      transition: {
        repeat: Infinity,
        duration: 1
      }
    },
    success: {
      backgroundColor: "#10B981",
      scale: [1, 1.05, 1],
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      <Nav />
      <motion.div 
        className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-[#01384D] mb-2 text-center"
            variants={itemVariants}
          >
            Contact Us
          </motion.h2>
          <motion.p 
            className="text-[#01384D] text-center mb-6"
            variants={itemVariants}
          >
            Issue? Concern? Let us know how we can help.
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants}>
              <label className="block font-semibold text-[#01384D] mb-1">
                Your Email
              </label>
              <motion.input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="you@example.com"
                whileFocus={{ boxShadow: "0px 0px 0px 2px rgba(1, 56, 77, 0.2)" }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block font-semibold text-[#01384D] mb-1">
                Reason
              </label>
              <motion.select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                whileFocus={{ boxShadow: "0px 0px 0px 2px rgba(1, 56, 77, 0.2)" }}
              >
                <option value="">Select Issue</option>
                <option value="Bug">Bug</option>
                <option value="Suggestion">Suggestion</option>
                <option value="Account Help">Account Help</option>
                <option value="Other">Other</option>
              </motion.select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block font-semibold text-[#01384D] mb-1">
                Message
              </label>
              <motion.textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows="6"
                placeholder="Write your message here..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                whileFocus={{ boxShadow: "0px 0px 0px 2px rgba(1, 56, 77, 0.2)" }}
              ></motion.textarea>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full bg-[#01384D] text-white font-bold py-3 rounded-lg transition duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap={!isSubmitting && "tap"}
              animate={isSubmitting ? "loading" : formSubmitted ? "success" : ""}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <motion.span
                  animate={{ 
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity,
                  }}
                >
                  Submitting...
                </motion.span>
              ) : formSubmitted ? (
                <motion.div className="flex items-center justify-center space-x-2">
                  <motion.svg 
                    className="w-6 h-6" 
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: 1,
                      transition: { type: "spring", stiffness: 200 }
                    }}
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.svg>
                  <span>Sent!</span>
                </motion.div>
              ) : (
                "Submit"
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
      <Toaster position="bottom-center" />
    </>
  );
}

export default ContactUs;