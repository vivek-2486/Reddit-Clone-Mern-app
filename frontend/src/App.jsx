import React from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Start from './pages/Start'
import { AuthProvider } from './context/AuthContext'
import {createBrowserRouter,RouterProvider} from 'react-router'
import Layout from './pages/Layout'
import ShowCommunity from './pages/ShowCommunity'
import SearchResult from './pages/SearchResult'
import ShowPost from './pages/ShowPost'
import Profile from './pages/Profile'

function App() {

  const router = createBrowserRouter([
    {
      path:'/',
      element:<Start/>
    },
    {
      path:'/login',
      element:<Login/>
    },
    { 
      path:'/signup',
      element:<Signup/>
    },
    {
      element:<Layout/>,
      children: [
        {
          path:'/home',
          element:<Home/>
        },
        {
          path: '/r/:name',
          element: <ShowCommunity/>
        },
        {
          path: '/p/:id',
          element: <ShowPost/>
        },
        {
          path: '/search',
          element: <SearchResult/>
        },
        {
          path: '/profile/:id',
          element: <Profile/>
        }
      ]
    }
  ])

  return (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
  )
}

export default App
