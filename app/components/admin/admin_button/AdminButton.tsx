import type { ButtonHTMLAttributes } from "react";
import styles from "./AdminButton.module.scss";

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // "primary" for the main action of a screen, "secondary" for the rest, "small" for row controls.
  variant?: "primary" | "secondary" | "small";
}

// The button used across the admin panel.
export default function AdminButton({
  variant = "secondary",
  className,
  type = "button",
  ...props
}: AdminButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[`button_${variant}`]} ${className ?? ""}`}
      {...props}
    />
  );
}
