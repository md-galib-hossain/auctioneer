"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface DraggableProps {
  children: React.ReactNode
  className?: string
  initialPosition?: { x: number; y: number }
  onPositionChange?: (position: { x: number; y: number }) => void
}

export function Draggable({ children, className, initialPosition, onPositionChange }: DraggableProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 })
  const dragRef = useRef<HTMLDivElement>(null)
  const initialMousePosition = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true)

    if ("clientX" in e) {
      // Mouse event
      initialMousePosition.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      }
    } else {
      // Touch event
      initialMousePosition.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      }
    }
  }

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return

    let clientX, clientY

    if ("clientX" in e) {
      // Mouse event
      clientX = e.clientX
      clientY = e.clientY
    } else {
      // Touch event
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    }

    const newX = clientX - initialMousePosition.current.x
    const newY = clientY - initialMousePosition.current.y

    // Get viewport dimensions
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Get element dimensions
    const elementWidth = dragRef.current?.offsetWidth || 0
    const elementHeight = dragRef.current?.offsetHeight || 0

    // Constrain to viewport bounds
    const boundedX = Math.max(0, Math.min(newX, viewportWidth - elementWidth))
    const boundedY = Math.max(0, Math.min(newY, viewportHeight - elementHeight))

    setPosition({ x: boundedX, y: boundedY })

    if (onPositionChange) {
      onPositionChange({ x: boundedX, y: boundedY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      window.addEventListener("touchmove", handleMouseMove)
      window.addEventListener("touchend", handleMouseUp)
    } else {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchmove", handleMouseMove)
      window.removeEventListener("touchend", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchmove", handleMouseMove)
      window.removeEventListener("touchend", handleMouseUp)
    }
  }, [isDragging])

  return (
    <div
      ref={dragRef}
      className={cn("fixed cursor-move", className)}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: 50,
        touchAction: "none",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {children}
    </div>
  )
}
