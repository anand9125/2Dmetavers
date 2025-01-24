import { SlCalender } from "react-icons/sl";
import { TbSquareRoundedPlusFilled } from "react-icons/tb";
import { BsStars } from "react-icons/bs";
import { ReactNode, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { Button4 } from "./Button";
function DashNavbar() {
  const [hover, setHover] = useState(false);
  const{authUser,signOut} = useAuthStore()
  const [EditCh, setEditCh] = useState(false);
  
  
  
useEffect(() => {
  console.log(authUser);
}, [authUser]);
    const logoHandler = () => {
        window.location.href = "/";
    }

    function createSpace(){
      
    }
    function handleSignOut(){
       signOut()
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
              <button className="flex flex-row rounded-lg  mx-5  text-white font-bold py-2 px-3  hover:bg-[#5b638f]" >
                <SlCalender className="mt-1 mr-1 " />
                <span> Events</span>
              </button>
            </div>
            <button className="flex items-center justify-center rounded-lg mx-5 text-white font-bold px-4 py-2  hover:bg-[#5b638f]" >
              <BsStars className="mr-2" />
              <span>My space</span>
            </button>    
           </div>
            {/* right elements */}
            <div className="flex items-center justify-end gap-4 w-full px-4 lg:px-8 py-2">
               {/* User Profile Section */}
        <div>
        <div 
           onClick={() => setHover((prev) => !prev)}
           className="relative flex items-center gap-2 px-6 py-2 rounded-lg cursor-pointer bg-[#464e7a] hover:bg-[#5b638f] hover:text-black transition-colors duration-200"
           >
          <img
           src=""
           alt=""
            className="w-6 h-6 rounded-full object-cover"
        />
        <p className="text-base font-semibold truncate">
          {authUser?.username?.slice(0, 11) || "Anand Chuah"}
        </p>
      
        
        {hover && (
                <div
                  className="absolute top-[120%] left-[0%] w-[180px] flex flex-col gap-2 shadow-lg p-4 rounded-xl z-10"
                  style={{ backgroundColor: "rgb(84, 92, 143)" }}
                >
                  <div className="flex flex-col text-white">
                    <div className="w-full flex justify-between items-center">
                      <p className="truncate hover:font-semibold">{authUser?.username}</p>
                      <MdEdit
                        className="w-[25px] h-[25px] bg-[#3a3dab] p-1 rounded-xl cursor-pointer"
                        onClick={() => {
                          setEditCh((prev) => !prev);
                        }}
                      />
                    </div>
                    <p className="break-words hover:font-semibold">{authUser?.email}</p>
                  </div>
                  <div className="h-[2px] rounded-xl bg-white"></div>
                  <h1
                    className="cursor-pointer text-white hover:font-semibold"
                    onClick={() => alert("Edit Name Clicked")}
                  >
                    Edit Avatar
                  </h1>
                  <h1
                    className="flex items-center gap-2 text-black hover:font-semibold cursor-pointer transition-all duration-200"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    <span onClick={signOut}>Logout</span>
                  </h1>
                </div>
              )}
        </div>
        
        </div>
      {/* Create Space Button */}
      <button
        onClick={createSpace}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#207d53] hover:bg-[#37975a] text-white transition-colors duration-200"
      >
          <TbSquareRoundedPlusFilled className="w-5 h-6" />
          <span className="text-base font-semibold">Create space</span>
        </button>
       </div>
        
      
      </div>
        
   
  )
}

export default DashNavbar