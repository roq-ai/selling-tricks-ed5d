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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getAutomationFeatureById, updateAutomationFeatureById } from 'apiSdk/automation-features';
import { Error } from 'components/error';
import { automationFeatureValidationSchema } from 'validationSchema/automation-features';
import { AutomationFeatureInterface } from 'interfaces/automation-feature';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function AutomationFeatureEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<AutomationFeatureInterface>(
    () => (id ? `/automation-features/${id}` : null),
    () => getAutomationFeatureById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: AutomationFeatureInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateAutomationFeatureById(id, values);
      mutate(updated);
      resetForm();
      router.push('/automation-features');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<AutomationFeatureInterface>({
    initialValues: data,
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
            Edit Automation Feature
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="feature_name" mb="4" isInvalid={!!formik.errors?.feature_name}>
              <FormLabel>Feature Name</FormLabel>
              <Input
                type="text"
                name="feature_name"
                value={formik.values?.feature_name}
                onChange={formik.handleChange}
              />
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(AutomationFeatureEditPage);
