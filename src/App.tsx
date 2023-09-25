import '/@/app.css';

import { useState } from 'react';

import { ButtonTabsToggle } from '/@/components/ButtonTabsToggle';
import { PanelOptions } from '/@/components/options/PanelOptions';
import { PanelHelp } from '/@/components/PanelHelp';
import { PanelMain } from '/@/components/PanelMain';

import {
  CopyIcon,
  EditIcon,
  InfoIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import {
  HStack,
  IconButton,
  Show,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import {
  isIframe,
  useHashParam,
} from '@metapages/hash-query';

const isFramed = isIframe();

export const App: React.FC = () => {
  const [menuhidden, setMenuHidden] = useState<boolean>(isFramed);
  const [mode] = useHashParam("hm", undefined);
  const [tab, setTab] = useState<number>(0);
  const toast = useToast();

  if (menuhidden) {
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
              <ButtonTabsToggle
                menuhidden={menuhidden}
                setMenuHidden={setMenuHidden}
                mode={mode}
              />
            </Show>
          </HStack>
          <PanelMain />
        </>
      );
    } else if (mode === "disabled") {
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
        <Tooltip label="Copy URL to clipboard">
          <IconButton
            aria-label="copy url"
            variant="ghost"
            icon={<CopyIcon />}
            onClick={() => {
              window.navigator.clipboard.writeText(window.location.href);
              toast({
                title: "Copied URL to clipboard",
                status: "success",
                duration: 2000,
                isClosable: true,
              });
            }}
          />
        </Tooltip>
        <Spacer />{" "}
        <ButtonTabsToggle
          menuhidden={menuhidden}
          setMenuHidden={setMenuHidden}
          mode={mode}
        />
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
