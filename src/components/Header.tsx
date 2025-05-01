import { cn } from "@/lib/utils";
import Logo from "./Logo";

type HeaderProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function Header({ children, className }: HeaderProps) {
  return (
    <div className={cn("header", className)}>
      <div className="md:flex-1">
        <Logo />
      </div>
      {children}
    </div>
  );
}
