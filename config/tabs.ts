"use client";

export const tabConfigs = [
  {
    key: "actions",
    title: "Actions",
    icon: "lucide:command",
    shouldFilter: true,
    visible: () => true,
  },
  {
    key: "orders",
    title: "Orders",
    icon: "lucide:shopping-bag",
    shouldFilter: false,
    visible: (user: unknown) => !!user,
  },
  {
    key: "transactions",
    title: "Transactions",
    icon: "lucide:arrow-left-right",
    shouldFilter: false,
    visible: (user: unknown) => !!user,
  },
];

export const tabs = (user: unknown) =>
  tabConfigs.filter((tab) => tab.visible(user));
