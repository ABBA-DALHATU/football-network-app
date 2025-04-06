export interface User {
    id: string
    name: string
    email: string
    avatar: string
    role: string
  }
  
  export interface Message {
    id: string
    senderId: string
    receiverId: string
    content: string
    createdAt: Date
  }
  
  export interface Conversation {
    id: string
    user: User
    messages: Message[]
    lastMessage: Message | null
    updatedAt: Date
  }
  
  