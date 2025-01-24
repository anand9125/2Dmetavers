import DashNavbar from "../Components/DashNavbar"
import { useAuthStore } from "../store/useAuthStore"

function Dashboard() {
  const {authUser} = useAuthStore();
  console.log(authUser)
  return (<div className="bg-Hero w-full h-screen bg-[#282d4e]">
          <div><DashNavbar></DashNavbar></div>
         <div>Hii
         { authUser?.username}
          </div>  
   
    </div>
  )
}

export default Dashboard








