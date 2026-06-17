import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric/60 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "gradient-primary text-white shadow-lg shadow-blue/20 hover:shadow-blue/40 hover:brightness-110",
        secondary:
          "bg-card text-text border border-line hover:border-electric/50 hover:bg-panel",
        ghost: "text-text-secondary hover:bg-panel hover:text-text",
        outline:
          "border border-line bg-transparent text-text hover:border-electric/50 hover:bg-panel",
        danger:
          "bg-red/15 text-red border border-red/30 hover:bg-red/25",
        success:
          "bg-green/15 text-green border border-green/30 hover:bg-green/25",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    href?: string;
  };

export function Button({
  className,
  variant,
  size,
  href,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {props.children}
      </Link>
    );
  }
  return <button className={classes} {...props} />;
}

export { buttonVariants };
