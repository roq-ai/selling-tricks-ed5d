import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createAutomationFeature } from 'apiSdk/automation-features';
import { Error } from 'components/error';
import { automationFeatureValidationSchema } from 'validationSchema/automation-features';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { AutomationFeatureInterface } from 'interfaces/automation-feature';

function AutomationFeatureCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: AutomationFeatureInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createAutomationFeature(values);
      resetForm();
      router.push('/automation-features');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<AutomationFeatureInterface>({
    initialValues: {
      feature_name: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: automationFeatureValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Automation Feature
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="feature_name" mb="4" isInvalid={!!formik.errors?.feature_name}>
            <FormLabel>Feature Name</FormLabel>
            <Input type="text" name="feature_name" value={formik.values?.feature_name} onChange={formik.handleChange} />
            {formik.errors.feature_name && <FormErrorMessage>{formik.errors?.feature_name}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'automation_feature',
    operation: AccessOperationEnum.CREATE,
  }),
)(AutomationFeatureCreatePage);
