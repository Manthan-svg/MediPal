import React, { createContext, useEffect, useState } from 'react'

export const UserContext = createContext();


export function AuthContext({children}) {

    const [user,setUser] = useState(()=>{
        const user = localStorage.getItem('User-Data-Information');
        return user ? JSON.parse(user) : null;
    })

    const [token,setToken] = useState(() => {
        const savedToken = localStorage.getItem('token');
        return savedToken ? JSON.parse(savedToken) : null;
    })


    useEffect(()=>{
        if(user){
            localStorage.setItem('User-Data-Information',JSON.stringify(user))
        }else{
            localStorage.removeItem('User-Data-Information');
        }
    },[user])


    useEffect(()=>{
        if(token){
            localStorage.setItem('token',JSON.stringify(token))
        }else{
            localStorage.removeItem('token');
        }
    },[token])
  return (
    <UserContext.Provider value={{user,setUser,token,setToken}}>
        {children}
    </UserContext.Provider>
  )
}


