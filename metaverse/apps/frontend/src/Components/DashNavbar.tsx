import { SlCalender } from "react-icons/sl";
import { BsStars } from "react-icons/bs";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
function DashNavbar() {
  const [hover, setHover] = useState(false);
  const{authUser} = useAuthStore()
  
useEffect(() => {
  console.log(authUser);
}, [authUser]);
    const logoHandler = () => {
        window.location.href = "/";
    }
  return (
    <div
        className="w-full h-[12vh] sm:h-[14]  flex justify-between items-center"
         style={{ backgroundColor: "rgb(51, 58, 100)" }}
    > 
    {/* left elements */}

          <div className="w-[35%] flex  items-center flex-row ml-12"> 
            <img src="/assets/images-removebg-preview.png " alt=""   width="55" height="50" onClick={logoHandler} className="cursor-pointer rounded-lg" style={{ backgroundColor: "rgb(67, 88, 216)" }}/>  
          
            <div>
              <button className="flex flex-row rounded-lg hover:bg-gray-500 mx-5  text-white font-bold py-2 px-3 " style={{ backgroundColor: "rgb(76, 83, 120)" }}>
                <SlCalender className="mt-1 mr-1 " />
                <span> Events</span>
              </button>
            </div>
            <button className="flex items-center justify-center rounded-lg hover:bg-gray-500 mx-5 text-white font-bold px-4 py-2" style={{ backgroundColor: "rgb(76, 83, 120)" }}>
              <BsStars className="mr-2" />
              <span>My space</span>
            </button>    
           </div>
            {/* right elements */}

        {/* Right User Section */}
      <div className="w-[55%] flex justify-center items-center gap-2 relative">
        {/* Username and Avatar Section */}
        <div
          onClick={() => setHover((prev) => !prev)}
          className="w-[70%] p-2 flex justify-center items-center gap-2 hover:bg-green-200 p-1 rounded-xl hover:text-black cursor-pointer"
        >
          <img
            src=""
            alt="User Avatar"
            className="rounded-full w-[20px] h-[20px]"
          />
          <p className="text-lg font-semibold">{authUser?.username}</p>
        </div></div>    
      </div>
        
   
  )
}

export default DashNavbar