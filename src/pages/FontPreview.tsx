const sampleTitle = "The Kid Who Asked Why";
const sampleBody =
  "I didn't just play DOS games — I interrogated them. Every pixel, every sound, every menu screen made me ask the same restless question: how did someone make this? That curiosity never faded — it became the engine behind everything I build today.";

const options = [
  {
    name: "Option A — Clean Sans-Serif",
    fonts: "Source Sans 3 + Cinzel headings",
    bodyClass: "font-sans-preview-a",
    css: `'Source Sans 3', sans-serif`,
  },
  {
    name: "Option B — Humanist Sans-Serif",
    fonts: "DM Sans + Cinzel headings",
    bodyClass: "font-sans-preview-b",
    css: `'DM Sans', sans-serif`,
  },
  {
    name: "Option C — Elegant Readable Serif",
    fonts: "Lora + Cinzel headings",
    bodyClass: "font-serif-preview-c",
    css: `'Lora', serif`,
  },
  {
    name: "Option D — Current (Crimson Text)",
    fonts: "Crimson Text + Cinzel headings",
    bodyClass: "font-body",
    css: `'Crimson Text', serif`,
  },
];

const FontPreview = () => (
  <div className="min-h-screen bg-background text-foreground p-6 md:p-12 overflow-auto">
    <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 text-center">
      Font Comparison
    </h1>
    <p className="text-center text-muted-foreground text-sm mb-10">
      Same content, four different body fonts. Pick the one that reads best!
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {options.map((opt) => (
        <div
          key={opt.name}
          className="rounded-xl border border-border p-6"
          style={{ background: "hsl(var(--card))" }}
        >
          {/* Label */}
          <div className="mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-primary">
              {opt.name}
            </span>
            <p className="text-[11px] text-muted-foreground mt-0.5">{opt.fonts}</p>
          </div>

          {/* Title preview */}
          <h2 className="font-display text-xl font-semibold mb-3">{sampleTitle}</h2>

          {/* Body preview with the actual font */}
          <p
            className="leading-relaxed text-[15px]"
            style={{ fontFamily: opt.css, color: "hsl(var(--foreground))" }}
          >
            {sampleBody}
          </p>

          {/* Small text preview */}
          <p
            className="mt-4 text-xs leading-relaxed"
            style={{ fontFamily: opt.css, color: "hsl(var(--muted-foreground))" }}
          >
            Skills: Curiosity · Problem Solving · Cloud Architecture · Strategic Thinking
          </p>
        </div>
      ))}
    </div>

    <p className="text-center text-muted-foreground text-xs mt-10">
      Go back to the main page when you've decided — just let me know which option (A/B/C/D) you prefer!
    </p>
  </div>
);

export default FontPreview;
