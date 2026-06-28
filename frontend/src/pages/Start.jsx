import React, { use } from 'react'
import {useNavigate} from 'react-router'
function Start() {
  const navigate = useNavigate()
  return (
    <div className='flex flex-col'>
      
      <div>Readit is a Reddit clone as you will see </div>
      <button className='border-amber-400' onClick={() => navigate('/signup')}>Get Started</button>
    </div>
  )
}

export default Start
