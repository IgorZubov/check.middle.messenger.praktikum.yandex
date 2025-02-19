import { Indexed } from "../types/Indexed.t";
import { merge } from "./merge";

export function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {
  // Проверяем, что path — строка
  if (typeof path !== 'string') {
    throw new Error('path must be string');
  }

  // Если object не объект (и не null), возвращаем его без изменений
  if (typeof object !== 'object' || object === null) {
    return object;
  }

  const result = path.split('.').reduceRight<Indexed>((acc, key) => ({
    [key]: acc,
  }), value as any);
  return merge(object as Indexed, result);
}
