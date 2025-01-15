import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
interface User{
    id : string,
    username : string,
    email : string,
    role : "Admin" | "User"
}


interface AuthStore{
    authUser : User| null,
    isSigningUp : boolean,
    isSigningIn : boolean,
    isCheckigning : boolean,
    signUp: (data:any)=>void,
    signIn: (data:any)=>void,
    checkAuth: ()=>void,
}


export const useAuthStore = create<AuthStore>((set)=>({
    authUser : null,
    isSigningUp : false,
    isSigningIn: false,
    isCheckigning : true,

    checkAuth:async()=>{
        try{
            const res = await axiosInstance.get("/auth/check")
            set({authUser:res.data})     
        }catch(err){
            toast.error("error in checkAuth")
            set({authUser:null})
        }finally{
            set({isCheckigning:false})
        }
    },
    signUp:async(data)=>{
        set({isSigningUp:true}) ;
        try{
            const res = await axiosInstance.post("signup",data)
            toast.success("Successfully signed up")
            console.log("Successfully")
            set({authUser:res.data,isSigningUp:false})
        }
        catch(err){
            toast.error("Error in signing up")
            set({isSigningUp:false})
        }
    },
    signIn:async(data)=>{
        set({isSigningIn:true}) ;
        try{
            const res = await axiosInstance.post("/auth/signin",data)
            toast.success("Successfully signed in")
            set({authUser:res.data,isSigningIn:false})
        }
        catch(err){
            toast.error("Error in signing in")
            set({isSigningIn:false})
        }
    },
    SignOut:async()=>{
    try{
       await axiosInstance.get("/auth/logout")
        set({authUser:null})
       toast.success("Successfully signed out")
    }
     catch(err){
    toast.error("error while logout")

    }
    }


}))

 //isCheckingAuth property is used to track whether the application is currently in the process of checking the user's authentication status
// When the app is making a request to the server to verify the current user's authentication 
// (e.g., calling the /auth/check endpoint), this property is set to true to indicate that the check is in progress.
// Once the check is complete (whether successful or not), this property is set to false to indicate that the check has finished.
// You can use isCheckingAuth to control the loading state of your UI.
// For example, you might want to show a loading spinner, a "Please wait" message, or disable certain UI elements while the authentication check is being processed