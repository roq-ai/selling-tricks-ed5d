import * as yup from 'yup';

export const performanceEvaluationValidationSchema = yup.object().shape({
  score: yup.number().integer().required(),
  user_id: yup.string().nullable(),
});
