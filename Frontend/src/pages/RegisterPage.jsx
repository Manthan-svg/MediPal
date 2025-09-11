import React, { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from '../utils/UserContextComponent';
import axios from '../utils/Axios.Config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function RegisterPage() {
    const navigate = useNavigate();
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [age,setAge] = useState('');
    const [checked,setChecked] = useState(false);
    const {user,setUser,token,setToken} = useContext(UserContext);


    const submitHandler = async (e) => {
        e.preventDefault();
        if(!username || !email || !password || !age  || !checked) {
            alert('All fields are required');
            return;
        }
        const firstName = username.split(' ')[0];
        const lastName = username.split(' ')[1] || '';
        const fullName = {
            firstName: firstName,
            lastName: lastName
        }
        try{
            const response = await axios.post('/users/register',{
                fullName:fullName,
                email:email,
                password:password,
                age:age
            })
            console.log(response)
            // setUser(response?.data?.newUser?.newUser);
            setToken(response?.data?.newUser?.token);
            navigate('/onboardPage',    {state:{userData:response?.data?.newUser?.newUser}});
            toast.success('User registered successfully', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }catch(err){
            toast.error('Registration failed. Please check your credentials.', {
                position: "top-center",
                autoClose: 5000,
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
        setAge('');
        setChecked(false);
    }
    
    
    return (
           <div className=''>
                <h1 className='font-["Poppins"] font-bold  text-2xl capatilize text-center'>Create account</h1>

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

                    <div className='flex flex-col gap-2 mt-4'>
                        <label htmlFor="age" className='text-sm font-semibold'>Age</label>
                        <input
                         value={age}
                         onChange={(e) => setAge(e.target.value)}
                        type="text" id='age' placeholder='Enter your age' className='border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-teal-500' />
                    </div>

                    <div className='flex gap-2 items-center  mt-4'>
                        <div
                        onClick={()=> setChecked(!checked)}
                        className='h-4 w-4 rounded-lg bg-zinc-200'>
                            {checked && (
                                <div className='h-4 w-4 bg-[#000] rounded-lg flex items-center justify-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        <label htmlFor="checkbox" className='text-sm font-semibold'>I agree to terms & conditions*</label>
                    </div>



                    <button className='mt-6 w-full bg-[#000000] text-white py-2 px-4 rounded-lg cursor-pointer transition duration-200'>Register</button>

                    <p className='text-sm font-semibold text-center mt-2 text-zinc-600'>Already have an account ? <Link to="/login">Login</Link></p>
                </form>

           </div>
        );
}

export default RegisterPage
