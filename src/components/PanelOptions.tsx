import { useCallback } from 'react';

import { useFormik } from 'formik';
import * as yup from 'yup';

import {
  Button,
  FormControl,
  FormLabel,
  Switch,
} from '@chakra-ui/react';
import { useHashParamJson } from '@metapages/hash-query';

export type Options = {
  invisibleMenuWhenHidden?: boolean;
  // someStringOption?: string;
};

export const defaultOptions: Options = {
  invisibleMenuWhenHidden: false,
  // someStringOption: "foo",
};

const validationSchema = yup.object({
  invisibleMenuWhenHidden: yup.boolean().optional(),
  // someStringOption: yup.string().optional(),
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
      invisibleMenuWhenHidden: options.invisibleMenuWhenHidden,
      // someStringOption: options.someStringOption,
    },
    onSubmit,

    validationSchema,
  });

  // const handleDistributionChange = useCallback(
  //   (e: React.ChangeEvent<any>) => {
  //     formik.setFieldValue("distribution", e.target.value);
  //     formik.submitForm();
  //   },
  //   [formik]
  // );

  const handleSwitch = useCallback(
    (e: React.ChangeEvent<any>) => {
      formik.setFieldValue("invisibleMenuWhenHidden", e.target.checked);
      formik.submitForm();
    },
    [formik]
  );

  return (
    <>
      <br />
      <form onSubmit={formik.handleSubmit}>
        <FormControl>
          <FormLabel htmlFor="invisibleMenuWhenHidden">
            When menu is hidden, make hamburger button invisible
          </FormLabel>
          <Switch
            id="invisibleMenuWhenHidden"
            onChange={handleSwitch}
            isChecked={formik.values.invisibleMenuWhenHidden}
          />
        </FormControl>

        {/* <FormControl>
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
        </FormControl> */}

        <Button type="submit" display="none">
          submit
        </Button>
      </form>
    </>
  );
};
