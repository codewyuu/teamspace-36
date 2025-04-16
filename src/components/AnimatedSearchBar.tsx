
import { useState, useRef, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedSearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const AnimatedSearchBar = ({
  placeholder = "Search...",
  value,
  onChange,
  className,
}: AnimatedSearchBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Only collapse if clicking outside the container and the input is empty
    if (!containerRef.current?.contains(e.relatedTarget as Node) && !value) {
      setIsExpanded(false);
    }
  };

  // Focus the input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative group",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center rounded-full border border-gray-800 transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded 
            ? "w-64 pl-4 pr-2 py-2 bg-black/80" 
            : "w-10 h-10 bg-transparent cursor-pointer hover:bg-black/30"
        )}
        onClick={() => !isExpanded && setIsExpanded(true)}
        onMouseEnter={() => !isExpanded && setIsExpanded(true)}
      >
        <SearchIcon
          className={cn(
            "text-muted-foreground transition-all duration-200",
            isExpanded ? "h-4 w-4 mr-2" : "h-5 w-5 mx-auto"
          )}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "bg-transparent border-none outline-none text-sm text-foreground w-full",
            isExpanded ? "opacity-100" : "opacity-0 w-0"
          )}
        />
      </div>
    </div>
  );
};

export default AnimatedSearchBar;
