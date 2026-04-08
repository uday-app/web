import {
  Avatar,
  Button,
  Description,
  Drawer,
  Label,
  ListBox,
  useMediaQuery,
} from "@heroui/react";
import { Icon } from "@iconify/react";

const menuItems = [
  {
    description: "Profile, password, and preferences",
    icon: "solar:user-id-linear",
    id: "account-settings",
    label: "Account settings",
  },
  {
    description: "Alerts, mentions, and email updates",
    icon: "solar:bell-linear",
    id: "notifications",
    label: "Notifications",
  },
  {
    description: "Plan, invoices, and payment methods",
    icon: "solar:wallet-money-linear",
    id: "billing",
    label: "Billing",
  },
  {
    description: "Shortcuts, theme, and appearance",
    icon: "solar:widget-5-linear",
    id: "app-preferences",
    label: "App preferences",
  },
  {
    description: "Support docs and contact options",
    icon: "solar:question-circle-linear",
    id: "help-support",
    label: "Help and support",
  },
] as const;

export function UserMenu() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const dialogClassName = isDesktop ? "rounded-l-2xl w-85 p-4" : "";

  return (
    <Drawer>
      <Button isIconOnly size="sm" variant="ghost">
        <Icon icon="duo-icons:user" width={18} height={18} />
      </Button>
      <Drawer.Backdrop>
        <Drawer.Content placement={isDesktop ? "right" : "bottom"}>
          <Drawer.Dialog className={dialogClassName}>
            {!isDesktop && (
              <Drawer.Handle className="absolute inset-x-0 -top-3" />
            )}

            <Drawer.Header>
              <div className="flex items-center gap-3">
                <Avatar size="sm">
                  <Avatar.Image
                    alt="Sarah Johnson"
                    src="https://img.heroui.chat/image/avatar?w=400&h=400&u=1"
                  />
                  <Avatar.Fallback>SJ</Avatar.Fallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">Sarah Johnson</p>
                  <p className="text-xs text-muted">@sarahj</p>
                </div>
              </div>
            </Drawer.Header>
            <Drawer.Body>
              <ListBox
                aria-label="User navigation"
                className="w-full"
                selectionMode="none"
              >
                {menuItems.map((item) => (
                  <ListBox.Item
                    key={item.id}
                    id={item.id}
                    textValue={item.label}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-default">
                      <Icon
                        icon={item.icon}
                        width={18}
                        height={18}
                        className="text-foreground"
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label>{item.label}</Label>
                      <Description>{item.description}</Description>
                    </div>
                    <Icon
                      icon="solar:alt-arrow-right-linear"
                      width={16}
                      height={16}
                      className="ms-auto text-muted"
                    />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Drawer.Body>
            <Drawer.Footer>
              <Button slot="close" variant="danger" fullWidth>
                <Icon icon="solar:logout-2-linear" width={18} height={18} />
                Logout
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
