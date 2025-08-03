import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * Renders a customized toaster component with theme-driven styles and props.
 * @example
 * const props = { theme: "light", position: "bottom-right" };
 * renderToasterComponent(props)
 * // Renders a customized Sonner toaster with specified props and theme.
 * @param {ToasterProps} props - Configuration options for the toaster, including appearance and position.
 * @returns {ReactElement} A Sonner toaster component with customized styling and functionality based on provided props.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
