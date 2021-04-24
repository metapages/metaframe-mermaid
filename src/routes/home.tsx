import { h, FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";
import { MetaframeContext } from '../hooks/metaframeHook';

export const Home: FunctionalComponent = () => {
    const metaframe = useContext(MetaframeContext);
    return <div>metaframe inputs: {metaframe ? JSON.stringify(metaframe.inputs) : "none yet"}</div>;
};
