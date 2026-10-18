import { type ReactNode, useEffect, useRef, useState } from "react";

export default function ScrollRegion({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className: string;
  label: string;
}) {
  const region = useRef<HTMLElement>(null);
  const [tabIndex, setTabIndex] = useState<number>();

  useEffect(() => {
    const element = region.current;
    if (!element) return;
    const measure = () => {
      setTabIndex(element.scrollWidth > element.clientWidth ? 0 : undefined);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={region}
      className={className}
      aria-label={label}
      tabIndex={tabIndex}
    >
      {children}
    </section>
  );
}
