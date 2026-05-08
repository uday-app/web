"use client";

import type { IconProps } from "@iconify/react";

import { cn, Skeleton } from "@heroui/react";
import { Icon as IconifyIcon, loadIcon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";

type Props = Omit<IconProps, "icon"> & {
  icon: string;
  base?: string;
  fallback?: React.ReactNode | null;
  ssr?: boolean;
};

function Icon({
  icon,
  className,
  fallback,
  ssr = true,
  base,
  width = "1em",
  height = "1em",
  ...props
}: Props): React.ReactNode {
  const [loadedIcon, setLoadedIcon] = useState<string | null>(
    ssr ? icon : null,
  );
  const loaded = ssr || loadedIcon === icon;

  const sizeStyle = useMemo(
    () => ({
      width,
      height,
      minWidth: width,
      minHeight: height,
    }),
    [width, height],
  );

  useEffect(() => {
    if (ssr) {
      return;
    }

    let mounted = true;

    loadIcon(icon)
      .then(() => {
        if (mounted) setLoadedIcon(icon);
      })
      .catch(() => {
        if (mounted) setLoadedIcon(icon);
      });

    return () => {
      mounted = false;
    };
  }, [icon, ssr]);

  if (!loaded) {
    return (
      <span
        className={cn("flex shrink-0 items-center justify-center", base)}
        style={sizeStyle}
      >
        {fallback ?? (
          <Skeleton className={cn("size-full rounded-sm", className)} />
        )}
      </span>
    );
  }

  return (
    <span
      className={cn("flex shrink-0 items-center justify-center", base)}
      style={sizeStyle}
    >
      <IconifyIcon
        {...props}
        className={className}
        height={height}
        icon={icon}
        width={width}
      />
    </span>
  );
}

Icon.displayName = "Icon";

export default Icon;
