import { SanitizationMetadata } from './SanitizationMetadata';
import { ConstraintMetadata } from './ConstraintMetadata';

export class MetadataStorage {
  private sanitizationMetadata: SanitizationMetadata[] = [];
  private constraintMetadata: ConstraintMetadata[] = [];

  get hasSanitizationMetadata() {
    return !!this.sanitizationMetadata.length;
  }

  addSanitizationMetadata(metadata: SanitizationMetadata) {
    this.sanitizationMetadata.push(metadata);
  }

  addConstraintMetadata(metadata: ConstraintMetadata) {
    this.constraintMetadata.push(metadata);
  }

  groupByPropertyName(
    metadata: SanitizationMetadata[]
  ): { [propertyName: string]: SanitizationMetadata[] } {
    const grouped: { [propertyName: string]: SanitizationMetadata[] } = {};
    metadata.forEach((item) => {
      if (!grouped[item.propertyName]) {
        grouped[item.propertyName] = [];
      }
      grouped[item.propertyName].push(item);
    });
    return grouped;
  }

  getTargetSanitizationMetadata(
    targetConstructor: Function
  ): SanitizationMetadata[] {
    const originalMetadata = this.sanitizationMetadata.filter(
      (metadata) => metadata.target === targetConstructor
    );

    const inheritedMetadata = this.sanitizationMetadata.filter((metadata) => {
      if (typeof metadata.target === 'string') {
        return false;
      }
      if (metadata.target === targetConstructor) {
        return false;
      }
      return (
        targetConstructor.prototype instanceof (metadata.target as Function) ||
        !(metadata.target instanceof Function)
      );
    });

    const uniqueInheritedMetadata = inheritedMetadata.filter(
      (item) =>
        !originalMetadata.find(
          (originalMeta) =>
            originalMeta.propertyName === item.propertyName &&
            originalMeta.type === item.type
        )
    );

    return originalMetadata.concat(uniqueInheritedMetadata);
  }

  getTargetSanitizationConstraints(target: Function): ConstraintMetadata[] {
    return this.constraintMetadata.filter(
      (metadata) => metadata.target === target
    );
  }
}
