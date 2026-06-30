import React from 'react'
import { useState } from 'react'
import ShowCommunity from '../pages/ShowCommunity'
import { useNavigate } from 'react-router'

function SidebarItem({id,name}) {
  const nav = useNavigate()
  const handleClick = async() => {
    nav(`/r/${name}`)
  }
  return (
    <button className='cursor-pointer m-1 flex gap-1 justify-between h-[24px] my-2' onClick={handleClick}>
        <span>r/</span>
        <span>{name}</span>
    </button> 
  )
}

export default SidebarItem
