"use client";

import { cn } from "@heroui/react";
import { Icon } from "@iconify/react";

type LoginTitleProps = {
  title?: string;
  description?: string;
  icon?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function LoginTitle({
  title,
  description,
  icon,
  className,
  titleClassName,
  descriptionClassName,
}: LoginTitleProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h1
        className={cn(
          "flex items-center gap-1.5 text-xl font-bold text-foreground",
          titleClassName,
        )}
      >
        {icon ? (
          <span className="shrink-0">
            <Icon aria-hidden className="size-6" icon={icon} />
          </span>
        ) : null}
        <span>{title}</span>
      </h1>
      {description ? (
        <p className={cn("text-xs text-muted", descriptionClassName)}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
