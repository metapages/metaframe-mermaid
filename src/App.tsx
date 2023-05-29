import "/@/app.css";

import { EditIcon, InfoIcon, ViewIcon } from "@chakra-ui/icons";
import {
  HStack,
  Show,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useHashParamBoolean } from "@metapages/hash-query";

import { PanelHelp } from "/@/components/PanelHelp";
import { PanelMain } from "/@/components/PanelMain";
import { PanelOptions } from "/@/components/PanelOptions";
import { ButtonTabsToggle } from "/@/components/ButtonTabsToggle";

export const App: React.FC = () => {
  const [hideMenu] = useHashParamBoolean("hidemenu");

  if (hideMenu) {
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
  }
  return (
    <Tabs>
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
