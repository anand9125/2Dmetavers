import React from 'react'
import { useMapCreation } from '../AvatarCreation/Map';


const GameComponent2: React.FC = () => {
    useMapCreation (); // Call the custom hook


  return <div style={{ position: 'relative', height: '100vh' }}> 
  <canvas
    id="myCanvas"
    width={1450}
    height={850}
    style={{ position: 'absolute', top: '0', left: '200px' }} 
  />
</div>
  
};

export default GameComponent2;