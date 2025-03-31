import { useEffect } from 'react';
import { collisions } from '../lib/Data/collisions';
interface Position {
  x: number;
  y: number;
}

interface BoundaryConfig {
  position: Position;
}
interface Frames {
  max: number;
  val: number;
  elapsed: number;
  // Any other properties that may exist in frames, you can define here
}

class Boundary {
  static width: number = 24;
  static height: number = 24;
  position: Position;
  width: number;
  height: number;

  constructor({ position }: BoundaryConfig) {
    this.position = position;
    this.width = 24;
    this.height = 24;
  }

  draw(c: CanvasRenderingContext2D) {
    c.fillStyle =' rgba(255, 255, 255, 0)';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

interface SpriteConfig {
  position: Position;
  velocity?: Position;
  image: HTMLImageElement;
  frames?: { max: number };
  sprites?: { [key: string]: HTMLImageElement };
  moving?: boolean;
}

class Sprite {
  position: Position;
  velocity?: Position;
  image : HTMLImageElement;
  frames:Frames
  width: number = 0;
  height: number = 0;
  sprites: { [key: string]: HTMLImageElement };
  moving?: boolean;


  constructor({ position, velocity, image, frames = { max: 1 },sprites={} }: SpriteConfig) {
    this.position = position;
    this.velocity = velocity;
    this.image = image;
    this.frames = {...frames,val:0,elapsed:0}

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.moving =false
    this.sprites = sprites//now for multiplle avatar images
  }

  draw(c: CanvasRenderingContext2D, scale: number = 1) {
    const scaledWidth = (this.image.width / this.frames.max) * scale;
    const scaledHeight = this.image.height * scale;
  
    c.drawImage(
      this.image,
      this.frames.val*this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      scaledWidth, // destination width (scaled width)
      scaledHeight // destination height (scaled height)

    ); if(!this.moving) return
    if(this.frames.max>1){   //Each time the draw method is called, elapsed is incremented by 1 if frames.max > 1.
     this.frames.elapsed++
    }
    if(this.frames.elapsed % 10 ===0){  //This means the frame will update every 10th frame of the animation (approximately every 1/6th of a second at 60 FPS).

    if(this.frames.val<this.frames.max-1) this.frames.val++
    else this.frames.val=0  // reset the frames to 0 when we reach the last frame
   }
 }
}  

interface RectangleCollisionConfig {
  rectangle1: { position: Position; width: number; height: number };
  rectangle2: { position: Position; width: number; height: number };
}

function rectangleCollision({
  rectangle1,
  rectangle2,
}: RectangleCollisionConfig): boolean {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
  );
}


export const useGame = () => {
  console.log(collisions)
  useEffect(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    const c = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = 1400;
    canvas.height = 900;

    const collisionsMap: number[][] = [];
    const tileSize = 120; // Number of elements per row in the 2D array
    for (let i = 0; i < collisions.length; i += tileSize) {
      collisionsMap.push(collisions.slice(i, i + tileSize));
    }
    console.log(collisionsMap)

    const boundaries: Boundary[] = [];
    const offset = {
      x: -400,
      y: -600
    };

    collisionsMap.forEach((row, i) => {
      row.forEach((symbol, j) => {
        if (symbol === 283820) {  //symbol Represents a Collision Point
            // Create a new Boundary object with calculated position
            const boundary = new Boundary({
              position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y
              }
            })
          boundaries.push(boundary)
        } 
      });
    });
  

    const image = new Image();
    image.src = "/assets/ArenaMap.png";
    const forgroundImage = new Image();
    forgroundImage.src = "assets/forground.png";
    
    const playerDownImage = new Image();
    playerDownImage.src = "assets/playerDown.png"
    
    const playerUpImage = new Image();
    playerUpImage.src = "assets/playerUp.png"
    
    const playerRightImage = new Image();
    playerRightImage.src = "assets/playerRight.png"
    
    const playerLeftImage = new Image();
    playerLeftImage .src = "assets/playerLeft.png"
    

    const playerImage = new Image();
    playerImage.src = "/assets/playerDown.png";

    console.log(playerDownImage)
    console.log(playerUpImage)
    console.log(playerLeftImage)
    console.log(playerRightImage)
    console.log(forgroundImage)
    const player = new Sprite({
      position: {
        x: canvas.width / 2 - playerImage.width / 4,
        y: canvas.height / 2 - playerImage.height / 2
      },
      image: playerImage,
      frames: {
        max: 4
      },sprites:{
        up:playerUpImage,
        left:playerLeftImage,
        right:playerRightImage,
        down:playerDownImage
       
      }
    });
console.log(player.sprites)

    const background = new Sprite({
      position: {
        x: offset.x,
        y: offset.y
      },
      image: image
    });
      
    const froground = new Sprite({
      position:{
          x:offset.x,
          y:offset.y
      },
          image:forgroundImage
    }) 
  

    const keys: Record<string, { pressed: boolean }> = {
      ArrowLeft: { pressed: false },
      ArrowRight: { pressed: false },
      ArrowDown: { pressed: false },
      ArrowUp: { pressed: false }
    };

    const movables = [background, ...boundaries,froground];

    let lastKey = "";
 
    function animate() {
      window.requestAnimationFrame(animate);
      c.clearRect(0, 0, canvas.width, canvas.height);
      background.draw(c);
    
      boundaries.forEach(boundary => {
        boundary.draw(c);
      });
    
      const playerScale = 0.5; // Scale factor for the player
      player.draw(c, playerScale);
      froground.draw(c)
     player.moving=false
      // Adjust player dimensions for collision detection
      const scaledPlayerWidth = player.width * playerScale;
      const scaledPlayerHeight = player.height * playerScale;
    
      let collisionDetected = false;
    
      if (keys.ArrowLeft.pressed && lastKey === "ArrowLeft") {
        player.moving=true;
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            rectangleCollision({
              rectangle1: {
                position: player.position,
                width: scaledPlayerWidth,
                height: scaledPlayerHeight
              },
              rectangle2: {
                ...boundary,
                position: {
                  x: boundary.position.x + 3,
                  y: boundary.position.y
                }
              }
            })
          ) {
            collisionDetected = true;
            break;
          }
        }
    
        if (!collisionDetected) {
          movables.forEach(movable => {
            movable.position.x += 3;
          });
        }
      } else if (keys.ArrowRight.pressed && lastKey === "ArrowRight") {
        player.moving = true;
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            rectangleCollision({
              rectangle1: {
                position: player.position,
                width: scaledPlayerWidth,
                height: scaledPlayerHeight
              },
              rectangle2: {
                ...boundary,
                position: {
                  x: boundary.position.x - 3,
                  y: boundary.position.y
                }
              }
            })
          ) {
            collisionDetected = true;
            break;
          }
        }
    
        if (!collisionDetected) {
          movables.forEach(movable => {
            movable.position.x -= 3;
          });
        }
      } else if (keys.ArrowDown.pressed && lastKey === "ArrowDown") {
        player.moving = true;
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            rectangleCollision({
              rectangle1: {
                position: player.position,
                width: scaledPlayerWidth,
                height: scaledPlayerHeight
              },
              rectangle2: {
                ...boundary,
                position: {
                  x: boundary.position.x,
                  y: boundary.position.y - 3
                }
              }
            })
          ) {
            collisionDetected = true;
            break;
          }
        }
    
        if (!collisionDetected) {
          movables.forEach(movable => {
            movable.position.y -= 3;
          });
        }
      } else if (keys.ArrowUp.pressed && lastKey === "ArrowUp") {
        player.moving = true;
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            rectangleCollision({
              rectangle1: {
                position: player.position,
                width: scaledPlayerWidth,
                height: scaledPlayerHeight
              },
              rectangle2: {
                ...boundary,
                position: {
                  x: boundary.position.x,
                  y: boundary.position.y + 3
                }
              }
            })
          ) {
            collisionDetected = true;
            break;
          }
        }
    
        if (!collisionDetected) {
          movables.forEach(movable => {
            movable.position.y += 3;
          });
        }
      }
    }
    
    animate();

    window.addEventListener("keydown", e => {
      switch (e.key) {
        case "ArrowLeft":
          keys.ArrowLeft.pressed = true;
          
          lastKey = "ArrowLeft";
          break;
        case "ArrowRight":
          keys.ArrowRight.pressed = true;
          lastKey = "ArrowRight";
          break;
        case "ArrowUp":
          keys.ArrowUp.pressed = true;
          lastKey = "ArrowUp";
          break;
        case "ArrowDown":
          keys.ArrowDown.pressed = true;
          lastKey = "ArrowDown";
          break;
      }
    });

    window.addEventListener("keyup", e => {
      switch (e.key) {
        case "ArrowLeft":
          keys.ArrowLeft.pressed = false;
          break;
        case "ArrowRight":
          keys.ArrowRight.pressed = false;
          break;
          case "ArrowUp":
            keys.ArrowUp.pressed=false
             break;
           case "ArrowDown":
            keys.ArrowDown.pressed=false
             break;
         }
    
         })
}, [])}