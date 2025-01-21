import {Loader2} from "lucide-react"
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from "react-hook-form"; // React Hook Form, a popular library for handling forms in React.
import { SignupValidateForm } from '../Validation/Signup';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
type FormValues = {
  username: string;
  email: string;
  password: string;
};
function Signup() {
  const navigate =useNavigate()
  const {signInWithGoogle  } = useAuth(); 
  const{ signUp,isSigningUp}= useAuthStore()


  const {
    register, //A function used to register an input field into React Hook Form
    handleSubmit, //A function that wraps your form submission handler. It handles the form validation before calling your submission logic.
    watch, //A function that watches specified form inputs or the entire form for changes.
    formState: { errors } //An object that holds validation errors for the form Each field's error is available under errors.
} = useForm<FormValues>(); //A hook provided by React Hook Form
   
    
     

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
         const success=SignupValidateForm(data) 
         if(success==true){
             signUp(data)
            
            
         }
    };
    const handleGoogleSignIn =async()=>{
      try{
       await signInWithGoogle()
       toast.success("Signup with google successfully")
      }
      catch(e){
       toast.error("Google signup failed")
      }
     }

  return (
    <div className='w-full h-screen flex justify-center items-center bg-logbg'>
    <div className='w-[450px] h-[570px] bg-gray-100 text-black flex flex-col  items-center rounded-xl p-2'>
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
                       <div>
                       <label htmlFor="username" 
                         className='text-gray-600 text-sm'>
                         Username
                         </label>
                         <input
                            {...register("username", { required: "Username is required" })}
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Enter a username"
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
                        />
                       </div>
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
                            placeholder="Create a  password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
                         />
                        </div> 
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none  mt-4">
                          {isSigningUp ? (
                           <>
                          <Loader2 className="size-5 animate-spin" />
                           Loading...
                          </>
                           ) : (
                            "Create Account"
                            )}
                        </button>
                         
                        <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none mt-4 flex items-center justify-center space-x-2"
                           onClick={handleGoogleSignIn} >
                         <FaGoogle />
                         <span>Create Account with google</span>
                        </button>
                       
                        
                     </div>     
                </form>
        <p className='pt-2 pl-7'>
            Already have an account? <span className='text-blue-600 cursor-pointer' onClick={()=> navigate("/signIn")}>Sign In</span>
        </p>
      </div>
     </div>
    </div>

</div>
);
}

export default Signup