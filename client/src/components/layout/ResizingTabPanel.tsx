import { ReactNode } from 'react';

import { MinScreenWidthToShowCodeAndEditorColumns } from '/@/constants';

import {
  Box,
  HStack,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';

export const ResizingTabPanel: React.FC<{ children?: ReactNode }> = ({
  children,
}) => {
  // single media query with no options
  const [isLargerEnough] = useMediaQuery(
    `(min-width: ${MinScreenWidthToShowCodeAndEditorColumns})`
  );
  // console.log('isLargerEnough', isLargerEnough);

  // spacing={10}
  return (
    <HStack w="100%" h="100%" justifyContent="flex-start" spacing="0px" className="borderDashedBlue" bg={isLargerEnough ? undefined : "white"}>
      {/* <VStack w="100%" h="100%" alignItems="flex-start" spacing="0px"> */}
        <Box
          height="100%"
          width="100%"
          // borderWidth="1px"
          // p={2}
          rounded="md"
          // overflowY="scroll"
          className={"borderFatSolidOrange transparent"}
          // bg={!isLargerEnough ? "blue" : undefined}
        >
          {children}
        </Box>
      {/* </VStack> */}

      {isLargerEnough ? (
        <VStack width="100%" alignItems="flex-start"></VStack>
      ) : null}
    </HStack>
  );
};
