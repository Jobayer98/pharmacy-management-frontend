"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { RenderIcon } from "./icons";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const current = resolvedTheme ?? theme;

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
    >
      {current === "dark" ? (
        <RenderIcon name="Sun" />
      ) : (
        <RenderIcon name="Moon" />
      )}
    </button>
  );
};
