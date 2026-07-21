"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  publication?: string;
  position: string;
};

export function TrackedLink({ children, publication = "madabase", position, onClick, ...props }: Props) {
  return (
    <a
      {...props}
      onClick={(event) => {
        window.clarity?.("set", "hub_publication", publication);
        window.clarity?.("set", "hub_position", position);
        window.clarity?.("event", "publication_click");
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
