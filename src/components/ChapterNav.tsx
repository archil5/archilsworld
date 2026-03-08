const chapters = [
  { id: "prologue", label: "Prologue" },
  { id: "origin", label: "The Origin" },
  { id: "university", label: "The Academy" },
  { id: "career", label: "The Journey" },
  { id: "now", label: "The Frontier" },
];

interface ChapterNavProps {
  activeChapter: number;
  onNavigate: (index: number) => void;
}

const ChapterNav = ({ activeChapter, onNavigate }: ChapterNavProps) => {
  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4">
      {chapters.map((ch, i) => (
        <button
          key={ch.id}
          onClick={() => onNavigate(i)}
          className="group relative flex items-center"
          aria-label={`Go to ${ch.label}`}
        >
          <span
            className={`nav-pip ${i === activeChapter ? "active" : ""}`}
          />
          <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-display text-wood-light bg-parchment/90 px-3 py-1 rounded shadow-md border border-border/50 pointer-events-none">
            {ch.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default ChapterNav;
