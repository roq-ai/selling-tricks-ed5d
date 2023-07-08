import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface AutomationFeatureInterface {
  id?: string;
  feature_name: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface AutomationFeatureGetQueryInterface extends GetQueryInterface {
  id?: string;
  feature_name?: string;
  user_id?: string;
}
