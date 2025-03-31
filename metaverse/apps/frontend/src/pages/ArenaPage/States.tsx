import { useState } from "react"

export const useSpaceStates = (user:any) => {

    const [popup,setShowPopup]=useState(true)

    return {
        popup,
        setShowPopup
    }
}