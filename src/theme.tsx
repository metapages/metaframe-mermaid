import { extendTheme, StyleFunctionProps } from "@chakra-ui/react";
// import { mode } from "@chakra-ui/theme-tools";

// example: https://codesandbox.io/s/chakraui-custom-bg-colors-stnyr?file=%2Fsrc%2FApp.js
// https://github.com/chakra-ui/chakra-ui/discussions/5048
// one day this will be responsive but for now it's just transparent
// const dark = "#232323";
// const light = "#f0f0f0";
const light = "transparent"

export const theme = extendTheme({
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        color: "default",
        bg: light,
        // bg: mode(light, dark)(props),
      },
    }),
  },
});
