import { MetadataStorage } from '../metadata/MetadataStorage';
import { SanitizeTypes } from '../sanitazion/SanitizeTypes';
import { SanitizationOptions } from './SanitizationOptions';
import { getFromContainer } from '../container';
import { ConstraintMetadata } from '../metadata/ConstraintMetadata';
import { SanitizationMetadata } from '../metadata/SanitizationMetadata';

// tslint:disable function-name

/**
 * Decorator used to register custom sanitizer.
 */
export function SanitizerConstraint(options?: {
  name?: string;
  async?: boolean;
}) {
  return (target: Function) => {
    const isAsync = options && options.async;
    let name = options && options.name ? options.name : (target as any).name;
    if (!name) {
      name = name
        .replace(
          /\.?([A-Z]+)/g,
          (x: string, y: string) => '_' + y.toLowerCase()
        )
        .replace(/^_/, '');
    }
    const metadata = new ConstraintMetadata(target, name, isAsync);
    getFromContainer(MetadataStorage).addConstraintMetadata(metadata);
  };
}

/**
 * Performs sanitization based on the given custom constraint.
 */
export function Sanitize(
  constraintCls: Function,
  sanitizationOptions?: SanitizationOptions
): Function;
export function Sanitize(
  constraintCls: Function,
  constraints?: any[],
  validationOptions?: SanitizationOptions
): Function;
export function Sanitize(
  constraintCls: Function,
  constraintsOrSanitizationOptions?: any[] | SanitizationOptions,
  maybeSanitizationOptions?: SanitizationOptions
): Function {
  return (object: object, propertyName: string) => {
    const args = {
      type: SanitizeTypes.CUSTOM_SANITIZATION,
      target: object.constructor,
      propertyName,
      constraintCls,
      constraints:
        constraintsOrSanitizationOptions instanceof Array
          ? (constraintsOrSanitizationOptions as any[])
          : undefined,
      sanitizationOptions: !(constraintsOrSanitizationOptions instanceof Array)
        ? (constraintsOrSanitizationOptions as SanitizationOptions)
        : maybeSanitizationOptions
    };
    return getFromContainer(MetadataStorage).addSanitizationMetadata(
      new SanitizationMetadata(args)
    );
  };
}

/**
 * Remove characters that appear in the blacklist. The characters are used in a RegExp and so you will need to
 * escape some chars, e.g @Blacklist('\\[\\]')
 */
export function Blacklist(
  chars: RegExp,
  annotationOptions?: SanitizationOptions
) {
  return (object: object, propertyName: string) => {
    const args = {
      type: SanitizeTypes.BLACKLIST,
      target: object.constructor,
      propertyName,
      constraints: [chars],
      sanitizationOptions: annotationOptions
    };
    return getFromContainer(MetadataStorage).addSanitizationMetadata(
      new SanitizationMetadata(args)
    );
  };
}

/**
 * Replace <, >, &, ', " and / with HTML entities.
 */
export function Escape(annotationOptions?: SanitizationOptions) {
  return (object: object, propertyName: string) => {
    const args = {
      type: SanitizeTypes.ESCAPE,
      target: object.constructor,
      propertyName,
      sanitizationOptions: annotationOptions
    };
    return getFromContainer(MetadataStorage).addSanitizationMetadata(
      new SanitizationMetadata(args)
    );
  };
}

/**
 * Trim characters from the left-side of the input.
 */
export function Ltrim(
  chars?: string[],
  annotationOptions?: SanitizationOptions
) {
  return (object: object, propertyName: string) => {
    const args = {
      type: SanitizeTypes.LTRIM,
      target: object.constructor,
      propertyName,
      constraints: [chars],
      sanitizationOptions: annotationOptions
    };
    return getFromContainer(MetadataStorage).addSanitizationMetadata(
      new SanitizationMetadata(args)
    );
  };
}

/**
 * Canonicalize an email address.
 */
export function NormalizeEmail(
  lowercase?: boolean,
  annotationOptions?: SanitizationOptions
) {
  return (object: object, propertyName: string) => {
    const args = {
      type: SanitizeTypes.NORMALIZE_EMAIL,
      target: object.constructor,
      propertyName,
      constraints: [lowercase],
      sanitizationOptions: annotationOptions
    };
    return getFromContainer(MetadataStorage).addSanitizationMetadata(
      new SanitizationMetadata(args)
    );
  };
}

/**
 * Trim characters from the right-side of the input.
 */
export function Rtrim(
  chars?: string[],
  annotationOptions?: SanitizationOptions
) {
  return (object: object, propertyName: string) => {
    const args = {
      type: SanitizeTypes.RTRIM,
      target: object.constructor,
      propertyName,
      constraints: [chars],
      sanitizationOptions: annotationOptions
    };
    return getFromContainer(MetadataStorage).addSanitizationMetadata(
      new SanitizationMetadata(args)
    );
  };
}

/**
 * Remove characters with a numerical value < 32 and 127, mostly control characters.
 * If keepNewLines is true, newline characters are preserved (\n and \r, hex 0xA and 0xD).
 * Unicode-safe in JavaScript.
 */
export function StripLow(
  keepNewLines?: boolean,
  annotationOptions?: SanitizationOptions
) {
  return (object: object, propertyName: string) => {
    const args = {
      type: SanitizeTypes.STRIP_LOW,
      target: object.constructor,
      propertyName,
      constraints: [keepNewLines],
      sanitizationOptions: annotationOptions
    };
    return getFromContainer(MetadataStorage).addSanitizationMetadata(
      new SanitizationMetadata(args)
    );
  };
}

/**
 * Convert the input to a boolean.
 * Everything except for '0', 'false' and '' returns true. In strict mode only '1' and 'true' return true.
 */
export function ToBoolean(
  isStrict?: boolean,
  annotationOptions?: SanitizationOptions
) {
  return (object: object, propertyName: string) => {
    const args = {
      type: SanitizeTypes.TO_BOOLEAN,
      target: object.constructor,
      propertyName,
      constraints: [isStrict],
      sanitizationOptions: annotationOptions
    };
    return getFromContainer(MetadataStorage).addSanitizationMetadata(
      new SanitizationMetadata(args)
    );
  };
}

/**
 * Convert the input to a date, or null if the input is not a date.
 */
export function ToDate(annotationOptions?: SanitizationOptions) {
  return (object: object, propertyName: string) => {
    const args = {
      type: SanitizeTypes.TO_DATE,
      target: object.constructor,
      propertyName,
      sanitizationOptions: annotationOptions
    };
    return getFromContainer(MetadataStorage).addSanitizationMetadata(
      new SanitizationMetadata(args)
    );
  };
}

/**
 * Convert the input to a float.
 */
export function ToFloat(annotationOptions?: SanitizationOptions) {
  return (object: object, propertyName: string) => {
    const args = {
      type: SanitizeTypes.TO_FLOAT,
      target: object.constructor,
      propertyName,
      sanitizationOptions: annotationOptions
    };
    return getFromContainer(MetadataStorage).addSanitizationMetadata(
      new SanitizationMetadata(args)
    );
  };
}

/**
 * Convert the input to an integer, or NaN if the input is not an integer.
 */
export function ToInt(radix?: number, annotationOptions?: SanitizationOptions) {
  return (object: object, propertyName: string) => {
    const args = {
      type: SanitizeTypes.TO_INT,
      target: object.constructor,
      propertyName,
      constraints: [radix],
      sanitizationOptions: annotationOptions
    };
    return getFromContainer(MetadataStorage).addSanitizationMetadata(
      new SanitizationMetadata(args)
    );
  };
}

/**
 * Convert the input to a string.
 */
export function ToString(annotationOptions?: SanitizationOptions) {
  return (object: object, propertyName: string) => {
    const args = {
      type: SanitizeTypes.TO_STRING,
      target: object.constructor,
      propertyName,
      sanitizationOptions: annotationOptions
    };
    return getFromContainer(MetadataStorage).addSanitizationMetadata(
      new SanitizationMetadata(args)
    );
  };
}

/**
 * Trim characters (whitespace by default) from both sides of the input. You can specify chars that should be trimmed.
 */
export function Trim(
  chars?: string[],
  annotationOptions?: SanitizationOptions
) {
  return (object: object, propertyName: string) => {
    const args = {
      type: SanitizeTypes.TRIM,
      target: object.constructor,
      propertyName,
      constraints: [chars],
      sanitizationOptions: annotationOptions
    };
    return getFromContainer(MetadataStorage).addSanitizationMetadata(
      new SanitizationMetadata(args)
    );
  };
}

/**
 * Remove characters that do not appear in the whitelist.
 * The characters are used in a RegExp and so you will need to escape some chars, e.g. whitelist(input, '\\[\\]').
 */
export function Whitelist(
  chars: RegExp,
  annotationOptions?: SanitizationOptions
) {
  return (object: object, propertyName: string) => {
    const args = {
      type: SanitizeTypes.WHITELIST,
      target: object.constructor,
      propertyName,
      constraints: [chars],
      sanitizationOptions: annotationOptions
    };
    return getFromContainer(MetadataStorage).addSanitizationMetadata(
      new SanitizationMetadata(args)
    );
  };
}

export function ToLowerCase(annotationOptions?: SanitizationOptions) {
  return (object: object, propertyName: string) => {
    const args = {
      type: SanitizeTypes.TO_LOWER_CASE,
      target: object.constructor,
      propertyName,
      sanitizationOptions: annotationOptions
    };
    return getFromContainer(MetadataStorage).addSanitizationMetadata(
      new SanitizationMetadata(args)
    );
  };
}

export function ToUpperCase(annotationOptions?: SanitizationOptions) {
  return (object: object, propertyName: string) => {
    const args = {
      type: SanitizeTypes.TO_UPPER_CASE,
      target: object.constructor,
      propertyName,
      sanitizationOptions: annotationOptions
    };
    return getFromContainer(MetadataStorage).addSanitizationMetadata(
      new SanitizationMetadata(args)
    );
  };
}

/**
 * Indicates if nested object should be sanitized as well.
 */
export function SanitizeNested(annotationOptions?: SanitizationOptions) {
  return (object: object, propertyName: string) => {
    const args = {
      type: SanitizeTypes.NESTED,
      target: object.constructor,
      propertyName,
      sanitizationOptions: annotationOptions
    };
    return getFromContainer(MetadataStorage).addSanitizationMetadata(
      new SanitizationMetadata(args)
    );
  };
}
