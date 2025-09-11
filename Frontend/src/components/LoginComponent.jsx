import React from 'react'
import LoginPage from '../pages/LoginPage'
import Lottie from 'lottie-react'
import {motion} from 'framer-motion'
import LoginAnimation from '../Animations/Login Animation.json'

function LoginComponent() {
  return (
    <div>
       <div className="flex items-center justify-between h-screen w-[100%] px-10">
      <motion.div
        initial={{ x: "-20vw" }}
        animate={{ x: 0 }}
        transition={{ duration: 2.6, type: "spring" }}
        onAnimationComplete={() => setTimeout(() => 3000)}
      >
        <Lottie animationData={LoginAnimation} loop={true} className="h-[55vw] w-[55vw] mt-25" />
      </motion.div>
    <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="p-5 rounded-xl shadow-lg h-[80%] overflow-hidden w-[40%] bg-white mr-12"
          >
            <LoginPage />
          </motion.div>
    </div>
    </div>
  )
}

export default LoginComponent
