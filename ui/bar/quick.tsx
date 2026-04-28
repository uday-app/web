'use client'

import { useSearchStore } from "@/store/search";
import { Navigations } from "@/types/navigation";
import { cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export function QuickActions({
  command,
}: {
  command?: Record<string, Navigations> | null;
}) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const { onSelect, page, query } = useSearchStore();
  const sections = command ?? actions;
  const activeSections = getActiveSections(sections, page, query);

  return (
    <>
      {Object.entries(activeSections).map(([groupName, group]) => (
        <Command.Group key={groupName} heading={groupName}>
          {group.map((action) => (
            <CommandItem
              key={action.id}
              keywords={action.keywords}
              onSelect={() => onSelect(action, router, setTheme)}
              value={action.title}
            >
              <Icon icon={action.icon} width={18} />
              <span>{action.title}</span>
            </CommandItem>
          ))}
        </Command.Group>
      ))}
    </>
  );
}

type CommandItemProps = React.ComponentPropsWithoutRef<typeof Command.Item>;

const CommandItem = ({ children, className, ...props }: CommandItemProps) => {
  return (
    <Command.Item
      data-slot="command-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-field px-2 py-2 text-sm outline-none",
        "transition-[background-color,color,transform] duration-150 ease-out",
        "data-[disabled=true]:opacity-50",
        "data-[selected=true]:bg-default/20 data-[selected=true]:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </Command.Item>
  );
};

CommandItem.displayName = Command.Item.displayName;

function getActiveSections(
  sections: Record<string, Navigations>,
  page: string | null,
  query: string,
): Record<string, Navigations> {
  if (!page && query.trim()) {
    return Object.fromEntries(
      Object.entries(sections).map(([groupName, group]) => {
        const expanded = group.flatMap((item) => {
          if (item.children?.length) {
            return [item, ...item.children];
          }
          return [item];
        });

        return [groupName, expanded];
      }),
    );
  }

  if (!page) {
    return sections;
  }

  for (const [groupName, group] of Object.entries(sections)) {
    const parent = group.find((item) => {
      const sectionId =
        item.action?.type === "section" ? item.action.value : item.id;
      return sectionId === page && item.children?.length;
    });

    if (parent?.children?.length) {
      return {
        [parent.title]: parent.children,
      };
    }

    const matchingChild = group.filter(
      (item) => item.id === page || item.action?.value === page,
    );
    if (matchingChild.length > 0) {
      return {
        [groupName]: matchingChild,
      };
    }
  }

  return sections;
}

const actions: Record<string, Navigations> = {
  General: [
    {
      id: "home",
      title: "Return to Home",
      icon: "simple-icons:ghostery",
      href: "/",
      keywords: ["home", "go back", "main", "start", "homepage"],
    },
    {
      id: "theme",
      title: "Change Theme . . .",
      icon: "fa7-solid:brush",
      action: { type: "section", value: "theme" },
      keywords: ["theme", "appearance", "light", "dark", "mode", "color"],
      children: [
        {
          id: "light",
          title: "Change Theme to Light",
          icon: "line-md:moon-to-sunny-outline-loop-transition",
          action: { type: "theme", value: "light" },
          keywords: ["light", "bright", "day", "theme", "mode"],
          shortcut: ["⌘", "L"],
        },
        {
          id: "system",
          title: "Change Theme to System",
          icon: "line-md:computer",
          action: { type: "theme", value: "system" },
          keywords: ["system", "auto", "follow", "device", "theme"],
          shortcut: ["⌘", "S"],
        },
        {
          id: "dark",
          title: "Change Theme to Dark",
          icon: "line-md:sunny-outline-to-moon-alt-loop-transition",
          action: { type: "theme", value: "dark" },
          keywords: ["dark", "night", "theme", "mode", "black"],
          shortcut: ["⌘", "D"],
        },
      ],
    },
  ],
  Support: [
    // {
    //     id: 'docs',
    //     title: 'Docs',
    //     status: '(Beta)',
    //     icon: 'hugeicons:book-open-01',
    //     href: 'https://docs.fixitrock.com',
    //     keywords: ['docs', 'documentation', 'guide', 'manual', 'help center'],
    // },
    {
      id: "support",
      title: "Contact Support",
      icon: "bx:support",
      href: "https://wa.me/919927241144",
      keywords: ["support", "help", "contact", "whatsapp", "customer"],
    },
  ],
};
