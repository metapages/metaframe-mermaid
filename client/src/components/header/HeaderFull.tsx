import { PanelCode } from '/@/components/code/PanelCode';
import {
  ButtonCopyExternalLink,
} from '/@/components/header/components/ButtonCopyExternalLink';
import {
  ButtonGotoExternalLink,
} from '/@/components/header/components/ButtonGotoExternalLink';
import { PanelHelp } from '/@/components/help/PanelHelp';
import { HeaderHeight } from '/@/constants';
import { FiSettings } from 'react-icons/fi';

import {
  EditIcon,
  InfoIcon,
} from '@chakra-ui/icons';
import {
  HStack,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';

import { PanelOptions } from '../options/PanelOptions';

export const HeaderFull: React.FC = () => {
  return (
    <HStack spacing="0px" h="100vh" w="100%" className="borderDashedPurple">
      <Tabs w="100%" h="100%" isLazy={true}>
        <TabList bg="white" h={HeaderHeight}>
          <Tab>
            <EditIcon /> &nbsp; Edit
          </Tab>
          <Tab>
            <FiSettings /> &nbsp; Options
          </Tab>
          <Tab>
            <InfoIcon /> &nbsp; Docs
          </Tab>

          <Spacer />
          <HStack p={1} spacing={4} align="center" pr={16}>
            <ButtonGotoExternalLink />{" "}<ButtonCopyExternalLink /> 
          </HStack>
        </TabList>

        <TabPanels h={`calc(100% - ${HeaderHeight})`}>
          <TabPanel p="0px" h="100%">
            <PanelCode />
          </TabPanel>
          <TabPanel p="0px" m="0px" h="100%">
            <PanelOptions />
          </TabPanel>
          <TabPanel p="0px" h="100%">
            <PanelHelp />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </HStack>
  );
};
