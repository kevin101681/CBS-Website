export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface VisionState {
  image: string | null; // Base64
  prompt: string;
  response: string;
  isLoading: boolean;
}

export enum AppView {
  HOME = 'HOME',
  CHAT = 'CHAT',
  VISION = 'VISION'
}