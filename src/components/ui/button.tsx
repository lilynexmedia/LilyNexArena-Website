import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 gaming-glow shadow-[0_0_20px_rgba(var(--primary),0.3)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground gaming-border",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "relative bg-primary text-primary-foreground font-bold text-base uppercase tracking-wider animate-breathe hover:scale-105 transition-transform duration-300 border border-primary/50 clip-corner gaming-glow shadow-[0_0_30px_rgba(var(--primary),0.5)]",
        heroOutline: "border-2 border-primary bg-transparent text-primary font-bold text-base uppercase tracking-wider animate-breathe hover:bg-primary/10 hover:scale-105 transition-all duration-300 clip-corner",
        neon: "bg-primary/10 border border-primary text-primary hover:bg-primary/20 hover:shadow-[0_0_25px_rgba(var(--primary),0.6)] transition-all duration-300",
        neonPurple: "bg-secondary/10 border border-secondary text-secondary hover:bg-secondary/20 hover:shadow-[0_0_25px_rgba(var(--secondary),0.6)] transition-all duration-300",
        gaming: "bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-white font-bold hover:scale-105 hover:shadow-[0_0_25px_rgba(0,242,254,0.6)] transition-all duration-300 clip-corner backdrop-blur-sm",
        glass: "bg-white/10 backdrop-blur-xl border border-white/10 text-white hover:bg-white/20 hover:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]",
        glassPrimary: "bg-primary/20 backdrop-blur-xl border border-primary/30 text-white hover:bg-primary/30 hover:border-primary/40 shadow-[0_8px_32px_0_rgba(var(--primary),0.1)]",
          iphone: "bg-black/20 backdrop-blur-[40px] border border-white/10 text-white hover:bg-black/40 hover:border-white/20 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-500 hover:scale-105 active:scale-95",
          "iphone-glass": "bg-white/5 backdrop-blur-[40px] border border-white/10 text-white shadow-2xl rounded-full hover:bg-white/15 transition-all duration-500 hover:scale-[1.02]",
          "action-pulse": "bg-primary text-primary-foreground animate-heart-pulse shadow-[0_0_20px_rgba(var(--primary),0.5)] rounded-full font-bold",
          "gaming-premium": "relative overflow-hidden bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 backdrop-blur-xl border border-primary/50 text-white font-bold tracking-widest uppercase hover:from-primary/30 hover:to-primary/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(var(--primary),0.4)] clip-corner",
        },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6",
        icon: "h-9 w-9",
        xl: "h-11 md:h-12 px-6 md:px-8 py-3 text-sm md:text-base rounded-lg",
        pill: "h-9 px-5 rounded-full text-sm",
        "iphone-sm": "h-8 px-3 rounded-full text-[10px] uppercase tracking-wider font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
