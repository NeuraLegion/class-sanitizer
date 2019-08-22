import { SanitizationOptions } from '../decorator/SanitizationOptions';

export interface SanitizationMetadataArgs {
  type: string;

  target: Function | string;

  propertyName: string;

  constraintCls?: Function;

  constraints?: any[];

  sanitizationOptions?: SanitizationOptions;
}
