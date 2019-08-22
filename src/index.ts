import { Sanitizer } from './sanitazion/Sanitizer';
import { getFromContainer } from './container';

export * from './container';
export * from './decorator/decorators';
export * from './decorator/SanitizationOptions';
export * from './sanitazion/SanitizationArguments';
export * from './sanitazion/SanitizeTypes';
export * from './sanitazion/Sanitizer';
export * from './sanitazion/SanitizerConstraintInterface';
export * from './sanitazion/SanitizerInterface';
export * from './metadata/MetadataStorage';

export function sanitize(object: any) {
  getFromContainer(Sanitizer).sanitize(object);
}

export async function sanitizeAsync(object: any) {
  await getFromContainer(Sanitizer).sanitizeAsync(object);
}
