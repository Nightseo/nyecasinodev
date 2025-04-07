"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastContextType = {
  toast: (props: ToastProps) => void
  toasts: (ToastProps & { id: number })[]
  dismissToast: (id: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Global toast function that doesn't use hooks
let toastFn: ((props: ToastProps) => void) | undefined

export function toast(props: ToastProps) {
  if (toastFn) {
    toastFn(props)
  } else {
    console.warn("Toast function not available yet")
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(ToastProps & { id: number })[]>([])
  const [counter, setCounter] = useState(0)

  const addToast = (props: ToastProps) => {
    const id = counter
    setCounter((prev) => prev + 1)
    setToasts((prev) => [...prev, { ...props, id }])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismissToast(id)
    }, 5000)
  }

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Set the global toast function
  useEffect(() => {
    toastFn = addToast
    return () => {
      toastFn = undefined
    }
  }, [])

  return (
    <ToastContext.Provider value={{ toast: addToast, toasts, dismissToast }}>
      {children}

      <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-md shadow-md max-w-md ${
              toast.variant === "destructive" ? "bg-red-500 text-white" : "bg-white border"
            }`}
          >
            {toast.title && <h4 className="font-medium">{toast.title}</h4>}
            {toast.description && <p className="text-sm">{toast.description}</p>}
            <button className="absolute top-1 right-1 text-sm p-1" onClick={() => dismissToast(toast.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

