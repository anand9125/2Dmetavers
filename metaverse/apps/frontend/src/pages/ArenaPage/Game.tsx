
import React, { useRef, useEffect, useState } from 'react';
import { webSocketService, User, Position } from '../../services/WebSocketService';
import { collisions } from '../../lib/Data/collisions';
import  Input  from "../../Components/input";
import { toast } from "sonner";
import  Button2  from '../../Components/Button2';

interface BoundaryConfig {
  position: Position;
}

interface Frames {
  max: number;
  val: number;
  elapsed: number;
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
    c.fillStyle = 'rgba(255, 255, 255, 0)';
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
  playerId?: string;
  playerName?: string;
}

class Sprite {
  position: Position;
  velocity?: Position;
  image: HTMLImageElement;
  frames: Frames;
  width: number = 0;
  height: number = 0;
  sprites: { [key: string]: HTMLImageElement };
  moving?: boolean;
  playerId?: string;
  playerName?: string;

  constructor({ 
    position, 
    velocity, 
    image, 
    frames = { max: 1 }, 
    sprites = {},
    playerId,
    playerName
  }: SpriteConfig) {
    this.position = position;
    this.velocity = velocity;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.playerId = playerId;
    this.playerName = playerName;

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.moving = false;
    this.sprites = sprites;
  }

  draw(c: CanvasRenderingContext2D, scale: number = 1) {
    const scaledWidth = (this.image.width / this.frames.max) * scale;
    const scaledHeight = this.image.height * scale;

    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      scaledWidth,
      scaledHeight
    );

    // Draw player name above sprite
    if (this.playerName) {
      c.font = '14px Arial';
      c.fillStyle = 'white';
      c.textAlign = 'center';
      c.fillText(
        this.playerName,
        this.position.x + scaledWidth / 2,
        this.position.y - 10
      );
    }

    if (!this.moving) return;
    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }
    if (this.frames.elapsed % 10 === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

function rectangleCollision({
  rectangle1,
  rectangle2,
}: {
  rectangle1: { position: Position; width: number; height: number };
  rectangle2: { position: Position; width: number; height: number };
}): boolean {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
  );
}

const MultiplayerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerName, setPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  
  const gameSetupRef = useRef<{
    otherPlayers: Map<string, Sprite>;
    boundaries: Boundary[];
    background: Sprite | null;
    player: Sprite | null;
    foreground: Sprite | null;
    movables: any[];
    keys: Record<string, { pressed: boolean }>;
    lastKey: string;
    offset: { x: number; y: number };
  }>({
    otherPlayers: new Map(),
    boundaries: [],
    background: null,
    player: null,
    foreground: null,
    movables: [],
    keys: {
      ArrowLeft: { pressed: false },
      ArrowRight: { pressed: false },
      ArrowDown: { pressed: false },
      ArrowUp: { pressed: false }
    },
    lastKey: "",
    offset: { x: -400, y: -600 }
  });

  const startGame = () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    setGameStarted(true);
    
    // Connect to WebSocket server
    webSocketService.connect("default-space", playerName);
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      webSocketService.sendChatMessage(chatMessage);
      // Add message to local chat
      setMessages(prev => [
        ...prev,
        { sender: `You (${playerName})`, message: chatMessage }
      ]);
      setChatMessage('');
    }
  };

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;

    const c = canvas.getContext('2d');
    if (!c) return;

    canvas.width = 1400;
    canvas.height = 900;

    const game = gameSetupRef.current;

    // Create collision map
    const collisionsMap: number[][] = [];
    const tileSize = 120;
    for (let i = 0; i < collisions.length; i += tileSize) {
      collisionsMap.push(collisions.slice(i, i + tileSize));
    }

    // Create boundaries
    collisionsMap.forEach((row, i) => {
      row.forEach((symbol, j) => {
        if (symbol === 283820) {
          const boundary = new Boundary({
            position: {
              x: j * Boundary.width + game.offset.x,
              y: i * Boundary.height + game.offset.y
            }
          });
          game.boundaries.push(boundary);
        }
      });
    });

    // Load images
    const loadImages = () => {
      return new Promise<{
        mapImage: HTMLImageElement;
        foregroundImage: HTMLImageElement;
        playerDown: HTMLImageElement;
        playerUp: HTMLImageElement;
        playerRight: HTMLImageElement;
        playerLeft: HTMLImageElement;
      }>((resolve) => {
        const mapImage = new Image();
        mapImage.src = "/assets/ArenaMap.png";
        
        const foregroundImage = new Image();
        foregroundImage.src = "/assets/forground.png";
        
        const playerDown = new Image();
        playerDown.src = "/assets/playerDown.png";
        
        const playerUp = new Image();
        playerUp.src = "/assets/playerUp.png";
        
        const playerRight = new Image();
        playerRight.src = "/assets/playerRight.png";
        
        const playerLeft = new Image();
        playerLeft.src = "/assets/playerLeft.png";
        
        let loadedCount = 0;
        const totalImages = 6;
        
        const checkAllLoaded = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            resolve({
              mapImage,
              foregroundImage,
              playerDown,
              playerUp,
              playerRight,
              playerLeft
            });
          }
        };
        
        mapImage.onload = checkAllLoaded;
        foregroundImage.onload = checkAllLoaded;
        playerDown.onload = checkAllLoaded;
        playerUp.onload = checkAllLoaded;
        playerRight.onload = checkAllLoaded;
        playerLeft.onload = checkAllLoaded;
      });
    };

    loadImages().then(images => {
      // Create player sprite
      game.player = new Sprite({
        position: {
          x: canvas.width / 2 - images.playerDown.width / 4,
          y: canvas.height / 2 - images.playerDown.height / 2
        },
        image: images.playerDown,
        frames: {
          max: 4
        },
        sprites: {
          up: images.playerUp,
          left: images.playerLeft,
          right: images.playerRight,
          down: images.playerDown
        },
        playerName
      });

      // Create background sprite
      game.background = new Sprite({
        position: {
          x: game.offset.x,
          y: game.offset.y
        },
        image: images.mapImage
      });

      // Create foreground sprite
      game.foreground = new Sprite({
        position: {
          x: game.offset.x,
          y: game.offset.y
        },
        image: images.foregroundImage
      });

      game.movables = [game.background, ...game.boundaries, game.foreground];

      // Handle WebSocket events
      webSocketService.onUserJoined((user) => {  // registers a function that will be triggered when a user joins.
        console.log("User joined game:", user);
        const otherPlayerSprite = new Sprite({
          position: {
            x: canvas.width / 2,
            y: canvas.height / 2
          },
          image: images.playerDown,
          frames: {
            max: 4
          },
          sprites: {
            up: images.playerUp,
            left: images.playerLeft,
            right: images.playerRight,
            down: images.playerDown
          },
          playerId: user.userId,
          playerName: user.name
        });
        
        game.otherPlayers.set(user.userId, otherPlayerSprite);
      });

      webSocketService.onUserLeft((userId) => {
        console.log("User left game:", userId);
        game.otherPlayers.delete(userId);
      });

      webSocketService.onUserMovement((userId, position, direction) => {
        const otherPlayer = game.otherPlayers.get(userId);
        if (otherPlayer) {
          otherPlayer.position = {
            x: canvas.width / 2 - (position.x - game.player?.position.x!) - otherPlayer.width / 4,
            y: canvas.height / 2 - (position.y - game.player?.position.y!) - otherPlayer.height / 2
          };
          
          if (direction === 'ArrowLeft') {
            otherPlayer.image = otherPlayer.sprites.left;
          } else if (direction === 'ArrowRight') {
            otherPlayer.image = otherPlayer.sprites.right;
          } else if (direction === 'ArrowUp') {
            otherPlayer.image = otherPlayer.sprites.up;
          } else if (direction === 'ArrowDown') {
            otherPlayer.image = otherPlayer.sprites.down;
          }
          
          otherPlayer.moving = true;
        }
      });

      webSocketService.onChatMessage((userId, message, username) => {
        setMessages(prev => [
          ...prev,
          { sender: username || "Unknown player", message }
        ]);
      });

      // Animation loop
      let animationId: number;
      function animate() {
        animationId = window.requestAnimationFrame(animate);
        if (!c || !game.player || !game.background || !game.foreground) return;
        
        c.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        game.background.draw(c);
        
        // Draw boundaries
        game.boundaries.forEach(boundary => {
          boundary.draw(c);
        });
        
        // Draw player
        const playerScale = 0.5;
        game.player.draw(c, playerScale);
        
        // Draw other players
        game.otherPlayers.forEach(otherPlayer => {
          otherPlayer.draw(c, playerScale);
          // Reset moving for next frame
          otherPlayer.moving = false;
        });
        
        // Draw foreground
        game.foreground.draw(c);
        
        game.player.moving = false;
        
        // Handle player movement
        const scaledPlayerWidth = game.player.width * playerScale;
        const scaledPlayerHeight = game.player.height * playerScale;
        
        let collisionDetected = false;
        let playerGridX = 0;
        let playerGridY = 0;
        
        if (game.keys.ArrowLeft.pressed && game.lastKey === "ArrowLeft") {
          game.player.moving = true;
          game.player.image = game.player.sprites.left;

          for (let i = 0; i < game.boundaries.length; i++) {
            const boundary = game.boundaries[i];
            if (
              rectangleCollision({
                rectangle1: {
                  position: game.player.position,
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
            game.movables.forEach(movable => {
              movable.position.x += 3;
            });
            
            // Calculate grid position
            playerGridX = Math.floor((-game.offset.x + canvas.width / 2) / Boundary.width);
            playerGridY = Math.floor((-game.offset.y + canvas.height / 2) / Boundary.height);
            
            // Send movement to server
            webSocketService.sendMovement(playerGridX, playerGridY, "ArrowLeft");
          }
        } else if (game.keys.ArrowRight.pressed && game.lastKey === "ArrowRight") {
          game.player.moving = true;
          game.player.image = game.player.sprites.right;
          
          for (let i = 0; i < game.boundaries.length; i++) {
            const boundary = game.boundaries[i];
            if (
              rectangleCollision({
                rectangle1: {
                  position: game.player.position,
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
            game.movables.forEach(movable => {
              movable.position.x -= 3;
            });
            
            playerGridX = Math.floor((-game.offset.x + canvas.width / 2) / Boundary.width);
            playerGridY = Math.floor((-game.offset.y + canvas.height / 2) / Boundary.height);
            
            webSocketService.sendMovement(playerGridX, playerGridY, "ArrowRight");
          }
        } else if (game.keys.ArrowDown.pressed && game.lastKey === "ArrowDown") {
          game.player.moving = true;
          game.player.image = game.player.sprites.down;
          
          for (let i = 0; i < game.boundaries.length; i++) {
            const boundary = game.boundaries[i];
            if (
              rectangleCollision({
                rectangle1: {
                  position: game.player.position,
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
            game.movables.forEach(movable => {
              movable.position.y -= 3;
            });
            
            playerGridX = Math.floor((-game.offset.x + canvas.width / 2) / Boundary.width);
            playerGridY = Math.floor((-game.offset.y + canvas.height / 2) / Boundary.height);
            
            webSocketService.sendMovement(playerGridX, playerGridY, "ArrowDown");
          }
        } else if (game.keys.ArrowUp.pressed && game.lastKey === "ArrowUp") {
          game.player.moving = true;
          game.player.image = game.player.sprites.up;
          
          for (let i = 0; i < game.boundaries.length; i++) {
            const boundary = game.boundaries[i];
            if (
              rectangleCollision({
                rectangle1: {
                  position: game.player.position,
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
            game.movables.forEach(movable => {
              movable.position.y += 3;
            });
            
            playerGridX = Math.floor((-game.offset.x + canvas.width / 2) / Boundary.width);
            playerGridY = Math.floor((-game.offset.y + canvas.height / 2) / Boundary.height);
            
            webSocketService.sendMovement(playerGridX, playerGridY, "ArrowUp");
          }
        }
      }

      // Start animation
      animate();

      // Event listeners for keyboard input
      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case "ArrowLeft":
            game.keys.ArrowLeft.pressed = true;
            game.lastKey = "ArrowLeft";
            break;
          case "ArrowRight":
            game.keys.ArrowRight.pressed = true;
            game.lastKey = "ArrowRight";
            break;
          case "ArrowUp":
            game.keys.ArrowUp.pressed = true;
            game.lastKey = "ArrowUp";
            break;
          case "ArrowDown":
            game.keys.ArrowDown.pressed = true;
            game.lastKey = "ArrowDown";
            break;
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        switch (e.key) {
          case "ArrowLeft":
            game.keys.ArrowLeft.pressed = false;
            break;
          case "ArrowRight":
            game.keys.ArrowRight.pressed = false;
            break;
          case "ArrowUp":
            game.keys.ArrowUp.pressed = false;
            break;
          case "ArrowDown":
            game.keys.ArrowDown.pressed = false;
            break;
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      // Cleanup
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        window.cancelAnimationFrame(animationId);
        webSocketService.disconnect();
      };
    });

    return () => {
      webSocketService.disconnect();
    };
  }, [gameStarted, playerName]);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {!gameStarted ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-4xl font-bold mb-8 text-center text-purple-400">
              Metaverse Multiplayer
            </h1>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Enter Your Name
              </label>
              <Input
                id="name"
                type="text"
                value={playerName}
                onChange={(e:any) => setPlayerName(e.target.value)}
                className="bg-gray-700 text-white"
                placeholder="Your name"
              />
            </div>
            <Button2 
              onClick={startGame} 
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Enter Metaverse
            </Button2>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-row h-screen">
            <div className="flex-1">
              <canvas ref={canvasRef} className="w-full h-full" />
            </div>
            <div className="w-80 bg-gray-800 p-4 overflow-hidden flex flex-col h-full">
              <h2 className="text-xl font-bold mb-3 text-purple-400">Chat</h2>
              <div className="flex-1 overflow-y-auto mb-4">
                {messages.map((msg, index) => (
                  <div key={index} className="mb-2">
                    <span className="font-bold text-purple-300">{msg.sender}: </span>
                    <span>{msg.message}</span>
                  </div>
                ))}
              </div>
              <div className="flex">
                <Input
                  type="text"
                  value={chatMessage}
                  onChange={(e:any) => setChatMessage(e.target.value)}
                  onKeyDown={(e:any) => e.key === 'Enter' && sendChatMessage()}
                  className="bg-gray-700 flex-1 mr-2"
                  placeholder="Type a message..."
                />
                <Button2
                  onClick={sendChatMessage}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Send
                </Button2>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MultiplayerGame;
