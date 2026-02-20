/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { SanitizationMetadataArgs } from './SanitizationMetadataArgs';

export class SanitizationMetadata {
  public type: string;
  public target: Function | string;
  public propertyName: string;
  public constraints: any[] = [];
  public constraintCls?: Function;
  public each: boolean = false;

  constructor(args: SanitizationMetadataArgs) {
    this.type = args.type;
    this.target = args.target;
    this.propertyName = args.propertyName;
    this.constraints = args.constraints ?? [];
    this.constraintCls = args.constraintCls;
    if (args.sanitizationOptions) {
      this.each = !!args.sanitizationOptions.each;
    }
  }
}
