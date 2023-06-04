import { useCallback } from 'react';

import { HamburgerIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import {
  useHashParam,
  useHashParamBoolean,
} from '@metapages/hash-query';

export const ButtonTabsToggle: React.FC = () => {
  const [mode] = useHashParam("button", undefined);
  const [hideMenu, sethideMenu] = useHashParamBoolean("menuhidden");

  const toggleMenu = useCallback(() => {
    sethideMenu(!hideMenu);
  }, [hideMenu, sethideMenu]);

  return (
    <IconButton
      aria-label="options"
      variant="ghost"
      color="gray.400"
      onClick={toggleMenu}
      opacity={(mode === "invisible" || mode === "hidden") && hideMenu ? 0 : 1}
      disabled={mode === "hidden" && hideMenu}
      icon={<HamburgerIcon />}
    />
  );
};
