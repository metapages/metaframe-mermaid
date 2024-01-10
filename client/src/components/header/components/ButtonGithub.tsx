import { AiFillGithub } from 'react-icons/ai';

import {
  IconButton,
  Link,
} from '@chakra-ui/react';

export const ButtonGithub: React.FC = () => {
  return (
    <Link
      _hover={undefined}
      href="https://github.com/metapages/metaframe-mermaid"
      isExternal
    >
      <IconButton aria-label="github" icon={<AiFillGithub />} />
    </Link>
  );
};
