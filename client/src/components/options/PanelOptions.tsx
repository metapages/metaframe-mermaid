import { useCallback } from 'react';

import { useFormik } from 'formik';
import * as yup from 'yup';

import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  VStack,
} from '@chakra-ui/react';

import { ResizingTabPanel } from '../layout/ResizingTabPanel';
import { RadioButtonMode } from './components/RadioButtonMode';
import {
  Options,
  Theme,
  useOptions,
} from './useOptions';

export const defaultOptions: Options = {
  theme: "light",
};

const OptionDescription: Record<string, string> = {
  theme: "Light/Dark theme",
};

const validationSchema = yup.object({
  theme: yup
    .string()
    .notRequired()
    .oneOf(["light", "vs-dark"] as Theme[])
    .optional(),
});
interface FormType extends yup.InferType<typeof validationSchema> {}

export const PanelOptions: React.FC = () => {
  const [options, setOptions] = useOptions();

  const onSubmit = useCallback(
    (values: FormType) => {
      let newOptions: Options | undefined = { ...(values as Options) };
      if (newOptions.theme === defaultOptions.theme) {
        delete newOptions.theme;
      }
      if (Object.keys(newOptions).length === 0) {
        setOptions(undefined);
      } else {
        setOptions(newOptions);
      }
    },
    [setOptions]
  );

  const formik = useFormik({
    initialValues: options || {},
    onSubmit,
    validationSchema,
  });

  return (
    <ResizingTabPanel>
      <VStack
        maxW="700px"
        gap="1rem"
        justifyContent="flex-start"
        alignItems="stretch"
      >
        <RadioButtonMode />

        <form onSubmit={formik.handleSubmit}>
          <FormControl pb="1rem">
            <FormLabel fontWeight="bold">
              {OptionDescription["theme"]}
            </FormLabel>
            <RadioGroup
              id="theme"
              onChange={(e) => {
                // currently RadioGroup needs this to work
                formik.setFieldValue("theme", e);
                formik.handleSubmit();
              }}
              value={formik.values.theme || defaultOptions.theme}
            >
              <Stack
                pl="30px"
                pr="30px"
                spacing={5}
                direction="column"
                borderWidth="1px"
                borderRadius="lg"
              >
                <Radio value="light" defaultChecked>
                  light
                </Radio>
                <Radio value="vs-dark">dark</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          {Object.keys(validationSchema.fields as any)
            .filter(
              (fieldName) =>
                (validationSchema.fields as any)[fieldName].type === "boolean"
            )
            .map((fieldName) => (
              <FormControl pb="1rem" key={fieldName}>
                <FormLabel fontWeight="bold" htmlFor={fieldName}>
                  {OptionDescription[fieldName]}
                </FormLabel>
                <Checkbox
                  name={fieldName}
                  size="lg"
                  bg="gray.100"
                  spacing="1rem"
                  onChange={(e) => {
                    // currently checkbox needs this to work
                    formik.setFieldValue(fieldName, e.target.checked);
                    formik.handleSubmit();
                  }}
                  isChecked={(formik.values as any)[fieldName]}
                />
              </FormControl>
            ))}

          <Button type="submit" display="none">
            submit
          </Button>
        </form>
      </VStack>
    </ResizingTabPanel>
  );
};
