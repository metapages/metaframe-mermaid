import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Switch,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useCallback } from "react";
import * as yup from "yup";
import { useHashParamJson } from "@metapages/hash-query";

export type Options = {
  someBooleanOption?: boolean;
  someStringOption?: string;
};

export const defaultOptions: Options = {
  someBooleanOption: false,
  someStringOption: "foo",
};

const validationSchema = yup.object({
  someBooleanOption: yup.boolean().optional(),
  someStringOption: yup.string().optional(),
});
interface FormType extends yup.InferType<typeof validationSchema> {}

export const PanelOptions: React.FC = () => {
  const [options, setOptions] = useHashParamJson<Options>(
    "options",
    defaultOptions
  );

  const onSubmit = useCallback(
    (values: FormType) => {
      setOptions(values);
    },
    [setOptions]
  );

  const formik = useFormik({
    initialValues: {
      someBooleanOption: options.someBooleanOption,
      someStringOption: options.someStringOption,
    },
    onSubmit,

    validationSchema,
  });

  const handleDistributionChange = useCallback(
    (e: React.ChangeEvent<any>) => {
      formik.setFieldValue("distribution", e.target.value);
      formik.submitForm();
    },
    [formik]
  );

  const handleSwitch = useCallback(
    (e: React.ChangeEvent<any>) => {
      formik.setFieldValue("someBooleanOption", e.target.checked);
      formik.submitForm();
    },
    [formik]
  );

  return (
    <>
      <br />
      <form onSubmit={formik.handleSubmit}>
        <FormControl>
          <FormLabel htmlFor="someBooleanOption">Some boolean option (saved in hash params)</FormLabel>
          <Switch
            id="someBooleanOption"
            onChange={handleSwitch}
            isChecked={formik.values.someBooleanOption}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="someStringOption">
            Some string option (saved in hash params)
          </FormLabel>

          <InputGroup>
            <Input
              id="someStringOption"
              name="someStringOption"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.someStringOption}
            />
          </InputGroup>
        </FormControl>

        <Button type="submit" display="none">
          submit
        </Button>
      </form>
    </>
  );
};
