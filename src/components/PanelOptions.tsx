import * as yup from 'yup';

import { RadioButtonMode } from './RadioButtonMode';

// Leaving these all commented out instead of removed so new options
// can be added quickly



export type Options = {
  // invisibleMenuWhenHidden?: boolean;
  // mode? : string;
  // someStringOption?: string;
};

export const defaultOptions: Options = {
  // invisibleMenuWhenHidden: false,
  // mode: "edit",
  // someStringOption: "foo",
};

const validationSchema = yup.object({
  // invisibleMenuWhenHidden: yup.boolean().optional(),
  // mode: yup.string().optional(),
  // someStringOption: yup.string().optional(),
});
interface FormType extends yup.InferType<typeof validationSchema> {}

export const PanelOptions: React.FC = () => {
  // const [options, setOptions] = useHashParamJson<Options>(
  //   "options",
  //   defaultOptions
  // );


  // const onSubmit = useCallback(
  //   (values: FormType) => {
  //     setOptions(values);
  //   },
  //   [setOptions]
  // );

  // const formik = useFormik({
  //   initialValues: {
  //     invisibleMenuWhenHidden: options.invisibleMenuWhenHidden,
  //   },
  //   onSubmit,

  //   validationSchema,
  // });



  return (
    <>
      <br />
      {/* <form onSubmit={formik.handleSubmit}>
        <FormControl>
          <FormLabel htmlFor="invisibleMenuWhenHidden">
            When menu is hidden, hide hamburger button
          </FormLabel>
          <Switch
            id="invisibleMenuWhenHidden"
            onChange={handleSwitch}
            isChecked={formik.values.invisibleMenuWhenHidden}
          />
        </FormControl>

        <Button type="submit" display="none">
          submit
        </Button>
      </form> */}

      <RadioButtonMode />
    </>
  );
};
