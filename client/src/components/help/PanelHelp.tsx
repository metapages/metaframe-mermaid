import { ResizingTabPanel } from '/@/components/layout/ResizingTabPanel';
import { NonCodingPanelMargin } from '/@/constants';

import { Box } from '@chakra-ui/react';

export const PanelHelp: React.FC = () => {
  return (
    <ResizingTabPanel>
      <Box w="100%" h="100%" m={NonCodingPanelMargin} overflowY="scroll"  pr="20px">
        <Box className="iframe-container" >
          <iframe
            className="iframe"
            src={`https://markdown.mtfm.io/#?hm=disabled&url=${
              window.location.origin
            }${
              window.location.pathname.endsWith("/")
                ? window.location.pathname.substring(
                    0,
                    window.location.pathname.length - 1
                  )
                : window.location.pathname
            }/README.md`}
          />
        </Box>
      </Box>
    </ResizingTabPanel>
  );

};
