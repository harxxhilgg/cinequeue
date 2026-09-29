"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type ToastPosition =
  | "top-left"
  | "top-middle"
  | "top-right"
  | "bottom-left"
  | "bottom-middle"
  | "bottom-right"

type ToastType =
  | "success"
  | "info"
  | "warning"
  | "error"
  | "loading"

// -----------------------------------------------------------------------------
// Toast Manager
// -----------------------------------------------------------------------------

const toastManager = ToastPrimitive.createToastManager()

type ToastAddOptions = Parameters<typeof toastManager.add>[0]
type ToastUpdateOptions = Parameters<typeof toastManager.update>[1]

type TypedToastAddOptions = Omit<ToastAddOptions, "type"> & {
  type?: ToastType
}

type TypedToastUpdateOptions = Omit<ToastUpdateOptions, "type"> & {
  type?: ToastType
}

const toast = {
  add: (options: TypedToastAddOptions) => {
    return toastManager.add(options)
  },

  update: (id: string, options: TypedToastUpdateOptions) => {
    return toastManager.update(id, options)
  },

  close: (id?: string) => {
    return toastManager.close(id)
  },

  promise: toastManager.promise.bind(toastManager),
}

// -----------------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------------

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />
}

// -----------------------------------------------------------------------------
// Viewport
// -----------------------------------------------------------------------------

function ToastViewport({
  className,
  position = "bottom-right",
  ...props
}: ToastPrimitive.Viewport.Props & {
  position?: ToastPosition
}) {
  const isTop = position.startsWith("top")
  const isLeft = position.endsWith("left")
  const isMiddle = position.endsWith("middle")
  const isRight = position.endsWith("right")

  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      data-position={position}
      className={cn(
        "group/viewport pointer-events-none fixed z-50 w-[calc(100%-2rem)] max-w-sm outline-none",
        isTop ? "top-4" : "bottom-4",
        isLeft && "left-4",
        isMiddle && "left-1/2 -translate-x-1/2",
        isRight && "right-4",
        className
      )}
      {...props}
    />
  )
}

// -----------------------------------------------------------------------------
// Toast
// -----------------------------------------------------------------------------

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        "group/toast pointer-events-auto absolute right-0 z-[calc(1000-var(--toast-index))] w-full rounded-2xl border bg-popover text-popover-foreground shadow-lg will-change-transform outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",

        // Position
        "group-data-[position^=top]/viewport:top-0 group-data-[position^=top]/viewport:origin-top",
        "group-data-[position^=bottom]/viewport:bottom-0 group-data-[position^=bottom]/viewport:origin-bottom",

        // Variables
        "[--gap:0.75rem]",
        "[--height:var(--toast-frontmost-height,var(--toast-height))]",
        "[--peek:0.75rem]",
        "[--scale:calc(max(0,1-(var(--toast-index)*0.1)))]",
        "[--shrink:calc(1-var(--scale))]",

        // Expanded stack offset
        "group-data-[position^=bottom]/viewport:[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",
        "group-data-[position^=top]/viewport:[--offset-y:calc(var(--toast-offset-y)+calc(var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y))]",

        // Height + transition
        "h-(--height)",
        "[transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]",

        // Collapsed stack
        "group-data-[position^=bottom]/viewport:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]",
        "group-data-[position^=top]/viewport:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--peek))+(var(--shrink)*var(--height))))_scale(var(--scale))]",

        // Expanded stack
        "data-expanded:h-(--toast-height)",
        "data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",

        // Gap filler
        "after:absolute after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "group-data-[position^=bottom]/viewport:after:top-full",
        "group-data-[position^=top]/viewport:after:bottom-full",

        // Limited
        "data-limited:opacity-0",

        // Enter animation
        "group-data-[position^=bottom]/viewport:data-starting-style:transform-[translateY(150%)]",
        "group-data-[position^=top]/viewport:data-starting-style:transform-[translateY(-150%)]",

        // Exit animation
        "group-data-[position^=bottom]/viewport:[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(150%)]",
        "group-data-[position^=top]/viewport:[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(-150%)]",

        // Swipe animations
        "data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]",

        // Expanded swipe animations
        "data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]",

        className
      )}
      {...props}
    />
  )
}

// -----------------------------------------------------------------------------
// Content
// -----------------------------------------------------------------------------

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        "flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

// -----------------------------------------------------------------------------
// Action
// -----------------------------------------------------------------------------

function ToastAction({
  className,
  render = <Button variant="outline" size="sm" />,
  ...props
}: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

// -----------------------------------------------------------------------------
// Close
// -----------------------------------------------------------------------------

function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close toast"
      render={render}
      className={cn(
        "relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground",
        className
      )}
      {...props}
    >
      {children ?? <XIcon aria-hidden="true" />}
    </ToastPrimitive.Close>
  )
}

// -----------------------------------------------------------------------------
// Icon
// -----------------------------------------------------------------------------

function ToastIcon({ type }: { type?: ToastType }) {
  let icon: React.ReactNode = null

  if (type === "success") {
    icon = <CircleCheckIcon aria-hidden="true" />
  }

  if (type === "info") {
    icon = <InfoIcon aria-hidden="true" />
  }

  if (type === "warning") {
    icon = <TriangleAlertIcon aria-hidden="true" />
  }

  if (type === "error") {
    icon = <OctagonXIcon className="text-destructive" aria-hidden="true" />
  }

  if (type === "loading") {
    icon = <Loader2Icon className="animate-spin" aria-hidden="true" />
  }

  if (!icon) {
    return null
  }

  return (
    <span
      data-slot="toast-icon"
      className="shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
    >
      {icon}
    </span>
  )
}

// -----------------------------------------------------------------------------
// List
// -----------------------------------------------------------------------------

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()

  return toasts.map((toastItem) => (
    <Toast key={toastItem.id} toast={toastItem}>
      <ToastContent>
        <ToastIcon type={toastItem.type as ToastType | undefined} />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <ToastTitle />
          <ToastDescription />
        </div>

        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ))
}

// -----------------------------------------------------------------------------
// Toaster
// -----------------------------------------------------------------------------

function Toaster({
  children,
  toastManager: manager = toastManager,
  position = "bottom-right",
  ...props
}: ToastPrimitive.Provider.Props & {
  position?: ToastPosition
}) {
  return (
    <ToastProvider toastManager={manager} {...props}>
      {children}

      <ToastPortal>
        <ToastViewport position={position}>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}

const createToastManager = ToastPrimitive.createToastManager
const useToastManager = ToastPrimitive.useToastManager

export {
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  useToastManager,
}

export type { ToastPosition, ToastType }