import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white shadow-md hover:shadow-xl hover:-translate-y-0.5',
        secondary: 'bg-white border-2 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white',
        ghost: 'bg-transparent text-[#6B7280] hover:bg-[#F3F4F6]',
        icon: 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#8B5CF6] hover:text-white rounded-full',
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        small: "px-4 py-2 text-sm rounded-md",
        medium: "px-6 py-3 text-base rounded-lg",
        large: "px-8 py-4 text-lg rounded-xl",
      },
    },
    compoundVariants: [
      {
        variant: "icon",
        size: "small",
        class: "w-8 h-8 p-0",
      },
      {
        variant: "icon",
        size: "medium",
        class: "w-10 h-10 p-0",
      },
      {
        variant: "icon",
        size: "large",
        class: "w-12 h-12 p-0",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, icon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      )
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={props.disabled || loading}
        {...props}
      >
        {loading ? (
           <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {!loading && icon && <span className={children ? "mr-2" : ""}>{icon}</span>}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }



