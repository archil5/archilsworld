import { useRef, useState, useEffect } from "react";
import ChapterNav from "@/components/ChapterNav";
import PrologueChapter from "@/components/chapters/PrologueChapter";
import OriginChapter from "@/components/chapters/OriginChapter";
import UniversityChapter from "@/components/chapters/UniversityChapter";
import CareerChapter from "@/components/chapters/CareerChapter";
import NowChapter from "@/components/chapters/NowChapter";

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll<HTMLElement>("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(sections).indexOf(entry.target as HTMLElement);
            if (index >= 0) setActiveChapter(index);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleNavigate = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const sections = container.querySelectorAll("section");
    sections[index]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="scroll-container" ref={containerRef}>
      <ChapterNav activeChapter={activeChapter} onNavigate={handleNavigate} />
      <PrologueChapter />
      <OriginChapter />
      <UniversityChapter />
      <CareerChapter />
      <NowChapter />
    </div>
  );
};

export default Index;
