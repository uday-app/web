import { cn } from "@heroui/react";
import { Command } from "cmdk";

export function Orders() {
  return (
    <>
      <OrderItem value="order1">Order #12345</OrderItem>
      <OrderItem value="order2">Order #67890</OrderItem>
      <OrderItem value="order3">Order #54321</OrderItem>
    </>
  );
}

type CommandItemProps = React.ComponentPropsWithoutRef<typeof Command.Item>;

const OrderItem = ({ className, ...props }: CommandItemProps) => {
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
    />
  );
};
