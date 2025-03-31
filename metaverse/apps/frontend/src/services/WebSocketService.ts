import { spaceId } from "./spaceId";
import { toast } from "sonner";
export interface Position {
  x: number;
  y: number;
}

export interface User {
  userId: string;
  position: Position;
  name: string;
  peerId: string;
  isGuest?: boolean;
}

interface WebSocketMessage {
  type: string;
  payload: any;
}
const token = localStorage.getItem('token');

class WebSocketService {
  private socket: WebSocket | null = null; 
  private userId: string | null = null;
  private userName: string | null = null;
  private isGuest: boolean = false;
  private spaceId: string | null = null;

  private onUserJoinedCallback: ((user: User) => void) | null = null;
  private onUserLeftCallback: ((userId: string) => void) | null = null;
  private onUserMovementCallback: ((userId: string, position: Position, direction: string) => void) | null = null;
  private onChatMessageCallback: ((userId: string, message: string, username?: string) => void) | null = null;




  connect(spaceId: string, guestName: string = "Guest") {
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const wsUrl = process.env.NODE_ENV === 'development' 
      ? 'ws://localhost:3004' 
      : `${protocol}${window.location.host}/ws`;

    try {
      this.socket = new WebSocket(wsUrl);
      this.userName = guestName;
      this.spaceId = spaceId;

      this.socket.onopen = () => {
        console.log("WebSocket Connected");
        console.log("only conencted dont send them to join spave");
        this.joinSpace();
      };

      this.socket.onmessage = (event) => {
        console.log("WebSocket Message:", event);
       this.handleMessage(event);
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
        toast.error("Connection error. Trying to reconnect...");
      };

      this.socket.onclose = () => {
        console.log("WebSocket Disconnected");
      //  Attempt to reconnect after a short delay
        setTimeout(() => {
          if (this.spaceId) {
            this.connect(this.spaceId, this.userName || undefined);
          }
        }, 3000);
      };
    } catch (error) {
      console.error("WebSocket Connection Error:", error);
      toast.error("Failed to connect. Please try again later.");
    }
  }

  private handleMessage(event: MessageEvent) {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case "space-joined":
          console.log(message.payload)
          console.log(message)
          this.handleSpaceJoined(message.payload);
          break;
        case "user-joined":
          this.handleUserJoined(message.payload);
          break;
        case "user-left":
          this.handleUserLeft(message.payload);
          break;
        case "movement":
          this.handleMovement(message.payload);
          break;
        case "chat":
          this.handleChatMessage(message.payload);
          break;
        default:
          console.log("Unhandled message type:", message.type);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }

  private handleSpaceJoined(payload: any) {
    console.log("Joined space:", payload);
    this.userId = payload.userId;
    toast.success(`Welcome to the metaverse, ${payload.name}!`);
    
    // Initialize other users that are already in the space
    if (payload.newUserPosition && Array.isArray(payload.newUserPosition)) {
      payload.newUserPosition.forEach((user: User) => {
        if (user.userId !== this.userId && this.onUserJoinedCallback) {
          this.onUserJoinedCallback(user);
        }
      });
    }
  }

  private handleUserJoined(payload: any) {
    console.log("User joined:", payload);
    if (this.onUserJoinedCallback && payload.userId !== this.userId) {
      toast.info(`${payload.name} joined the metaverse!`);
      this.onUserJoinedCallback({
        userId: payload.userId,
        name: payload.name,
        position: { x: 0, y: 0 },
        peerId: payload.peerId,
        isGuest: payload.isGuest
      });
    }
  }

  private handleUserLeft(payload: any) {
    console.log("User left:", payload);
    if (this.onUserLeftCallback && payload.userId !== this.userId) {
      toast.info(`${payload.name} left the metaverse`);
      this.onUserLeftCallback(payload.userId);
    }
  }

  private handleMovement(payload: any) {
    if (this.onUserMovementCallback && payload.userId !== this.userId) {
      this.onUserMovementCallback(
        payload.userId,
        payload.position,
        payload.direction
      );
    }
  }

  private handleChatMessage(payload: any) {
    if (this.onChatMessageCallback) {
      this.onChatMessageCallback(
        payload.userId,
        payload.message,
        payload.username
      );
    }
  }

  private joinSpace() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN || !this.spaceId) {
      return;
    }

    const randomToken = Math.random().toString(36).substring(2, 15);

    const message = {
      type: "join",
      payload: {
        spaceId: spaceId,
        token: token,
        isGuest: this.isGuest,
        guestName: this.userName,
        peerId: `peer_${randomToken}`
      }
    };

    this.socket.send(JSON.stringify(message));
  }

  sendMovement(x: number, y: number, direction: string) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const message = {
      type: "movement",
      payload: {
        x,
        y,
        direction
      }
    };

    this.socket.send(JSON.stringify(message));
  }

  sendChatMessage(message: string) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const chatMessage = {
      type: "chat",
      payload: {
        message
      }
    };

    this.socket.send(JSON.stringify(chatMessage));
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  onUserJoined(callback: (user: User) => void) {  
    this.onUserJoinedCallback = callback;  
  }

  onUserLeft(callback: (userId: string) => void) {
    this.onUserLeftCallback = callback;
  }

  onUserMovement(callback: (userId: string, position: Position, direction: string) => void) {
    this.onUserMovementCallback = callback;
  }

  onChatMessage(callback: (userId: string, message: string, username?: string) => void) {
    this.onChatMessageCallback = callback;
  }

  getCurrentUserId() {
    return this.userId;
  }
}

// Singleton instance
export const webSocketService = new WebSocketService();
