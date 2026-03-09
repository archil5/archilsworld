import { useMemo } from "react";

// 5 stops: bright parchment → deep dark
const THEME_STOPS = [
  {
    bg: "#f5f0e8",
    bgRgb: [245, 240, 232],
    surface: "rgba(245,240,232,0.97)",
    surfaceRgb: [245, 240, 232],
    text: "#2d2a26",
    textRgb: [45, 42, 38],
    textMuted: "#6b6560",
    textMutedRgb: [107, 101, 96],
    textFaint: "rgba(107,101,96,0.4)",
    uiBg: "rgba(245,240,232,0.9)",
    uiBorder: "rgba(180,140,100,0.25)",
    uiShadow: "rgba(0,0,0,0.08)",
    fog: "#f5f0e8",
    ground: "#f0ebe3",
    hexGrid: "#e8e0d4",
    particle: "#c8956c",
    particleOpacity: 0.35,
    ambientIntensity: 0.6,
    directionalIntensity: 1.2,
  },
  {
    bg: "#e8e0d4",
    bgRgb: [232, 224, 212],
    surface: "rgba(232,224,212,0.97)",
    surfaceRgb: [232, 224, 212],
    text: "#2d2a26",
    textRgb: [45, 42, 38],
    textMuted: "#5e5850",
    textMutedRgb: [94, 88, 80],
    textFaint: "rgba(94,88,80,0.4)",
    uiBg: "rgba(232,224,212,0.9)",
    uiBorder: "rgba(160,120,80,0.25)",
    uiShadow: "rgba(0,0,0,0.1)",
    fog: "#e8e0d4",
    ground: "#e0d8cc",
    hexGrid: "#d6cec0",
    particle: "#b5885a",
    particleOpacity: 0.3,
    ambientIntensity: 0.5,
    directionalIntensity: 1.0,
  },
  {
    bg: "#a09080",
    bgRgb: [160, 144, 128],
    surface: "rgba(130,118,105,0.97)",
    surfaceRgb: [130, 118, 105],
    text: "#f0ebe3",
    textRgb: [240, 235, 227],
    textMuted: "#d4ccc0",
    textMutedRgb: [212, 204, 192],
    textFaint: "rgba(212,204,192,0.4)",
    uiBg: "rgba(90,80,70,0.85)",
    uiBorder: "rgba(180,140,100,0.3)",
    uiShadow: "rgba(0,0,0,0.2)",
    fog: "#a09080",
    ground: "#8a7e72",
    hexGrid: "#7a6e62",
    particle: "#c8956c",
    particleOpacity: 0.25,
    ambientIntensity: 0.4,
    directionalIntensity: 0.8,
  },
  {
    bg: "#3a342e",
    bgRgb: [58, 52, 46],
    surface: "rgba(50,44,38,0.97)",
    surfaceRgb: [50, 44, 38],
    text: "#f0ebe3",
    textRgb: [240, 235, 227],
    textMuted: "#b5a898",
    textMutedRgb: [181, 168, 152],
    textFaint: "rgba(181,168,152,0.35)",
    uiBg: "rgba(50,44,38,0.9)",
    uiBorder: "rgba(181,101,58,0.3)",
    uiShadow: "rgba(0,0,0,0.3)",
    fog: "#3a342e",
    ground: "#32302c",
    hexGrid: "#4a4238",
    particle: "#d4a574",
    particleOpacity: 0.2,
    ambientIntensity: 0.3,
    directionalIntensity: 0.6,
  },
  {
    bg: "#1a1816",
    bgRgb: [26, 24, 22],
    surface: "rgba(26,24,22,0.97)",
    surfaceRgb: [26, 24, 22],
    text: "#f5f0e8",
    textRgb: [245, 240, 232],
    textMuted: "#a89880",
    textMutedRgb: [168, 152, 128],
    textFaint: "rgba(168,152,128,0.3)",
    uiBg: "rgba(26,24,22,0.9)",
    uiBorder: "rgba(181,101,58,0.35)",
    uiShadow: "rgba(0,0,0,0.4)",
    fog: "#1a1816",
    ground: "#22201e",
    hexGrid: "#302c28",
    particle: "#d4a574",
    particleOpacity: 0.15,
    ambientIntensity: 0.2,
    directionalIntensity: 0.4,
  },
];

function lerpColor(a: number[], b: number[], t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export type ProgressiveTheme = ReturnType<typeof computeTheme>;

function computeTheme(index: number, total: number) {
  // Map index 0..(total-1) to 0..4 (our 5 stops)
  const normalized = (index / (total - 1)) * (THEME_STOPS.length - 1);
  const lower = Math.floor(normalized);
  const upper = Math.min(lower + 1, THEME_STOPS.length - 1);
  const t = normalized - lower;
  const a = THEME_STOPS[lower];
  const b = THEME_STOPS[upper];

  return {
    bg: lerpColor(a.bgRgb, b.bgRgb, t),
    surface: lerpColor(a.surfaceRgb, b.surfaceRgb, t),
    surfaceAlpha: `rgba(${Math.round(lerp(a.surfaceRgb[0], b.surfaceRgb[0], t))},${Math.round(lerp(a.surfaceRgb[1], b.surfaceRgb[1], t))},${Math.round(lerp(a.surfaceRgb[2], b.surfaceRgb[2], t))},0.97)`,
    text: lerpColor(a.textRgb, b.textRgb, t),
    textMuted: lerpColor(a.textMutedRgb, b.textMutedRgb, t),
    textFaint: t < 0.5 ? a.textFaint : b.textFaint,
    uiBg: t < 0.5 ? a.uiBg : b.uiBg,
    uiBorder: t < 0.5 ? a.uiBorder : b.uiBorder,
    uiShadow: t < 0.5 ? a.uiShadow : b.uiShadow,
    fog: lerpColor(a.bgRgb, b.bgRgb, t),
    ground: lerpColor(
      hexToRgb(a.ground),
      hexToRgb(b.ground),
      t
    ),
    hexGrid: lerpColor(
      hexToRgb(a.hexGrid),
      hexToRgb(b.hexGrid),
      t
    ),
    particle: t < 0.5 ? a.particle : b.particle,
    particleOpacity: lerp(a.particleOpacity, b.particleOpacity, t),
    ambientIntensity: lerp(a.ambientIntensity, b.ambientIntensity, t),
    directionalIntensity: lerp(a.directionalIntensity, b.directionalIntensity, t),
    isDark: normalized > 1.5,
  };
}

function hexToRgb(hex: string): number[] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

export function useProgressiveTheme(activeIndex: number, totalChapters: number) {
  return useMemo(() => computeTheme(activeIndex, totalChapters), [activeIndex, totalChapters]);
}
