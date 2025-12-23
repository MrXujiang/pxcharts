"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & { orientation?: "vertical" | "horizontal" | "both" }
>(({ className, children, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
    style={{ display: "flex", flexDirection: "column", height: "100%", ...props.style }}
  >
    <ScrollAreaPrimitive.Viewport
      className="h-full w-full rounded-[inherit]"
      style={{ position: "relative", height: "100%" }}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    {orientation === "vertical" || orientation === "both" ? (
      <ScrollAreaPrimitive.Scrollbar
        className="flex touch-none select-none transition-colors h-full w-2.5 border-l border-l-transparent p-[1px] data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="vertical"
      >
        <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-gray-300 hover:bg-gray-400" />
      </ScrollAreaPrimitive.Scrollbar>
    ) : null}
    {orientation === "horizontal" || orientation === "both" ? (
      <ScrollAreaPrimitive.Scrollbar
        className="flex touch-none select-none transition-colors h-2.5 flex-col border-t border-t-transparent p-[1px] data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="horizontal"
      >
        <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-gray-300 hover:bg-gray-400" />
      </ScrollAreaPrimitive.Scrollbar>
    ) : null}
    <ScrollAreaPrimitive.Corner className="bg-gray-200" />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

export { ScrollArea }
