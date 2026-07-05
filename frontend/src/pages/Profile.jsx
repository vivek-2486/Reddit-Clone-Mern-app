import React, { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react';
import axios from 'axios';  

function Profile() {
    const {user} = useAuth();
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture?.url || null);
    const [picture, setPicture] = useState(null)
    const [changePicture, setChangePicture] = useState(false)
    
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000/";

    
    const handleSubmit = async() => {
        if(!picture) return
        const data = new FormData();
        try {
            data.append('profilePicture', picture)
            const token = localStorage.getItem('token')
            const url = `${serverUrl}api/user/profile-picture`
            const res = await axios.put(url,data,{
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            })
            setPicture(null)
            setProfilePicture(res.data.profilePicture.url)
            setChangePicture(false)
        } catch (error) {
            
        }

    }
    if(!user){
        return (<div>Loading profile...</div>)
    }
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
  <h2 className="text-xl font-semibold text-gray-800 mb-6">User Profile</h2>
  
  <div className="space-y-4">
    
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
      <span className="text-gray-500">Username</span>
      <span className="font-medium text-gray-900">{user.username}</span>
    </div>

    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
      <span className="text-gray-500">Email</span>
      <span className="font-medium text-gray-900">{user.email}</span>
    </div>

    
    <div className="pt-4 border-t border-gray-100">
      <p className="text-gray-500 mb-3">Profile Picture</p>
      
      {profilePicture ? (
        <div className="flex items-center gap-4">
          <img src={profilePicture} className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100" />
          
          <div>
            {!changePicture ? (
              <button 
                onClick={() => setChangePicture(true)}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Change picture
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <input type="file" className="text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" onChange={(e) => setPicture(e.target.files[0])} />
                <button 
                  onClick={handleSubmit}
                  className="w-full bg-indigo-600 text-white py-1 rounded-md text-sm hover:bg-indigo-700 transition"
                >
                  Upload
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <input type="file" className="text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700" onChange={(e) => setPicture(e.target.files[0])} />
          <button 
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  </div>
</div>
  )
}

export default Profile
