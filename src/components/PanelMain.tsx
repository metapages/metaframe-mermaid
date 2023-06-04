import {
  useEffect,
  useRef,
  useState,
} from 'react';

import mermaid from 'mermaid';

import {
  Alert,
  AlertIcon,
  Box,
  Stack,
} from '@chakra-ui/react';
import { useMetaframe } from '@metapages/metaframe-hook';
import {
  MetaframeEvents,
  MetaframeInputMap,
  MetapageDefinitionV3,
} from '@metapages/metapage';

/**
 * Just an example very basic output of incoming inputs
 *
 */
export const PanelMain: React.FC = () => {
  const metaframeObject = useMetaframe();
  const ref = useRef<HTMLDivElement>(null);
  const [mermaidDefinition, setMermaidDefinition] = useState<string>("");
  const [error, setError] = useState<string[] | undefined>();

  useEffect(() => {
    const metaframe = metaframeObject?.metaframe;
    if (!metaframe) {
      return;
    }
    // @ts-ignore
    window.handleClick = (nodeClickText) => {
      metaframe.setOutput("click", nodeClickText);
    };
  }, [metaframeObject?.metaframe]);

  useEffect(() => {
    if (!mermaidDefinition) {
      if (ref.current) {
        ref.current.innerHTML = "";
      }
      return;
    }
    let cancelled = false;
    (async () => {
      if (cancelled) {
        return;
      }

      const { svg, bindFunctions } = await mermaid.render(
        "customMermaid",
        mermaidDefinition
      );
      if (cancelled || !ref.current || !svg) {
        return;
      }
      ref.current.innerHTML = svg;
      if (bindFunctions) {
        bindFunctions(ref.current);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mermaidDefinition]);

  // listen to inputs and cleanup up listener
  useEffect(() => {
    if (!metaframeObject?.metaframe) {
      return;
    }
    const metaframe = metaframeObject.metaframe;
    const onInputs = (inputs: MetaframeInputMap): void => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        flowchart: {
          useMaxWidth: false,
          htmlLabels: false,
        },
      });

      if (inputs["metapage/definition"]) {
        const { mermaid, error } = createMermaidFlowchartFromMetapage(
          inputs["metapage/definition"]
        );
        setMermaidDefinition(mermaid || "");
        setError(error);
      } else if (inputs["mermaid"]) {
        setError(undefined);
        setMermaidDefinition(inputs["mermaid"]);
      }
    };
    metaframe.addListener(MetaframeEvents.Inputs, onInputs);

    return () => {
      // If the metaframe is cleaned up, also remove the inputs listener
      metaframe.removeListener(MetaframeEvents.Inputs, onInputs);
    };
  }, [metaframeObject.metaframe, setMermaidDefinition]);

  return (
    <Box>
      {error ? (
        <Stack spacing={3}>
          {error.map((e) => (
            <Alert status="error">
              <AlertIcon />
              {e}
            </Alert>
          ))}
        </Stack>
      ) : null}
      <div ref={ref} className="customMermaid"></div>
    </Box>
  );
};

const safe = (s: string) => {
  return s.replace(/-/g, "_");
};

const createMermaidFlowchartFromMetapage = (
  metapageDefinition: MetapageDefinitionV3
): { mermaid?: string; error?: string[] } => {
  if (!metapageDefinition) {
    return {
      error: [`Metapage definition: cannot graph: metapageDefinition is null`],
    };
  }

  if (typeof metapageDefinition === "string") {
    // maybe it is a JSON string
    try {
      metapageDefinition = JSON.parse(metapageDefinition);
    } catch (err) {
      // guess not
      return {
        error: [
          `Metapage definition: failed to JSON.parse metapageDefinition: ${metapageDefinition}`,
          `${err}`,
        ],
      };
    }
  }

  if (!metapageDefinition.metaframes) {
    return {
      error: [
        `Metapage definition: Cannot graph, no metaframes: ${metapageDefinition}`,
      ],
    };
  }

  let graphDefinition = "flowchart LR";
  const metaframeKeys = Object.keys(metapageDefinition.metaframes);
  const metaframeKeysToMermaidId = Object.fromEntries(
    Object.entries(metapageDefinition.metaframes).map(([k, v], i) => [k, `m${i + 1}`])
  );


  metaframeKeys.forEach(function (metaframeId, index) {
    graphDefinition += `\n\t${metaframeKeysToMermaidId[metaframeId]}["${metaframeId}"]`;
    graphDefinition += `\n\tclick ${metaframeKeysToMermaidId[metaframeId]} handleClick`;
  });
  metaframeKeys.forEach(function (metaframeId, index) {
    if (
      metapageDefinition.metaframes[metaframeId].inputs &&
      Object.keys(metapageDefinition.metaframes[metaframeId].inputs!).length > 0
    ) {
      metapageDefinition.metaframes[metaframeId].inputs!.forEach(
        (pipe: MetaframeInputMap) => {
          if (!metaframeKeysToMermaidId[pipe.metaframe]) {
            return;
          }

          if (pipe.target) {
            graphDefinition += `\n\t${
              metaframeKeysToMermaidId[pipe.metaframe]
            }-- ${safe(pipe.source)}:${safe(pipe.target)} -->${
              metaframeKeysToMermaidId[metaframeId]
            }`;
          } else {
            graphDefinition += `\n\t${
              metaframeKeysToMermaidId[pipe.metaframe]
            }-- ${safe(pipe.source)} -->${
              metaframeKeysToMermaidId[metaframeId]
            }`;
          }
        }
      );
    }
  });

  graphDefinition += "\n";

  return { mermaid: graphDefinition };
};
