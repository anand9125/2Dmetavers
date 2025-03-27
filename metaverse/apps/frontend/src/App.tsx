import { BrowserRouter } from 'react-router'
import './App.css'
import GameComponent2 from './pages/2nd spacetest'
import { Route,Routes,Navigate } from'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup.'
import Signin from './pages/Signin'
import Dashboard from './pages/Dashboard'
import { Toaster } from'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import GameComponent from './pages/GameComponent'
import { useAuthStore } from './store/useAuthStore'

function App() {
  const {authUser} = useAuthStore();


    return (
     <><AuthProvider>
      <BrowserRouter>
       <Routes>
         <Route path="/" element={<Home />} />
         <Route path='/signup' element={!authUser?<Signup></Signup>: <Navigate to="/dashboard" />}></Route>
         <Route path='/signin' element={!authUser?<Signin></Signin>:<Navigate to="/dashboard"></Navigate>}></Route>
         {/* <Route path='/dashboard' element={authUser?<Dashboard></Dashboard>:<Navigate to ="/signup"></Navigate>}></Route> */}
         <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
         <Route path='/test' element={<GameComponent/>}></Route>
         <Route path='/test2' element={<GameComponent2/>}></Route>
       </Routes>
       <Toaster></Toaster>
      </BrowserRouter>
      </AuthProvider>
     </>
    )
 }

export default App
