import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
function App() {

  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    console.log("userData", userData)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </>
  )
}

export default App
