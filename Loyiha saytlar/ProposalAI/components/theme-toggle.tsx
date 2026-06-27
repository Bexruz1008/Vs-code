"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = (window.localStorage.getItem("proposalai-theme") as "dark" | "light" | null) ?? "dark";
    setTheme(saved);
    document.documentElement.dataset.theme = saved;
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("proposalai-theme", next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm font-medium",
        "bg-white/5 text-slate-100 transition hover:border-white/20 hover:bg-white/10",
        "dark:bg-white/5"
      )}
    >
      <span className="text-base">{theme === "dark" ? "◐" : "◑"}</span>
      <span>{theme === "dark" ? "Dark" : "Light"} mode</span>
    </button>
  );
}
