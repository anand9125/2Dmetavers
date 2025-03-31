import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import { userState } from '../../store/userAtom'
import Popup from './Popup'
import { useSpaceStates } from './States'
import MultiplayerGame from './Game'

function ArenaPage() {
   const[user,setUser]= useRecoilState(userState)
  
   const {popup,setShowPopup}= useSpaceStates(user);
   
   const token = localStorage.getItem('token')
 
   const [spaceDetails,setSpaceDetails]=useState<{
    name:string,
    dimensions:string,
    elements: {
      id: string;
      element: {
        id: string;
        imageUrl: string;
        width: number;
        height: number;
        static: boolean;
      };
      x: number;
      y: number;
   }[]
  }|null>(null)

  return (
    <div>
       {popup && <Popup  setShowPopup={ setShowPopup}></Popup>
        }
        <div className="min-h-screen bg-gray-900">
      <MultiplayerGame/>
    </div>

    </div>
  )
}

export default ArenaPage