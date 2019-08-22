import { SanitizerConstraintInterface } from '../sanitazion/SanitizerConstraintInterface';
import { getFromContainer } from '../container';

export class ConstraintMetadata {
  target: Function;
  name: string;

  constructor(target: Function, name?: string, async: boolean = false) {
    this.target = target;
    this.name = name;
  }

  get instance(): SanitizerConstraintInterface {
    return getFromContainer<SanitizerConstraintInterface>(this.target);
  }
}
