import { h, render } from "preact";
import { App } from "./App";
import { FunctionalComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { MetaframeObject, MetaframeContext } from "./hooks/metaframeHook";
import { Metaframe, MetaframeInputMap } from "@metapages/metapage";

const Index: FunctionalComponent = () => {
  const [metaframeObject] = useMetaframe();

  return (
    /* I tried to pull this out into it's own file but preact hates it */
    <MetaframeContext.Provider value={metaframeObject}>
      <Router>
        <QueryParamProvider ReactRouterRoute={Route}>
          <App />
        </QueryParamProvider>
      </Router>
    </MetaframeContext.Provider>
  );
};

render(<Index />, document.getElementById("root")!);

// ALL this before the render is to set up the metaframe provider
// I tried pulling the metaframProvider out into a separate class
// but preact crashed
const useMetaframe = () => {
  const [metaframeObject, setMetaframeObject] = useState<MetaframeObject>({
    inputs: {},
  });
  const [metaframe, setMetaframe] = useState<Metaframe | undefined>(undefined);
  const [inputs, setInputs] = useState<MetaframeInputMap>(
    metaframeObject.inputs
  );

  useEffect(() => {
    const newMetaframe = new Metaframe();
    setMetaframe(newMetaframe);
    return () => {
      newMetaframe.dispose();
    };
  }, []);

  useEffect(() => {
    if (inputs && metaframe) {
      setMetaframeObject({
        metaframe,
        inputs,
        setOutputs: metaframe.setOutputs,
      });
    }
  }, [inputs, metaframe]);

  useEffect(() => {
    if (!metaframe) {
      return;
    }
    const onInputs = (newinputs: MetaframeInputMap) => {
      setInputs(newinputs);
    };
    metaframe.onInputs(onInputs);

    return () => {
      // If the metaframe is cleaned up, also remove the inputs listener
      metaframe.removeListener(Metaframe.INPUTS, onInputs);
    };
  }, [metaframe, setInputs]);

  return [metaframeObject];
};
