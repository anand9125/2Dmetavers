import { useNavigate } from "react-router-dom";
import Button5 from "./Button";

const Navbar = () => {
  const navigate = useNavigate();
  const handleSignIn = () => {
    navigate("/signIn");
  };
  const handleSignUp = () => {
    navigate("/signUp");
  };
  return (
    <div className="w-full h-[20vh] bg-transparent text-white flex justify-between items-center ">
      <div className="w-[20%] flex items-center justify-center ">
        <img src="" alt="" />
        <h1 className="text-[40px]">Gather</h1>
      </div>
      <div className=" flex justify-end items-center w-[80%] mr-9">
        {/* <div>
                <ul className=" flex justify-between items-center gap-4 pr-4">
                    <li >
                        <div className="flex gap-4">
                            <select name="products" id="" className="">
                            <option value="products">Resources</option>
                            <option value="services">services</option>
                            <option value="whatsnew">what's new</option>
                            <option value="products"></option>
                            </select>
                        </div>
                    </li>
                    <li >
                        <div className="flex gap-4">
                            <select name="products" id="">
                            <option value="products">products</option>
                            <option value="services">services</option>
                            <option value="whatsnew">what's new</option>
                            <option value="products"></option>
                            </select>
                        </div>
                    </li>
                    <li>
                        <div className="flex gap-4">
                            <select name="products" id="">
                            <option value="products">products</option>
                            <option value="services">services</option>
                            <option value="whatsnew">what's new</option>
                            <option value="products"></option>
                            </select>
                        </div>
                    </li>
                    <li className="text-lg cursor-pointer">
                        <p>Contact Sales</p>
                    </li>
                </ul>
            </div> */}
        {/* buttons  */}
        <div className=" flex gap-4">
          <Button5
            text="Sign Up"
            size="lg"
            color="black"
            classname="cursor-pointer "
            onClick={handleSignUp}
          />
          <Button5
            text="Sign In"
            size="lg"
            color="black"
            classname="cursor-pointer "
            onClick={handleSignIn}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
