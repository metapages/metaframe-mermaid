import { useMetaframeUrl } from '/@/hooks/useMetaframeUrl';

import { CopyIcon } from '@chakra-ui/icons';
import {
  IconButton,
  MenuItem,
  useClipboard,
  useToast,
} from '@chakra-ui/react';

export const ButtonCopyExternalLink: React.FC<{ menuitem?: boolean }> = ({
  menuitem,
}) => {
  const { url } = useMetaframeUrl();
  const toast = useToast();
  const { onCopy } = useClipboard(url);

  if (menuitem) {
    return (
      <MenuItem
        onClick={() => {
          onCopy();
          toast({
            title: "Copied URL to clipboard",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }}
      >
        <CopyIcon  />
        &nbsp;
        Copy URL to clipboard
      </MenuItem>
    );
  }

  return (
    <IconButton
      aria-label="copy url"
      onClick={() => {
        onCopy();
        toast({
          title: "Copied URL to clipboard",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }}
      icon={<CopyIcon />}
    />
  );
};
