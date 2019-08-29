import { SanitizationMetadata } from '../metadata/SanitizationMetadata';
import { SanitizeTypes } from './SanitizeTypes';
import { MetadataStorage } from '../metadata/MetadataStorage';
import {
  blacklist,
  escape,
  normalizeEmail,
  ltrim,
  rtrim,
  whitelist,
  toBoolean,
  toDate,
  toFloat,
  toInt,
  stripLow,
  trim
} from 'validator';
import { getFromContainer } from '../container';
import { ConstraintMetadata } from '../metadata/ConstraintMetadata';
import { SanitizationArguments } from './SanitizationArguments';
import { SanitizerConstraintInterface } from './SanitizerConstraintInterface';
import { sanitize as secure } from 'sanitizer';

/**
 * Sanitizer performs sanitization of the given object based on its metadata.
 */
export class Sanitizer {
  private metadataStorage = getFromContainer(MetadataStorage);

  /**
   * Performs sanitization of the given object based on annotations used in given object class.
   */
  sanitize(object: any) {
    this.metadataStorage
      .getTargetSanitizationMetadata(object.constructor)
      .filter((metadata) => !!object[metadata.propertyName])
      .forEach((metadata) => {
        const value = object[metadata.propertyName];
        if (metadata.each) {
          if (value instanceof Array) {
            object[metadata.propertyName] = value.map((subValue: any) =>
              this.sanitizeValue(subValue, object, metadata)
            );
          }
        } else {
          object[metadata.propertyName] = this.sanitizeValue(
            value,
            object,
            metadata
          );
        }
      });
  }

  /**
   * Performs sanitization of the given object based on annotations used in given object class.
   * Performs in async-style, useful to use it in chained promises.
   */
  async sanitizeAsync<T>(object: T): Promise<T> {
    return new Promise<T>((ok) => {
      this.sanitize(object);
      ok(object);
    });
  }

  /**
   * Strips unsafe tags and attributes from html.
   */
  secure(str: string): string {
    if (typeof str !== 'string') {
      return str;
    }
    return secure(str);
  }

  /**
   * Remove characters that appear in the blacklist. The characters are used in a RegExp and so you will need to
   * escape some chars, e.g @Blacklist('\\[\\]')
   */
  blacklist(str: string, chars: RegExp | string): string {
    if (typeof str !== 'string') {
      return str;
    }
    return blacklist(str, chars as string);
  }

  /**
   * Replace <, >, &, ', " and / with HTML entities.
   */
  escape(str: string): string {
    if (typeof str !== 'string') {
      return str;
    }
    return escape(str);
  }

  /**
   * Trim characters from the left-side of the input.
   */
  ltrim(str: string, chars?: string[]): string {
    if (typeof str !== 'string') {
      return str;
    }
    return ltrim(str, chars ? chars.join() : undefined);
  }

  /**
   * Canonicalize an email address.
   */
  normalizeEmail(str: string, lowercase?: boolean): string | false {
    if (typeof str !== 'string') {
      return str;
    }
    return normalizeEmail(str, { lowercase });
  }

  /**
   * Trim characters from the right-side of the input.
   */
  rtrim(str: string, chars?: string[]): string {
    if (typeof str !== 'string') {
      return str;
    }
    return rtrim(str, chars ? chars.join() : undefined);
  }

  /**
   * Remove characters with a numerical value < 32 and 127, mostly control characters.
   * If keepNewLines is true, newline characters are preserved (\n and \r, hex 0xA and 0xD).
   * Unicode-safe in JavaScript.
   */
  stripLow(str: string, keepNewLines?: boolean): string {
    if (typeof str !== 'string') {
      return str;
    }
    return stripLow(str, keepNewLines);
  }

  /**
   * Convert the input to a boolean.
   * Everything except for '0', 'false' and '' returns true. In strict mode only '1' and 'true' return true.
   */
  toBoolean(input: any, isStrict?: boolean): boolean {
    if (typeof input === 'string') {
      return toBoolean(input, isStrict);
    }

    return !!input;
  }

  /**
   * Convert the input to a date, or null if the input is not a date.
   */
  toDate(input: any): Date {
    if (input instanceof Date) {
      return input;
    }

    return toDate(input);
  }

  /**
   * Convert the input to a float.
   */
  toFloat(input: any): number {
    if (typeof input === 'number') {
      return input;
    }

    return toFloat(input);
  }

  /**
   * Convert the input to an integer, or NaN if the input is not an integer.
   */
  toInt(input: any, radix?: number): number {
    if (typeof input === 'number') {
      return input;
    }

    return toInt(input, radix);
  }

  /**
   * Convert the input to a string.
   */
  toString(input: any): string {
    return String(input);
  }

  /**
   * Trim characters (whitespace by default) from both sides of the input. You can specify chars that should be trimmed.
   */
  trim(str: string, chars?: string[]): string {
    if (typeof str !== 'string') {
      return str;
    }
    return trim(str, chars ? chars.join() : undefined);
  }

  /**
   * Remove characters that do not appear in the whitelist.
   * The characters are used in a RegExp and so you will need to escape some chars, e.g. whitelist(input, '\\[\\]').
   */
  whitelist(str: string, chars: RegExp | string): string {
    if (typeof str !== 'string') {
      return str;
    }
    return whitelist(str, chars as string);
  }

  toUpperCase(str: string): string {
    if (typeof str !== 'string') {
      return str;
    }
    return str.toUpperCase();
  }

  toLowerCase(str: string): string {
    if (typeof str !== 'string') {
      return str;
    }
    return str.toLowerCase();
  }

  private nestedSanitization(value: any): any {
    if (value instanceof Array) {
      value.forEach((subValue: any) => this.sanitize(subValue));
    } else if (value instanceof Set) {
      value.forEach((subValue: any) => this.sanitize(subValue));
    } else if (value instanceof Map) {
      value.forEach((subValue, key) => this.sanitize(subValue));
    } else if (value instanceof Object) {
      this.sanitize(value);
    }

    return value;
  }

  private sanitizeValue(
    value: any,
    object: any,
    metadata: SanitizationMetadata
  ): any {
    switch (metadata.type) {
      case SanitizeTypes.BLACKLIST:
        return this.blacklist(value, metadata.constraints[0]);
      case SanitizeTypes.ESCAPE:
        return this.escape(value);
      case SanitizeTypes.SECURE:
        return this.secure(value);
      case SanitizeTypes.LTRIM:
        return this.ltrim(value, metadata.constraints[0]);
      case SanitizeTypes.NORMALIZE_EMAIL:
        return this.normalizeEmail(value, metadata.constraints[0]);
      case SanitizeTypes.RTRIM:
        return this.rtrim(value, metadata.constraints[0]);
      case SanitizeTypes.STRIP_LOW:
        return this.stripLow(value, metadata.constraints[0]);
      case SanitizeTypes.TO_BOOLEAN:
        return this.toBoolean(value, metadata.constraints[0]);
      case SanitizeTypes.TO_DATE:
        return this.toDate(value);
      case SanitizeTypes.TO_FLOAT:
        return this.toFloat(value);
      case SanitizeTypes.TO_INT:
        return this.toInt(value, metadata.constraints[0]);
      case SanitizeTypes.TO_STRING:
        return this.toString(value);
      case SanitizeTypes.TRIM:
        return this.trim(value, metadata.constraints[0]);
      case SanitizeTypes.WHITELIST:
        return this.whitelist(value, metadata.constraints[0]);
      case SanitizeTypes.TO_LOWER_CASE:
        return this.toLowerCase(value);
      case SanitizeTypes.TO_UPPER_CASE:
        return this.toUpperCase(value);
      case SanitizeTypes.NESTED:
        return this.nestedSanitization(value);
      case SanitizeTypes.CUSTOM_SANITIZATION:
        return this.metadataStorage
          .getTargetSanitizationConstraints(metadata.constraintCls)
          .map((sanitizerMetadata: ConstraintMetadata) => {
            const sanitizationArgs: SanitizationArguments = {
              value,
              object,
              targetName: object.constructor
                ? (object.constructor as any).name
                : undefined,
              property: metadata.propertyName,
              constraints: metadata.constraints
            };

            return [sanitizerMetadata.instance, sanitizationArgs];
          })
          .reduce(
            (
              result,
              [sanitizer, sanitizationArgs]: [
                SanitizerConstraintInterface,
                SanitizationArguments
              ]
            ) => sanitizer.sanitize(result, sanitizationArgs),
            value
          );

      default:
        throw Error(
          `Wrong sanitization type is supplied ${metadata.type} for value ${value}`
        );
    }
  }
}
