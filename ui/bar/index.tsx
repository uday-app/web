"use client";

import {
  Drawer,
  Modal,
  SearchField,
  useMediaQuery,
  useOverlayState,
} from "@heroui/react";
import type { ReactNode } from "react";
import { UserMenu } from "./login";

type ModalDrawerProps = {
  state: ReturnType<typeof useOverlayState>;
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
};

export function SearchBar() {
  return (
    <SearchField
      className="fixed bottom-4 left-1/2 z-50 w-[95%] -translate-x-1/2 md:w-160"
      aria-label="Search"
      fullWidth
    >
      <SearchField.Group className="px-1">
        <SearchField.SearchIcon />
        <SearchField.Input autoFocus={false} placeholder="What do you need ?" />
        <SearchField.ClearButton />
        <UserMenu />
      </SearchField.Group>
    </SearchField>
  );
}

// export function SearchBar() {
//     const [search, setSearch] = useState('')
//     const state = useOverlayState()

//     return (
//          <Command label="Global search">
//             {!state.isOpen && (
//                   <SearchField
//                         className="fixed bottom-4 left-1/2 z-50 w-[95%] -translate-x-1/2 md:w-160"
//                         aria-label="Search"
//                         fullWidth
//                         value={search}
//                         onChange={setSearch}
//                         onClick={state.open}
//                     >
//                         <SearchField.Group className="px-1">
//                             <SearchField.SearchIcon />
//                             <Command.Input
//                                 asChild
//                                 value={search}
//                                 onValueChange={(value) => {
//                                     setSearch(value)
//                                     state.open()
//                                 }}
//                             >
//                                 <SearchField.Input placeholder="Search commands..." />
//                             </Command.Input>
//                             <SearchField.ClearButton />
//                             <Button
//                                 isIconOnly
//                                 size="sm"
//                                 variant="ghost"
//                                 onPress={state.open}
//                             >
//                                 <Icon icon="duo-icons:user" width={18} height={18} />
//                             </Button>
//                         </SearchField.Group>
//                     </SearchField>
//                     )}

//                 <ModalDrawer
//                     header={ <SearchField
//                     aria-label="Search"
//                     fullWidth
//                     value={search}
//                     onChange={setSearch}
//                     onClick={state.open}
//                 >
//                     <SearchField.Group className="px-1">
//                         <SearchField.SearchIcon />
//                         <Command.Input
//                             asChild
//                             value={search}
//                             onValueChange={(value) => {
//                                 setSearch(value)
//                                 state.open()
//                             }}
//                         >
//                             <SearchField.Input placeholder="Search commands..." />
//                         </Command.Input>
//                         <SearchField.ClearButton />
//                         <Button
//                             isIconOnly
//                             size="sm"
//                             variant="ghost"
//                             onPress={state.open}
//                         >
//                             <Icon icon="duo-icons:user" width={18} height={18} />
//                         </Button>
//                     </SearchField.Group>
//                 </SearchField>}
//                     state={state}
//                     body={
//                         <Command.List>
//                             <Command.Empty>No results found.</Command.Empty>
//                             <Command.Group heading="Suggestions">
//                                 <Command.Item>Calendar</Command.Item>
//                                 <Command.Item>Search Emoji</Command.Item>
//                                 <Command.Item>Calculator</Command.Item>
//                             </Command.Group>
//                         </Command.List>
//                     }
//                 />
//              </Command>
//     )
// }

function ModalDrawer({ state, header, body, footer }: ModalDrawerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container>
          <Modal.Dialog className="p-2 max-w-160 h-[50dvh] rounded-2xl">
            <Modal.Header>{header}</Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>{footer}</Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    );
  }

  return (
    <Drawer.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Drawer.Content placement="bottom">
        <Drawer.Dialog className="p-2">
          <Drawer.Handle />
          <Drawer.Header>{header}</Drawer.Header>
          <Drawer.Body>{body}</Drawer.Body>
          <Drawer.Footer>{footer}</Drawer.Footer>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
}
