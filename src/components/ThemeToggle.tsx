
import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") setTheme("night");
    else if (theme === "night") setTheme("fun");
    else setTheme("light");
  };

  const getButtonStyles = () => {
    switch (theme) {
      case "night":
        return "bg-gray-800 text-blue-400";
      case "fun":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-colors ${getButtonStyles()} ${className}`}
      aria-label="Toggle theme"
    >
      {theme === "light" && <Moon size={20} />}
      {theme === "night" && <Sparkles size={20} />}
      {theme === "fun" && <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;
