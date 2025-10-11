import { Outlet } from 'react-router-dom'
import Navbar from '../Components/Navbar'

const Layout = () => {
  return (
   
      <div className='min-h-screen bg-gray-50'>
        <Navbar />
        <Outlet />
      </div>
  )
}

export default Layout
