import type {
  ReactNode,
  ElementType,
  ComponentPropsWithoutRef,
  CSSProperties,
} from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

type OwnProps = {
  children: ReactNode;
  className?: string;
  /** base delay before first child (ms) */
  delay?: number;
  /** gap between children (ms) */
  step?: number;
  as?: ElementType;
};

type Props<T extends ElementType> = OwnProps &
  Omit<ComponentPropsWithoutRef<T>, keyof OwnProps>;

/** Children reveal in sequence when the container enters the viewport. */
export default function Stagger<T extends ElementType = "div">({
  children,
  className,
  delay = 0,
  step = 55,
  as,
  ...rest
}: Props<T>) {
  const Tag = (as || "div") as ElementType;
  const { ref, inView } = useInView();

  return (
    <Tag
      ref={ref}
      className={cn("stagger", inView && "stagger--visible", className)}
      style={
        {
          "--stagger-delay": `${delay}ms`,
          "--stagger-step": `${step}ms`,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}
