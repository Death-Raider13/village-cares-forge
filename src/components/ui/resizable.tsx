import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

/**
 * Renders a ResizablePrimitive.PanelGroup component with specified className and props.
 * @example
 * renderResizablePanelGroup({ className: "custom-class", ...props })
 * ResizablePrimitive.PanelGroup component will be returned with applied className and props.
 * @param {React.ComponentProps<typeof ResizablePrimitive.PanelGroup>} {className, ...props} - Props containing className and additional properties for PanelGroup component.
 * @returns {JSX.Element} A JSX element representing the ResizablePrimitive.PanelGroup component.
 */
const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

/**
 * Renders a resizable panel handle, optionally with a grip component, applying styles and properties for customization.
 * @example
 * renderResizableHandle({ withHandle: true, className: "custom-class" })
 * // Returns JSX of a styled resizable handle component
 * @param {React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & { withHandle?: boolean }} props - The properties for the resizable component, including optional handle rendering and custom class styling.
 * @returns {JSX.Element} A JSX element representing the resizable panel's handle, with optional grip component.
 */
const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
