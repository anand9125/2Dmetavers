import toast from "react-hot-toast";
interface data {
    username: string;
    email: string;
    password: string;
}
 export const  SignupValidateForm = (data:data) => {
    if (!data.username.trim()) return toast.error("Username is required");
    if (!data.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(data.email)) return toast.error("Invalid email format");
    if (!data.password) return toast.error("Password is required");
    if (data.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };
 export const  SigninValidateForm = (data:data) => {
    if (!data.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(data.email)) return toast.error("Invalid email format");
    if (!data.password) return toast.error("Password is required");
    if (data.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };