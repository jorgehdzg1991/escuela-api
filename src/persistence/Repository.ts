export default interface Repository<T> {
  create(entity: T): Promise<T>;

  update(entity: T): Promise<T>;

  delete(entity: T): Promise<void>;

  get(): Promise<T[]>;

  getById(identifier: string): Promise<T | null>;
}
