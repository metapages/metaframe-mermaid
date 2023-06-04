import '/@/app.css';

import { ButtonTabsToggle } from '/@/components/ButtonTabsToggle';
import { PanelHelp } from '/@/components/PanelHelp';
import { PanelMain } from '/@/components/PanelMain';
import { PanelOptions } from '/@/components/PanelOptions';

import {
  EditIcon,
  InfoIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import {
  HStack,
  Show,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import {
  useHashParam,
  useHashParamBoolean,
  useHashParamInt,
} from '@metapages/hash-query';

export const App: React.FC = () => {
  const [hideMenu] = useHashParamBoolean("menuhidden");
  const [mode] = useHashParam("button", undefined);
  const [tab, setTab] = useHashParamInt("tab");

  if (hideMenu) {
    if (mode === undefined || mode === "visible" || mode === "invisible") {
      return (
        <>
          <HStack
            style={{ position: "absolute" }}
            width="100%"
            justifyContent="flex-end"
          >
            <Spacer />
            <Show breakpoint="(min-width: 200px)">
              <ButtonTabsToggle />
            </Show>
          </HStack>
          <PanelMain />
        </>
      );
    } else if (mode === "hidden") {
      return <PanelMain />;
    }
  }
  return (
    <Tabs index={tab || 0} isLazy={true} onChange={setTab}>
      <TabList>
        <Tab>
          <ViewIcon /> &nbsp; Main panel
        </Tab>
        <Tab>
          <EditIcon /> &nbsp; Options
        </Tab>
        <Tab>
          <InfoIcon />
          &nbsp; Help
        </Tab>
        <Spacer /> <ButtonTabsToggle />
      </TabList>

      <TabPanels>
        <TabPanel>
          <PanelMain />
        </TabPanel>
        <TabPanel>
          <PanelOptions />
        </TabPanel>
        <TabPanel>
          <PanelHelp />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
