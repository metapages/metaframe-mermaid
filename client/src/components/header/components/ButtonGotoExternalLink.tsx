import { useMetaframeUrl } from '/@/hooks/useMetaframeUrl';

import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Link,
  MenuItem,
} from '@chakra-ui/react';

export const ButtonGotoExternalLink: React.FC<{ menuitem?: boolean }> = ({
  menuitem,
}) => {
  const { url } = useMetaframeUrl();

  if (menuitem) {
    return (
      <MenuItem w="100%" as="a" href={url} target="_parent">
        <ExternalLinkIcon />
        &nbsp; Go to source URL
      </MenuItem>
    );
  }

  return (
    <Link _hover={undefined} href={url} isExternal target="_parent">
      <IconButton aria-label="go to source url" icon={<ExternalLinkIcon />} />
    </Link>
  );
};
