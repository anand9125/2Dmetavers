
  interface ButtonProps {
    label:string;
    onClick?: () => void; 
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

  