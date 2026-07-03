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
    nav(`/search?q=${searchQuery}`)
  }
  const {user} = useAuth()
  return (
    <div className='flex gap-2 justify-around items-center bg-[#ff4705] p-1 fixed w-full top-0 left-0 right-0 h-16 z-50'>
      <div><img src={icon} className='h-10 w-12'></img></div>
      <div className='flex gap-1 items-center'>
        <input className="p-2 text-white m-1 rounded-2xl border border-neutral-600" placeholder='Search here' type='text' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}></input>
        <button onClick={handleSearch}><Search/></button>
      </div>
      <div><DropDown/></div>
    </div>
  )
}

export default Navbar
  