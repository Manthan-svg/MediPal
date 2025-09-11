import React, { useContext, useState } from "react";
import {Link} from 'react-router-dom';
import RegisterComponent from "../components/RegisterComponent";
import { UserContext } from "../utils/UserContextComponent";
import axios from "../utils/Axios.Config";
import { toast } from "react-toastify";

const LoginPage = () => {
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const {user,setUser,token,setToken} = useContext(UserContext);

    const submitHandler = async (e) => {
        e.preventDefault();
        if(!username || !email || !password ) {
            alert('All fields are required');
            return;
        }
        
        try{
            const loginResponse = await axios.post('/users/login',{
                email:email,
                password:password
            })
            console.log(loginResponse);
            setUser(loginResponse?.data?.user?.user);
            setToken(loginResponse?.data?.user?.token);

            toast.success('User logged in successfully', {
                position: "top-center",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        }catch(err){
            toast.error('Login failed. Please check your credentials.', {
                position: "top-center",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

        setUsername('');
        setEmail('');
        setPassword('');
    }
    
    
    return (
           <div className=''>
                <h1 className='font-["Poppins"] font-bold  text-2xl capatilize text-center'>Login </h1>

                <form
                onSubmit={(e)=>{
                    submitHandler(e);
                }}
                className='mt-12'>
                    <div className='flex flex-col gap-2 mt-4'>
                        <label htmlFor="name" className='text-sm font-semibold'>Username</label>
                        <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text" id='name' placeholder='Enter your fullname' className='border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-teal-500' />
                    </div>

                    <div className='flex flex-col gap-2 mt-4'>
                        <label htmlFor="email" className='text-sm font-semibold'>Email</label>
                        <input
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                        type="email" id='email' placeholder='Enter your email' className='border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-teal-500' />
                    </div>

                    <div className='flex flex-col gap-2 mt-4'>
                        <label htmlFor="password" className='text-sm font-semibold'>Password</label>
                        <input
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                        type="password" id='password' placeholder='Enter your password' className='border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-teal-500' />
                    </div>


                    <button className='mt-6 w-full bg-[#000000] text-white py-2 px-4 rounded-lg cursor-pointer transition duration-200'>Login</button>

                    <p className='text-md font-semibold text-zinc-600 text-center mt-2'>Don't have an account ? <Link to="/register" >Sign Up</Link></p>

                </form>

           </div>
        );
};

export default LoginPage;