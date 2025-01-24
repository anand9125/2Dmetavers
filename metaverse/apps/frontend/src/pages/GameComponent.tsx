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























// The error you're encountering is because useGame is a custom hook, and it should not be used as a JSX element like <useGame>. Instead, you should call it as a function within a component. Here's a quick correction to ensure it's used properly:

// Ensure useGame is called as a hook: Inside a functional component, you should invoke useGame() like any other hook (e.g., useEffect, useState).
// Here’s an example of how you can use it inside a React component:

// tsx
// Copy
// Edit
// import React from 'react';

// const GameComponent: React.FC = () => {
//   useGame(); // Call the custom hook

//   return <canvas></canvas>;
// };

// export default GameComponent;
// In this structure:

// useGame handles the game logic.
// GameComponent renders the canvas element to the DOM, where the game will be displayed.
// Make sure to remove any instances where useGame is incorrectly used as a JSX element