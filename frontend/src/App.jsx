import React from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Start from './pages/Start'

import {createBrowserRouter,RouterProvider} from 'react-router'
import Layout from './components/Layout'
import ShowCommunity from './components/ShowCommunity'
import SearchResult from './pages/SearchResult'

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
          path: '/search',
          element: <SearchResult/>
        }

      ]
    }
  ])

  return (
  <>
    <RouterProvider router={router} />
  </>
  )
}

export default App
