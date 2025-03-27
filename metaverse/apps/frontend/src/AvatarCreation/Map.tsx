import { useEffect } from "react";
import { collisions } from "../Data/collisions";

interface Position {
  x: number;
  y: number;
}

interface BoundaryConfig {
  position: Position;
}

class Boundary {
  static width: number = 24;
  static height: number = 24;
  position: Position;

  constructor({ position }: BoundaryConfig) {
    this.position = position;
  }

  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "rgba(255, 255, 255, 0.2)"; // Transparent for debugging
    c.fillRect(this.position.x, this.position.y, Boundary.width, Boundary.height);
  }
}

interface SpriteConfig {
  position: Position;
  image: HTMLImageElement;
}

class Sprite {
  position: Position;
  image: HTMLImageElement;

  constructor({ position, image }: SpriteConfig) {
    this.position = position;
    this.image = image;
  }

  draw(c: CanvasRenderingContext2D) {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

export const useMapCreation = () => {
  useEffect(() => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const c = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.width = 1400;
    canvas.height = 900;

   
    const tileSize = 120; 
    const collisionsMap: number[][] = [];
    for (let i = 0; i < collisions.length; i += tileSize) {
      collisionsMap.push(collisions.slice(i, i + tileSize));
    }

    const boundaries: Boundary[] = [];
    const offset = {
      x: -400, 
      y: -600,
    };
  console.log(boundaries)
    collisionsMap.forEach((row, i) => {
      row.forEach((symbol, j) => {
        if (symbol === 283820) {
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y,
              },
            })
          );
        }
      });
    });

    const backgroundImage = new Image();
    backgroundImage.src = "/assets/ArenaMap.png";
    console.log(backgroundImage);
    const foregroundImage = new Image();
    foregroundImage.src = "/assets/foreground.png";

    const background = new Sprite({
      position: offset,
      image: backgroundImage,
    });

    const foreground = new Sprite({
      position: offset,
      image: foregroundImage,
    });

    // Draw the map
    function drawMap() {
      c.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      background.draw(c);

      // Draw boundaries for visual debugging
      boundaries.forEach((boundary) => {
        boundary.draw(c);
      });

      // Draw foreground
      foreground.draw(c);
    }

    drawMap();

    // Save map data and foreground separately to the database
    const saveMapAndForeground = async () => {
      const mapData = boundaries.map((boundary) => ({
        x: boundary.position.x,
        y: boundary.position.y,
      }));

      try {
      const response = await fetch("http://localhost:3000/api/v1/admin/map", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      name: "Test Map",
     dimensions: "1400x900",
     thumbnail: "/assets/thumbnail.png",
     defaultElements: [
      { elementId: "1", x: 100, y: 200 },
      { elementId: "2", x: 300, y: 400 }
    ]
  }),
});


        if (response.ok) {
          console.log("Map and foreground saved successfully!");
        } else {
          console.error("Failed to save map and foreground.");
        }
      } catch (error) {
        console.error("Error saving map and foreground:", error);
      }
    };

    // Call the function to save the map and foreground
    saveMapAndForeground();
  }, []);
};
