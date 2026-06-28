import React, { useState } from 'react'
import icon from '../assets/icon-reddit.png'
import { Search } from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router'
function Navbar() {
  const nav = useNavigate()
  const [searchQuery,setSearchQuery] = useState("")
  const handleSearch = () =>{
    nav(`/search?q=${searchQuery}`)
  }
  
  return (
    <div className='flex gap-2 justify-around items-center bg-[#ff4705] p-1'>
      <div><img src={icon} className='h-10 w-12'></img></div>
      <div className='flex gap-1 items-center'>
        <input className="p-2 text-white m-1 rounded-2xl border border-neutral-600" placeholder='Search here' type='text' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}></input>
        <button onClick={handleSearch}><Search/></button>
      </div>
      <div><span>User</span></div>
    </div>
  )
}

export default Navbar
  