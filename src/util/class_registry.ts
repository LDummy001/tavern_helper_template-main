type Class = { name: string };

export class ClassRegistry<T extends Class> {
  private registry: Map<string, T> = new Map();

  public register(key?: string) {
    return (cls: T) => {
      if (!key) key = cls.name;
      this.registry.set(key, cls);
      return cls as any;
    };
  }

  public get(key: string) {
    return this.registry.get(key);
  }

  public getAll() {
    return this.registry;
  }

  public has(key: string): boolean {
    return this.registry.has(key);
  }
}
