import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition duration-300",
        variant === "primary" && "brand-gradient text-white shadow-lg shadow-[#6e63b8]/25 hover:-translate-y-0.5",
        variant === "secondary" && "border border-[#4b328b]/15 bg-white text-[#4b328b] hover:border-[#5faedb] hover:text-[#21183d]",
        variant === "ghost" && "text-[#4b328b] hover:bg-[#5faedb]/10",
        className
      )}
      {...props}
    />
  );
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function ButtonLink({ className, variant = "primary", ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition duration-300",
        variant === "primary" && "brand-gradient text-white shadow-lg shadow-[#6e63b8]/25 hover:-translate-y-0.5",
        variant === "secondary" && "border border-[#4b328b]/15 bg-white text-[#4b328b] hover:border-[#5faedb] hover:text-[#21183d]",
        variant === "ghost" && "text-[#4b328b] hover:bg-[#5faedb]/10",
        className
      )}
      {...props}
    />
  );
}
