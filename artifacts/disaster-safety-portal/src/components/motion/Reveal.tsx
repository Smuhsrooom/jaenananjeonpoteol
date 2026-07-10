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
  /** delay in ms */
  delay?: number;
  /** skip observer — always show as visible */
  immediate?: boolean;
  as?: ElementType;
};

type Props<T extends ElementType> = OwnProps &
  Omit<ComponentPropsWithoutRef<T>, keyof OwnProps>;

export default function Reveal<T extends ElementType = "div">({
  children,
  className,
  delay = 0,
  immediate = false,
  as,
  ...rest
}: Props<T>) {
  const Tag = (as || "div") as ElementType;
  const { ref, inView } = useInView();
  const visible = immediate || inView;

  return (
    <Tag
      ref={ref}
      className={cn("reveal", visible && "reveal--visible", className)}
      style={
        delay
          ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
          : undefined
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}
