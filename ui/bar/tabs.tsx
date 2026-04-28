import { tabs } from "@/config/tabs";
import { useSearchStore } from "@/store/search";
import { Tabs } from "@heroui/react";
import { Icon } from "@iconify/react";

export function CommandTabs() {
  const { tab, setTab } = useSearchStore();

  return (
    <Tabs
      className="w-full"
      onSelectionChange={(key) => setTab(String(key) as string)}
      selectedKey={tab}
    >
      <Tabs.ListContainer>
        <Tabs.List
          aria-label="Command sections"
          className="bg-field shadow-field rounded-field border-field-border overflow-x-auto scroll-shadow--hide-scrollbar"
        >
          {tabs("user").map((tab) => (
            <Tabs.Tab key={tab.key} id={tab.key} className="text-nowrap gap-2">
              <Icon icon={tab.icon} width={16} height={16} /> {tab.title}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
}
