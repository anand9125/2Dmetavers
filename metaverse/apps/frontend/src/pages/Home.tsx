import HomeNavbar from '../Components/HomeNavbar'
import { Button } from '../Components/Button'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate =useNavigate()
  const handleGetStarted = () => {
    navigate("/signup")
  }
  
  return (
    <>
        <div className='w-full h-screen bg-hero lg:pr-9 '>
         <HomeNavbar></HomeNavbar>
         <div className='w-full h-[100%] flex justify-center items-center'>
          <div className=' w-full h-full flex flex-col justify-center item-aligen p-8 pl-12 pr-12 ml-10 gap-4 '>
            <h1 className='text-[60px] font-bold  text-white'>Your <span className='text-blue-300'>Virtual HQ</span> </h1>
            <p className='w-[80%] text-xl text-gray-300'>Gather brings the best of in-person collaboration to distributed teams</p>
            <div className='flex items-start'>
            <Button label='Get started' onClick={handleGetStarted}></Button>
            <div className='pt-4 pl-4'><a href="/about me" className='text-white '>or take a tour   &gt; </a></div>
            </div>
          </div>
          <div className='w-full h-full flex justify-center items-center pr-20 '>
            <video width={800} height={800} src="/assets/gether.town" className='rounded-xl' loop={true} autoPlay={true}></video>
          </div>
        </div>
        </div>
    </>
  )
}

export default Home