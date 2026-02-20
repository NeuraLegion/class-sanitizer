/**
 * Container options.
 */
export interface UseContainerOptions {
  /**
   * If set to true, then default container will be used in the case if given container haven't returned anything.
   */
  fallback?: boolean;

  /**
   * If set to true, then default container will be used in the case if given container thrown an exception.
   */
  fallbackOnErrors?: boolean;
}

/**
 * Type or class.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type Type<T = any> = (new (...args: unknown[]) => T) | Function;

/**
 * Container.
 */
export interface Container {
  get<T>(someClass: Type<T>): T;
}

/**
 * Container to be used by this library for inversion control. If container was not implicitly set then by default
 * container simply creates a new instance of the given class.
 */
const defaultContainer: Container = new (class implements Container {
  private instances: { type: unknown; object: any }[] = [];

  public get<T>(someClass: Type<T>): T {
    let instance = this.instances.find(item => item.type === someClass);
    if (!instance) {
      instance = { type: someClass, object: new (someClass as any)() };
      this.instances.push(instance);
    }

    return instance.object;
  }
})();

let userContainer!: Container;
let userContainerOptions: UseContainerOptions | undefined;

/**
 * Sets container to be used by this library.
 */
export const useContainer = (
  iocContainer: Container,
  options?: UseContainerOptions
): void => {
  userContainer = iocContainer;
  userContainerOptions = options;
};

/**
 * Gets the IOC container used by this library.
 */
export const getFromContainer = <T>(someClass: Type<T>): T => {
  try {
    if (userContainer) {
      const instance = userContainer.get(someClass);

      // eslint-disable-next-line max-depth
      if (instance) {
        return instance;
      }

      // eslint-disable-next-line max-depth
      if (!userContainerOptions || !userContainerOptions.fallback) {
        return instance;
      }
    }
  } catch (error) {
    if (!userContainerOptions || !userContainerOptions.fallbackOnErrors) {
      throw error;
    }
  }

  return defaultContainer.get<T>(someClass);
};
