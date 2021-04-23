/**
 * Via Context provide the metaframe inputs and outputs
 */

// Can we export a react AND preact compatible module?
import { useContext, useEffect, useState, createContext } from "react"
import { Metaframe, MetaframeInputMap } from "@metapages/metapage";



export interface MetaframeObject {
  inputs: MetaframeInputMap;
  setOutputs?: (outputs: MetaframeInputMap) => void;
  // This is only set when initialized
  metaframe?: Metaframe;
}

const defaultMetaframeObject: MetaframeObject = {
  inputs: {},
};

export const MetaframeContext = createContext<MetaframeObject>(defaultMetaframeObject);

export const useMetaframe = () => {
  return useContext(MetaframeContext);
};

export const useMetaframeObject = () => {
  // ALL this before the render is to set up the metaframe provider
  // I tried pulling the metaframProvider out into a separate class
  // but preact crashed
  const [metaframeObject, setMetaframeObject] = useState<MetaframeObject>({
    inputs: {},
  });
  // const children = args?.children;
  // const metaframe:Metaframe|undefined = undefined;
  const [metaframe, setMetaframe] = useState<Metaframe | undefined>(undefined);
  const [inputs, setInputs] = useState<MetaframeInputMap>(
    metaframeObject.inputs
  );

  useEffect(() => {
    const newMetaframe = new Metaframe();
    setMetaframe(newMetaframe);
    return () => {
      newMetaframe.dispose();
    }
  }, []);

  useEffect(() => {
    if (inputs && metaframe) {
      setMetaframeObject({ metaframe, inputs });
    }
  }, [inputs, metaframe]);

  useEffect(() => {
    if (!metaframe) {
      return;
    }
    const onInputs = (newinputs: MetaframeInputMap) => {
      setInputs(newinputs);
    };
    const disposer = metaframe.onInputs(onInputs);
    return () => {
      // If the metaframe is cleaned up, also remove the inputs listener
      disposer();
    };
  }, [metaframe, setInputs]);

  return [metaframeObject];
};
