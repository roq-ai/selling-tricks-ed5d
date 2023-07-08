import * as yup from 'yup';

export const automationFeatureValidationSchema = yup.object().shape({
  feature_name: yup.string().required(),
  user_id: yup.string().nullable(),
});
