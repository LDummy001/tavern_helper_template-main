export class Registry<T> {
  private registry: Map<string, T> = new Map();

  public register(key: string, value: T): void {
    this.registry.set(key, value);
  }

  public get(key: string): T | undefined {
    return this.registry.get(key);
  }

  public getAll(): Map<string, T> {
    return this.registry;
  }

  public has(key: string): boolean {
    return this.registry.has(key);
  }
}
