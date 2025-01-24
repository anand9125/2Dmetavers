import { useEffect,useState ,FC} from "react";


interface AvatarSprite {
    imageUrl: string;
    width: number;
    height: number;
    spriteColumns: number;
    spriteRows: number;
    animationFrames: number;
  }
 
  enum AvatarDirection {
    Front = "front",
    Back = "back",
    Left = "left",
    Right = "right",
  }
  type AnimatedAvatarProps = {
    direction: AvatarDirection;
    sprite?: AvatarSprite;
    isMoving?: boolean;
  };


  const playerConfig = {
    down: {
        imageUrl: "assets/playerDown.png",
        width: 192,
        height: 68,
        spriteColumn: 4,
        animationFrames: 2,
    },
    up: {
        imageUrl: "assets/playerUp.png",
        width: 192,
        height: 68,
        spriteColumn: 4,
        animationFrames: 2,
    },
    left: {
        imageUrl: "assets/playerLeft.png",
        width: 192,
        height: 68,
        spriteColumn: 4,
        animationFrames: 2,
    },
    right: {
        imageUrl: "assets/playerRight.png",
        width: 192,
        height: 68,
        spriteColumn: 4,
        animationFrames: 2,
    },
};

const avatarSprite: AvatarSprite = {
    imageUrl:
      "https://opengameart.org/sites/default/files/styles/medium/public/MainGuySpriteSheet.png", // Replace with your sprite sheet path
    width: 120, 
    height: 145, 
    spriteColumns: 3,
    spriteRows: 4, 
    animationFrames: 2, 
  };
  const avatarSprite2: AvatarSprite = {
    imageUrl:
      "https://opengameart.org/sites/default/files/styles/medium/public/Heroe%20%282%29_1.png", // Replace with your sprite sheet path
    width: 250, 
    height: 252, 
    spriteColumns: 4, 
    spriteRows: 4, 
    animationFrames: 2, 
  };

  export const AnimatedAvatar: FC<AnimatedAvatarProps> = ({ direction, sprite = avatarSprite, isMoving = false }) =>{
    const [frameIndex, setFrameIndex] = useState(0);
  
    useEffect(()=>{
        let animationInterval = null;
        if(isMoving){
            animationInterval = setInterval(() => {
                setFrameIndex((currentFrameIndex) => (currentFrameIndex + 1) % sprite.animationFrames);
            }, 1000 / 60); // 60 fps
            setFrameIndex(0)
        }else{
            setFrameIndex(0)
        }
        return ()=>{
            if(animationInterval) clearInterval(animationInterval)
        }
    },[sprite.animationFrames,isMoving])


  const getSpritePosition = (): React.CSSProperties =>{
    let row =0;
    switch(direction){
        case AvatarDirection.Front:
            row = 0;
            break;
        case AvatarDirection.Back:
            row = 1;
            break;
        case AvatarDirection.Left:
            row = 2;
            break;
        case AvatarDirection.Right:
            row = 3;
            break;
        default:
            row = 0;

    }
    return{
        backgroundImage:`url(${sprite.imageUrl})`,
        backgroundPosition:  `-${frameIndex * (sprite.width / sprite.spriteColumns)}px -${row * (sprite.height / sprite.spriteRows)}px`,  // Determines which part of the sprite sheet to display
        width: sprite.width,
        height: sprite.height,
        backgroundRepeat: "no-repeat",
        position: "relative",
         transform: "scale(1.5)"  // Scales the sprite for a larger appearance
    }
  }
  return (
    <div
      className="avatar-sprite"
      style={{
        ...getSpritePosition(),
        imageRendering: "pixelated",
        transform: "scale(1.5)",
      }}
    />
  );
}
  export const AnimatedAvatar2: FC<AnimatedAvatarProps> = ({ direction, sprite = avatarSprite2, isMoving = false }) =>{
    const [frameIndex, setFrameIndex] = useState(0);
  
    useEffect(()=>{
        let animationInterval = null;
        if(isMoving){
            animationInterval = setInterval(() => {
                setFrameIndex((currentFrameIndex) => (currentFrameIndex + 1) % sprite.animationFrames);
            }, 1000 / 60); // 60 fps
            setFrameIndex(0)
        }else{
            setFrameIndex(0)
        }
        return ()=>{
            if(animationInterval) clearInterval(animationInterval)
        }
    },[sprite.animationFrames,isMoving])


  const getSpritePosition = (): React.CSSProperties =>{
    let row =0;
    switch(direction){
        case AvatarDirection.Front:
            row = 0;
            break;
        case AvatarDirection.Back:
            row = 1;
            break;
        case AvatarDirection.Left:
            row = 2;
            break;
        case AvatarDirection.Right:
            row = 3;
            break;
        default:
            row = 0;

    }
    return{
        backgroundImage:`url(${sprite.imageUrl})`,
        backgroundPosition:  `-${frameIndex * (sprite.width / sprite.spriteColumns)}px -${row * (sprite.height / sprite.spriteRows)}px`,  // Determines which part of the sprite sheet to display
        width: sprite.width,
        height: sprite.height,
        backgroundRepeat: "no-repeat",
        position: "relative",
         transform: "scale(1.5)"  // Scales the sprite for a larger appearance
    }
  }
  return (
    <div
      className="avatar-sprite"
      style={{
        ...getSpritePosition(),
        imageRendering: "pixelated",
        transform: "scale(1.5)",
      }}
    />
  );
}
export const AnimatedAvatar3: FC<AnimatedAvatarProps> = ({
    direction,
    sprite = playerConfig.down, // Default to playerConfig.down
    isMoving = false,
  }) => {
    const [frameIndex, setFrameIndex] = useState(0);
  
    useEffect(() => {
      let animationInterval: NodeJS.Timeout | null = null;
  
      if (isMoving) {
        animationInterval = setInterval(() => {
          setFrameIndex((currentFrameIndex) => (currentFrameIndex + 1) % sprite.animationFrames);
        }, 1000 / 60); // 60 fps
      } else {
        setFrameIndex(0);
      }
  
      return () => {
        if (animationInterval) clearInterval(animationInterval);
      };
    }, [isMoving, sprite.animationFrames]);
  
    const getSpritePosition = (): React.CSSProperties => {
      // Get the correct sprite for the current direction
      let selectedSprite = sprite;
  
      switch (direction) {
        case AvatarDirection.Front:
          selectedSprite = playerConfig.down;
          break;
        case AvatarDirection.Back:
          selectedSprite = playerConfig.up;
          break;
        case AvatarDirection.Left:
          selectedSprite = playerConfig.left;
          break;
        case AvatarDirection.Right:
          selectedSprite = playerConfig.right;
          break;
        default:
          selectedSprite = playerConfig.down;
      }
  
      // Calculate the background position based on frame index and direction
      return {
        backgroundImage: `url(${selectedSprite.imageUrl})`,
        backgroundPosition: `-${frameIndex * (selectedSprite.width / selectedSprite.spriteColumn)}px 0px`,
        width: selectedSprite.width,
        height: selectedSprite.height,
        backgroundRepeat: "no-repeat",
        position: "relative",
        transform: "scale(1.5)", // Scales the sprite for a larger appearance
      };
    };
  
    return (
      <div
        className="avatar-sprite"
        style={{
          ...getSpritePosition(),
          imageRendering: "pixelated",
        }}
      />
    );
  };