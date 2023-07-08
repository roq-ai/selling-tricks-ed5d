import axios from 'axios';
import queryString from 'query-string';
import { AutomationFeatureInterface, AutomationFeatureGetQueryInterface } from 'interfaces/automation-feature';
import { GetQueryInterface } from '../../interfaces';

export const getAutomationFeatures = async (query?: AutomationFeatureGetQueryInterface) => {
  const response = await axios.get(`/api/automation-features${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createAutomationFeature = async (automationFeature: AutomationFeatureInterface) => {
  const response = await axios.post('/api/automation-features', automationFeature);
  return response.data;
};

export const updateAutomationFeatureById = async (id: string, automationFeature: AutomationFeatureInterface) => {
  const response = await axios.put(`/api/automation-features/${id}`, automationFeature);
  return response.data;
};

export const getAutomationFeatureById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/automation-features/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteAutomationFeatureById = async (id: string) => {
  const response = await axios.delete(`/api/automation-features/${id}`);
  return response.data;
};
