import React, { useState } from 'react'
import icon from '../assets/icon-reddit.png'
import { Search } from 'lucide-react'
import {useAuth} from '../context/AuthContext'
import { useNavigate } from 'react-router'
import DropDown from './DropDown'

function Navbar() {
  const nav = useNavigate()
  const [searchQuery,setSearchQuery] = useState("")
  const handleSearch = () =>{
    setSearchQuery("")
    nav(`/search?q=${searchQuery}`)
    
  }
  const {user} = useAuth()
  return (
<div className='flex justify-between items-center bg-[#ff4705] px-6 fixed w-full top-0 left-0 right-0 h-16 z-50 shadow-sm select-none'>

    <div className='flex items-center'>
        <img src={icon} alt="Logo" className='h-10 w-auto object-contain' />
    </div>

    <div className='flex items-center bg-white/20 hover:bg-white/25 transition-colors rounded-full px-3 py-1.5 w-full max-w-md mx-4 group'>
        <input 
            className="w-full bg-transparent text-white placeholder-white/70 outline-none text-sm pr-2" 
            placeholder='Search here...' 
            type='text' 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
            className="text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer flex items-center justify-center" 
            onClick={handleSearch}
        >
            <Search size={18} />
        </button>
    </div>

    <div className='flex items-center'>
        <DropDown />
    </div>
</div>
  )
}

export default Navbar
  