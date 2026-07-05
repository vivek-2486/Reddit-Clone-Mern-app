import React, { use } from 'react'
import { useNavigate } from 'react-router'
function Start() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-orange-50 px-6 text-center">

      <h1 className="mb-4 text-5xl font-bold text-gray-900">
        Welcome to <span className="text-orange-500">ReadIt</span>
      </h1>

      <p className="mb-8 max-w-2xl text-lg leading-8 text-gray-600">
        ReadIt is a Reddit-inspired community platform where you can create communities,
        share posts, upload images, join discussions, and connect with people who share
        your interests.
      </p>

      <button
        onClick={() => navigate("/signup")}
        className="rounded-lg bg-orange-500 px-8 py-3 text-lg font-semibold text-white transition hover:bg-orange-600"
      >
        Get Started
      </button>

    </div>
  )
}

export default Start
