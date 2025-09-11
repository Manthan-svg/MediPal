import { motion } from "framer-motion";
import Lottie from "lottie-react";
import walkingBoy from "../Animations/diet.json";
import { useState } from "react";
import RegisterForm from "../pages/RegisterPage";

const RegisterComponent = () => {
  return (
    <div className="flex items-center justify-between h-screen w-[100%] px-10">
      <motion.div
        initial={{ x: "-20vw" }}
        animate={{ x: 0 }}
        transition={{ duration: 2.6, type: "spring" }}
        onAnimationComplete={() => setTimeout(() => 3000)}
      >
        <Lottie animationData={walkingBoy} loop={false} className="h-[70vw] w-[70vw]  -ml-32" />
      </motion.div>
    <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="p-5 rounded-xl shadow-lg h-[80%] overflow-hidden w-[50%] bg-white"
          >
        <RegisterForm />
          </motion.div>
    </div>
  );
};

export default RegisterComponent;
