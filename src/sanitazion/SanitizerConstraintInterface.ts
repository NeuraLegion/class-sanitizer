import { SanitizationArguments } from './SanitizationArguments';

/**
 * Custom sanitizers must implement this interface to provide custom sanitization logic.
 */
export interface SanitizerConstraintInterface {
  /**
   * Method to be called to perform custom sanitization over given value.
   */
  sanitize(
    value: any,
    sanitizationArguments?: SanitizationArguments
  ): Promise<any> | any;
}
