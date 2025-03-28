
  interface ButtonProps {
    label:any;
    onClick?: () => void; 
  }

  
interface buttonProps {
  text: string;
  size:string;
  color:string;
  onClick?: () => void;
  classname?: string
}


    export const Button=({label,onClick}:ButtonProps)=> {
    return (
      <div className="flex justify-center mt-2">
      <button 
        type="button" 
        className=" bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700 w-button "
        onClick={onClick}
      >
        {label}
      </button>
    </div>
    
    )
  }
  
    export const Button3=({label,onClick}:ButtonProps)=> {
    return (
      <div className="flex justify-center mt-2">
      <button 
        type="button" 
        className="  text-white py-2 px-2 rounded-lg bg-green-600 w-button flex items-center"
        onClick={onClick}
      >
        {label}
      </button>
    </div>
    
    )
  }
  

 
  export const Button2=({label,onClick}:ButtonProps)=> {
    return (
      <div className="flex justify-center mt-2">
      <button 
        type="button" 
        className=" bg-gray-300 text-black  px-4  rounded-lg hover:bg-gray-500 w-button  "
        onClick={onClick}
      >
        {label}
      </button>
    </div>
    
    )
  }


 export const Button4 = ({text, size,color,onClick, classname}: buttonProps) => {
    return (
      <div className={`w-[110px] h-[40px] bg-white rounded-xl flex justify-center items-center ${classname}`} onClick={onClick}>
          <p className={`text-${size} text-${color} `}>
              {text}
          </p>
      </div>
    )
  }

  
interface buttonProps {
  text: string;
  size:string;
  color:string;
  onClick?: () => void;
  classname?: string

}
const Button5 = ({text, size,color,onClick, classname}: buttonProps) => {
return (
  <div className={`w-[110px] h-[40px] bg-white rounded-xl flex justify-center items-center ${classname}`} onClick={onClick}>
      <p className={`text-${size} text-${color} `}>
          {text}
      </p>
  </div>
)
}

export default Button5