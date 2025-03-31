
import {Button} from './Button'
import { useNavigate } from 'react-router-dom';

 function HomeNavbar() {
  const navigate =useNavigate()
  const handleSignUp = () => {
    navigate("/signup")
  }
  
  const handleGetStarted = () => {
    navigate("/signup")
  }
  
  return (
    <div className='w-full h-[8vh] bg-transparent text-white flex justify-between items-center'>
        <div className="w-[20%] flex items-center justify-center  ">
           <a href="/"> <img src="/assets/images-removebg-preview.png" alt="" width="45" height="50"/> </a>
            <span className="text-[20px] font-semibold ">Gather</span>
        </div>
        <div className='flex justify-end items-center'>
        <div className=" flex gap-4 pr-4 lg:mr-16">
               <Button onClick={handleGetStarted} label="Get started"></Button>
               <Button onClick={handleSignUp} label='Sign in'></Button>
            </div>
        </div>
    </div>
  )
}
export default HomeNavbar
