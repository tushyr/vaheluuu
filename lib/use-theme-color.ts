"use client";

import { useEffect } from "react";

export function useThemeColor(color: string) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const prevBodyBg = document.body.style.backgroundColor;
    const prevHtmlBg = document.documentElement.style.backgroundColor;

    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    const prevMeta = meta.getAttribute("content");

    document.documentElement.style.backgroundColor = color;
    document.body.style.backgroundColor = color;
    meta.setAttribute("content", color);

    return () => {
      document.documentElement.style.backgroundColor = prevHtmlBg || "#0E0B09";
      document.body.style.backgroundColor = prevBodyBg || "#0E0B09";
      if (prevMeta) {
        meta.setAttribute("content", prevMeta);
      }
    };
  }, [color]);
}
