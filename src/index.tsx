import { render } from "preact";
import { WithMetaframe } from "@metapages/metaframe-hook";
import { App } from "./App";

render(
  <WithMetaframe>
    <App />
  </WithMetaframe>,
  document.getElementById("root")!
);
