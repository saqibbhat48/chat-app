import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'


function App() {
  const {authUser , checkAuth, isChecingkAuth} = useAuthStore()
  const { theme } = useThemeStore();

  useEffect(() => {
   checkAuth()
  }, [checkAuth])
  
  
  if(isChecingkAuth && !authUser) return (

    <div className='flex justify-center items-center h-screen'>
      <Loader className='animate-spin size-10' />
    </div>

  )

  return (
    <>
    <div data-theme={theme}>
      
      <Navbar/>

      <Routes>
        <Route path='/' element={ authUser ? <HomePage/> : <Navigate to="/login" />} />
        <Route path='/signup' element={ !authUser ? <SignUpPage/> : <Navigate to="/" />} />
        <Route path='/login' element={ !authUser ? <LoginPage/> : <Navigate to="/" />} />
        <Route path='/settings' element={<SettingsPage/>} />
        <Route path='/profile' element={ authUser ? <ProfilePage/> : <Navigate to="/login" />} />
      </Routes>

      <Toaster/>

    </div>
    </>
  )
}

export default App;
