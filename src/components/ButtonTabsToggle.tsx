import { useCallback } from 'react';

import { HamburgerIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import {
  useHashParamBoolean,
  useHashParamJson,
} from '@metapages/hash-query';

import {
  defaultOptions,
  Options,
} from './PanelOptions';

export const ButtonTabsToggle: React.FC = () => {
  const [hideMenu, sethideMenu] = useHashParamBoolean("hidemenu");
  const [options] = useHashParamJson<Options>(
    "options",
    defaultOptions
  );

  const toggleMenu = useCallback(() => {
    sethideMenu(!hideMenu);
  }, [hideMenu, sethideMenu]);

  return (
    <IconButton
      aria-label="options"
      variant="ghost"
      color="gray.400"
      onClick={toggleMenu}
      opacity={options.invisibleMenuWhenHidden && hideMenu ? 0 : 1}
      icon={<HamburgerIcon />}
    />
  );
};
