import { useEffect, useState } from "react";

/** Tracks which section id is closest to the top third of the viewport. */
export function useActiveSection(ids: string[]) {
  // Nothing is current until a section is actually in view — the hero is not
  // a nav target, so seeding with the first id marked Work as current while the
  // visitor was still above it.
  const [active, setActive] = useState("");

  useEffect(() => {
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
