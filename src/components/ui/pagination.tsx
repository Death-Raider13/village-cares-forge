import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

/**
 * Generates an anchor link styled as a pagination button with active state.
 * @example
 * PaginationLink({className: "custom-class", isActive: true, size: "large", href: "#"})
 * Returns a JSX anchor element with aria-current set to "page" if active.
 * @param {object} PaginationLinkProps - Object containing properties for the pagination link.
 * @param {string} PaginationLinkProps.className - Custom class names for styling the link.
 * @param {boolean} PaginationLinkProps.isActive - Indicates if the link is for the current page.
 * @param {string} [PaginationLinkProps.size="icon"] - Defines the size of the link, defaults to "icon".
 * @returns {JSX.Element} A styled anchor element acting as a pagination link.
 */
const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

/**
 * Renders a pagination link component with a "Previous" button.
 * @example
 * renderPreviousLink({ className: 'custom-class', someProp: value })
 * // Returns a PaginationLink component with customized styles and properties.
 * @param {React.ComponentProps<typeof PaginationLink>} {className, ...props} - Props including optional custom className and other properties for the PaginationLink component.
 * @returns {JSX.Element} Renders a PaginationLink component with customized className and other passed props.
 */
const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

/**
 * Renders a pagination link component with additional props and styles.
 * @example
 * PaginationLinkWithProps({ className: 'custom-class', otherProp: 'value' })
 * Returns a PaginationLink component with customized class and applied props.
 * @param {object} props - Props to be passed to the PaginationLink component.
 * @returns {JSX.Element} JSX element representing a styled PaginationLink component with a "Next" label.
 */
const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

/**
 * Renders a span element with pagination controls. This component is typically used for indicating more pages.
 * @example
 * PaginationComponent({ className: 'custom-class', onClick: handlePagination })
 * <span>...</span>
 * @param {React.ComponentProps<"span">} {className, ...props} - Props that will be spread onto the span element, including custom class names and additional properties.
 * @returns {JSX.Element} A span element containing pagination controls and a visually hidden text for accessibility.
 */
const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
