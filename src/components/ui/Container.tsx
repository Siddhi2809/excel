import React from "react";

// Simple layout wrapper that provides a max-width container with responsive horizontal padding
// and vertical spacing. Uses Tailwind utility classes that map to the project's
// custom theme variables (spacing, radius, colours).
export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 ${className}`}
    >
      {children}
    </div>
  );
}
