import { SanitizationMetadataArgs } from './SanitizationMetadataArgs';

export class SanitizationMetadata {
  type: string;
  target: Function | string;
  propertyName: string;
  constraintCls: Function;
  constraints: any[];
  each: boolean = false;

  constructor(args: SanitizationMetadataArgs) {
    this.type = args.type;
    this.target = args.target;
    this.propertyName = args.propertyName;
    this.constraints = args.constraints;
    this.constraintCls = args.constraintCls;
    if (args.sanitizationOptions) {
      this.each = args.sanitizationOptions.each;
    }
  }
}
