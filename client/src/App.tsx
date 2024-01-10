import '/@/app.css';
import '/@/debug.css';

import { HeaderFull } from '/@/components/header/HeaderFull';
import { HeaderMinimal } from '/@/components/header/HeaderMinimal';
import { MinScreenWidthToShowFullHeader } from '/@/constants';

import { useMediaQuery } from '@chakra-ui/react';

export const App: React.FC = () => {

  const [isLargerEnoughForFullHeader] = useMediaQuery(`(min-width: ${MinScreenWidthToShowFullHeader})`);

  return isLargerEnoughForFullHeader ? <HeaderFull /> : <HeaderMinimal />;

};
