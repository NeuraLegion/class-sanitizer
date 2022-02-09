/* eslint-disable @typescript-eslint/ban-types */
import { SanitizerConstraintInterface } from '../sanitazion/SanitizerConstraintInterface';
import { getFromContainer } from '../container';

export class ConstraintMetadata {
  public target: Function;
  public name?: string;
  public async: boolean = false;

  constructor(target: Function, name?: string, async: boolean = false) {
    this.target = target;
    this.name = name;
    this.async = async;
  }

  get instance(): SanitizerConstraintInterface {
    return getFromContainer<SanitizerConstraintInterface>(this.target);
  }
}
