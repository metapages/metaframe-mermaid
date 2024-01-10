import {
  useCallback,
  useState,
} from 'react';

import { PanelCode } from '/@/components/code/PanelCode';
import {
  ButtonCopyExternalLink,
} from '/@/components/header/components/ButtonCopyExternalLink';
import {
  ButtonGotoExternalLink,
} from '/@/components/header/components/ButtonGotoExternalLink';
import { PanelHelp } from '/@/components/help/PanelHelp';
import { HeaderHeight } from '/@/constants';
import { FaCheck } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';

import {
  ChevronDownIcon,
  EditIcon,
  InfoIcon,
  PlusSquareIcon,
} from '@chakra-ui/icons';
import {
  Button,
  Center,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';

import { PanelOptions } from '../options/PanelOptions';

export const HeaderMinimal: React.FC = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [showCode, setShowCode] = useState<boolean>(false);

  const handleSliderChange = (event) => {
    setTabIndex(parseInt(event.target.value, 10));
  };

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  const onJSClick = useCallback(() => {
    if (tabIndex === 0) {
      setShowCode(!showCode);
    } else {
      setTabIndex(0);
      // setTabIndex(tabIndex === 0 ? 1 : 0);
    }
    

  }, [tabIndex, showCode])

  return (
    <HStack spacing="0px" h="100vh" w="100%" className="borderDashedPurple">
      <Tabs
        w="100%"
        h="100%"
        isLazy={true}
        index={tabIndex}
        onChange={handleTabsChange}
      >
        <TabList bg="white" h={HeaderHeight}>
          <Center pl={3}>

          <Button onClick={onJSClick} leftIcon={tabIndex === 0 && !showCode ? <FaCheck /> : <EditIcon />}>Javascript</Button>
          </Center>
          {/* <Tab>
            <EditIcon /> &nbsp; Javascript MINIMAL
          </Tab> */}
          {/* <Tab>
            <PlusSquareIcon /> &nbsp; Modules
          </Tab> */}
          {false ? (
            <>
              <Tab>
                <FiSettings /> &nbsp; Options
              </Tab>
              <Tab>
                <InfoIcon /> &nbsp; Docs
              </Tab>{" "}
            </>
          ) : null}
  <Center pl={3}>
  <Menu>
            <MenuButton as={Button} >
            <ChevronDownIcon />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => handleTabsChange(1)}><PlusSquareIcon /> &nbsp; Modules</MenuItem>
              <MenuItem onClick={() => handleTabsChange(2)}><FiSettings /> &nbsp; Options</MenuItem>
              <ButtonCopyExternalLink menuitem={true} />
              <ButtonGotoExternalLink menuitem={true} />
              <MenuItem onClick={() => handleTabsChange(3)}><InfoIcon /> &nbsp; Docs</MenuItem>
            </MenuList>
          </Menu>
  </Center>
          

          {/* <Spacer />
          <HStack p={1} spacing={4} align="center" pr={16}>
            <ButtonGotoExternalLink /> <ButtonCopyExternalLink />
          </HStack> */}
        </TabList>

        <TabPanels h={`calc(100% - ${HeaderHeight})`}>
          <TabPanel p="0px" h="100%">
            {showCode ? null : <PanelCode />}
            
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
