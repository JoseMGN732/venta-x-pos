import * as React from "react"
import { cn } from "../../lib/utils"
import { Button } from "./button"
import { X } from "lucide-react"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-lg bg-background p-6 shadow-lg animate-in fade-in zoom-in duration-200">
        {children}
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </button>
      </div>
    </div>
  )
}

const DialogContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={cn("grid gap-4", className)}>{children}</div>
)

const DialogHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}>{children}</div>
)

const DialogFooter: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}>{children}</div>
)

const DialogTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>{children}</h2>
)

const DialogDescription: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
)

export { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription }
