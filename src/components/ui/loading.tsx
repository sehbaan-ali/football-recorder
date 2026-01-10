import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function Loading({ className, size = "md", text = "Loading" }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      {/* Animated spinner */}
      <div className="relative">
        <div
          className={cn(
            "rounded-full border-2 border-muted-foreground/20 border-t-primary animate-spin",
            sizeClasses[size]
          )}
        />
      </div>

      {/* Loading text with animated dots */}
      {text && (
        <div className={cn("text-muted-foreground font-medium", textSizeClasses[size])}>
          {text}
          <span className="inline-flex ml-1">
            <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Full page loading overlay - use for initial app load
 */
export function LoadingOverlay({ text = "Loading" }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  );
}

/**
 * Inline loading spinner - use inside components
 */
export function LoadingSpinner({ className, size = "sm" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-[3px]",
  };

  return (
    <div
      className={cn(
        "rounded-full border-muted-foreground/20 border-t-primary animate-spin",
        sizeClasses[size],
        className
      )}
    />
  );
}
