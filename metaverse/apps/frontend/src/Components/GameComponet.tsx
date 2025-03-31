import React from 'react';
import { useGame } from '../ArenaMap/space1';


const GameComponent: React.FC = () => {
  useGame(); // Call the custom hook


  return <div style={{ position: 'relative', height: '100vh' }}> 
  <canvas
    id="myCanvas"
    width={1450}
    height={850}
    style={{ position: 'absolute', top: '0', left: '200px' }} 
  />
</div>
  
};

export default GameComponent;

