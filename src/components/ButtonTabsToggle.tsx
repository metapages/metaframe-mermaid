import { HamburgerIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { useHashParamBoolean } from "@metapages/hash-query";
import { useCallback } from "react";

export const ButtonTabsToggle: React.FC = () => {
  const [hideMenu, sethideMenu] = useHashParamBoolean("hidemenu");

  const toggleMenu = useCallback(() => {
    sethideMenu(!hideMenu);
  }, [hideMenu, sethideMenu]);

  return (
    <IconButton
      aria-label="options"
      variant="ghost"
      color="gray.400"
      onClick={toggleMenu}
      icon={<HamburgerIcon />}
    />
  );
};
