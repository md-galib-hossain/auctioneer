// "use client"

// import type React from "react"

// import { createContext, useContext, useEffect, useState } from "react"
// import { io, type Socket } from "socket.io-client"

// interface SocketContextType {
//   socket: Socket | null
//   isConnected: boolean
// }

// const SocketContext = createContext<SocketContextType>({
//   socket: null,
//   isConnected: false,
// })

// export function SocketProvider({ children }: { children: React.ReactNode }) {
//   const [socket, setSocket] = useState<Socket | null>(null)
//   const [isConnected, setIsConnected] = useState(false)

//   useEffect(() => {
//     // Initialize socket connection
//     const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     })

//     // Set up event listeners
//     socketInstance.on("connect", () => {
//       console.log("Socket connected")
//       setIsConnected(true)
//     })

//     socketInstance.on("disconnect", () => {
//       console.log("Socket disconnected")
//       setIsConnected(false)
//     })

//     socketInstance.on("connect_error", (err) => {
//       console.error("Socket connection error:", err)
//       setIsConnected(false)
//     })

//     // Save socket instance
//     setSocket(socketInstance)

//     // Clean up on unmount
//     return () => {
//       socketInstance.disconnect()
//     }
//   }, [])

//   return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
// }

// export function useSocket() {
//   return useContext(SocketContext)
// }
