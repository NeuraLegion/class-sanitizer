export interface SanitizationArguments {

  /**
   * Sanitizing value.
   */
  value: any;

  /**
   * Constraints set by this sanitization type.
   */
  constraints: any[];

  /**
   * Name of the target that is being sanitized.
   */
  targetName: string;

  /**
   * Object that is being sanitized.
   */
  object: Object;

  /**
   * Name of the object's property being sanitized.
   */
  property: string;

}
