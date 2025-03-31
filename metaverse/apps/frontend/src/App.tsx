import { BrowserRouter } from 'react-router'
 import './App.css'
import GameComponent2 from './pages/2nd spacetest'
import { Route,Routes,Navigate } from'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/AuthUser/Signup.'
import Signin from './pages/AuthUser/Signin'
import Dash from './pages/Dashboard'
import { Toaster } from'react-hot-toast'
import GameComponent from './Components/GameComponet'
import { RecoilRoot } from 'recoil'
import ArenaPage from './pages/ArenaPage/ArenaPage'
import Game from './ArenaMap2/Game'

function App() {


    return (
      <>
    
      <RecoilRoot>
    
      <BrowserRouter>
       <Routes>
         <Route path="/" element={<Home />} />
         <Route path='/signup' element={<Signup></Signup>}></Route>
         <Route path='/signin' element={<Signin></Signin>}></Route>
         <Route path='/dashboard' element={<Dash></Dash>}></Route>
         <Route path="/space/:spaceId" element={<ArenaPage/>}  />
        
         <Route path='/test' element={<GameComponent/>}></Route>
         <Route path='/test2' element={<GameComponent2/>}></Route>
       </Routes>
       <Toaster></Toaster>
      </BrowserRouter>
  
      </RecoilRoot>
     </>
   
    )
 }

export default App
