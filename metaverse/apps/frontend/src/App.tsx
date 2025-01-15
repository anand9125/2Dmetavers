import { BrowserRouter } from 'react-router'
import './App.css'
import { Routes } from 'react-router'
import { Route } from'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup.'
import Signin from './pages/Signin'
import Dashboard from './pages/Dashboard'
import { Toaster } from'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
function App() {
    return (
     <><AuthProvider>
      <BrowserRouter>
       <Routes>
         <Route path="/" element={<Home />} />
         <Route path='/signup' element={<Signup></Signup>}></Route>
         <Route path='/signin' element={<Signin></Signin>}></Route>
         <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
       </Routes>
       <Toaster></Toaster>
      </BrowserRouter>
      </AuthProvider>
     </>
    )
 }

export default App
