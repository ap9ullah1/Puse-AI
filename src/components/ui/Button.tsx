import type { ButtonHTMLAttributes } from "react";
import { buttonVariants, type ButtonSize, type ButtonVariant } from "./button-variants";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return <button className={`${buttonVariants(variant, size)} ${className}`} {...props} />;
}
