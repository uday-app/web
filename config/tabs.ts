"use client";
import { IconMoneyBill, IconNut, IconShopping } from "nucleo-glass";

export const tabConfigs = [
  {
    key: "actions",
    title: "Actions",
    icon: IconNut,
    shouldFilter: true,
    visible: () => true,
  },
  {
    key: "orders",
    title: "Orders",
    icon: IconShopping,
    shouldFilter: false,
    visible: (user: unknown) => !!user,
  },
  {
    key: "transactions",
    title: "Transactions",
    icon: IconMoneyBill,
    shouldFilter: false,
    visible: (user: unknown) => !!user,
  },
];

export const tabs = (user: unknown) =>
  tabConfigs.filter((tab) => tab.visible(user));
