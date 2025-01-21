import {Loader2} from "lucide-react"
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from "react-hook-form"; // React Hook Form, a popular library for handling forms in React.
import { SigninValidateForm } from '../Validation/Signup';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useState } from "react";
import { useAuthStore } from '../store/useAuthStore';
type FormValues = {
  username: string;
  email: string;
  password: string;
  adminPassword : string;
  
};

function Signin() {
  const navigate =useNavigate()
  const {signInWithGoogle  } = useAuth(); 
  const{ signIn,isSigningIn}= useAuthStore()


  const {
    register, //A function used to register an input field into React Hook Form
    handleSubmit, //A function that wraps your form submission handler. It handles the form validation before calling your submission logic.
    watch, //A function that watches specified form inputs or the entire form for changes.
    formState: { errors } //An object that holds validation errors for the form Each field's error is available under errors.
} = useForm<FormValues>(); //A hook provided by React Hook Form
   const[showInput,setShowInput]=useState(false)
    
     

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
         const success=SigninValidateForm(data) 
         if(success==true){
             signIn(data)
             console.log(data);
             navigate('/dashboard')
         }
    };
    const handleGoogleSignIn =async()=>{
      try{
       await signInWithGoogle()
       toast.success("Signin with google successfully")
      }
      catch(e){
       toast.error("Google signin failed")
      }
     }
     const handleClick: React.MouseEventHandler<HTMLAnchorElement>=()=>{
       setShowInput(true)
       if(showInput==true){
        setShowInput(false)
     }
    }
  
  return (
    <div className='w-full   h-screen min-h-screen flex justify-center items-center bg-logbg'>
    <div className='w-[450px]  mt-4 h-[540px]   bg-gray-100  text-black flex flex-col  items-center rounded-xl p-2'>
        <div className='flex gap-16 pt-6'>
            <img className=' animate-bounce' width={40} height={40} src="https://cdn.gather.town/v0/b/gather-town.appspot.com/o/images%2Favatars%2Favatar_19_dancing.png?alt=media&token=03c3e96f-9148-42f9-a667-e8aeeba6d558" alt="" />
            <img className=' animate-bounce' width={40} height={40} src="https://cdn.gather.town/v0/b/gather-town.appspot.com/o/images%2Favatars%2Favatar_29_dancing.png?alt=media&token=507cc40a-a280-4f83-9600-69836b64522b" alt="" />
            <img className=' animate-bounce' width={40} height={40} src="https://cdn.gather.town/v0/b/gather-town.appspot.com/o/images%2Favatars%2Favatar_32_dancing.png?alt=media&token=e7d9d5fa-b7bd-41d5-966e-817f147b63d7" alt="" />
        </div>
        <h1 className='text-[22px] mt-2'>Welcome to Gather</h1>
        <div className='w-[80%] bg-black rounded-xl h-[1px] mt-2'></div>

        <div className='w-full mt-2 flex flex-col justify-center items-center'>
            <div className='w-[80%] p-1 flex flex-col justify-center gap-1'>
                <form onSubmit={handleSubmit(onSubmit)}>
                
                     <div className='flex flex-col'>
                        <div className='mt-2'>
                         <label htmlFor="email" 
                          className='text-gray-600 text-sm'>
                            Email
                          </label>
                          <input
                            {...register("email", { required: true })}
                            type="text"
                            name="email"
                            id="email"
                            placeholder="Enter your email address"
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
                          />
                        </div>  
                        <div className='mt-2 '>
                          <label htmlFor="password" 
                           className='text-gray-600 text-sm'>
                           Password
                          </label>
                         <input
                            {...register("password", { required: true })}
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
                         />
                        </div>
                        <div className="mx-auto w-1/2 pl-4 pt-3 flex flex-col">
                          <a href="#" onClick={handleClick}>Are you an admin ?</a>
                          </div>
                          {showInput &&(
                            <input
                            {...register("adminPassword")}
                            type="adminPassword"
                            name="adminPassword"
                            id="adminPassword"
                            placeholder="Enter your admin password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
                         />
                          )}
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none  mt-4">
                          {isSigningIn ? (
                           <>
                            <Loader2 className="size-5 animate-spin" />
                             Loading...
                             </>
                           ) : (
                            "Signin"
                            )}
                        </button>
                         
                        <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none mt-4 flex items-center justify-center space-x-2"
                           onClick={handleGoogleSignIn} >
                         <FaGoogle />
                         <span>Signin with google</span>
                        </button>

                     </div>     
                </form>
        <p className='pt-2 pl-7'>
            Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={()=> navigate("/signup")}>Sign Up</span>
        </p>
      </div>
     </div>
    </div>

</div>
);
}

export default Signin