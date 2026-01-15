import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-xl border transition-all duration-500",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground shadow-sm border-border",
        glass: "bg-black/20 backdrop-blur-2xl border-white/10 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] hover:bg-black/30 hover:border-white/20",
        gaming: "bg-black/40 backdrop-blur-2xl border-primary/20 text-white shadow-[0_0_20px_rgba(var(--primary),0.1)] hover:border-primary/40 hover:shadow-[0_0_30px_rgba(var(--primary),0.2)]",
        neon: "bg-black/80 backdrop-blur-md border-primary text-white shadow-[0_0_15px_rgba(var(--primary),0.3)]",
          iphone: "bg-white/5 backdrop-blur-[40px] border-white/10 text-white shadow-2xl rounded-[2rem] hover:bg-white/10 transition-all duration-500",
          "iphone-dark": "bg-black/40 backdrop-blur-[40px] border-white/5 text-white shadow-2xl rounded-[2.5rem] hover:border-white/10 transition-all duration-500",
          "glass-premium": "bg-black/20 backdrop-blur-[40px] border border-white/10 text-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-[2.5rem] hover:bg-black/30 hover:border-white/20 transition-all duration-700",
        },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight font-display", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground font-body", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
