import React from 'react'
import { useState } from 'react'
import ShowCommunity from '../pages/ShowCommunity'
import { useNavigate } from 'react-router'

function SidebarItem({id,name,image}) {
  const nav = useNavigate()
  const handleClick = async() => {
    nav(`/r/${name}`)
  }
  return (
    <button className='cursor-pointer m-1 flex gap-1 justify-between h-[24px] my-2 mb-3' onClick={handleClick}>
        <img src={image} alt="icon" className='rounded-full h-7 w-7 pr-1' />
        <span>r/</span>
        <span>{name}</span>
    </button> 
  )
}

export default SidebarItem
