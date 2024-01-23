import { useEffect, useState } from "react";

export type PermissionOption = {
  optionTitle: string;
  useOption: () => void;
};

export type Options = {
  leave_chat?: PermissionOption;
  invite_member?: PermissionOption;
  remove_member?: PermissionOption;
  make_moderator?: PermissionOption;
};

export const menuItems = {
  leave_chat: "leave_chat",
  invite_member: "invite_member",
  remove_member: "remove_member",
  make_moderator: "make_moderator",
} as const;

type MenuItemKeys = keyof typeof menuItems;

const HeaderMenu = ({ menuOptions }: { menuOptions: Options }) => {
  const [menuItems, setMenuItems] = useState<PermissionOption[]>([]);

  useEffect(() => {
    setMenuItems([]);
    const menuKeys: MenuItemKeys[] = Object.keys(menuOptions) as MenuItemKeys[];
    menuKeys.forEach((key) => {
      const option = menuOptions[key];

      if (option !== undefined) {
        setMenuItems((previousItems) => [
          ...previousItems,
          {
            optionTitle: option.optionTitle,
            useOption: option.useOption,
          },
        ]);
      }
    });
  }, [menuOptions]);

  return (
    <div className="absolute right-5  w-44 border border-light-grey bg-white">
      {menuItems.map((menuItem, index) => {
        return (
          <div key={index} onClick={menuItem.useOption}>
            {menuItem.optionTitle}
          </div>
        );
      })}
    </div>
  );
};

export default HeaderMenu;
