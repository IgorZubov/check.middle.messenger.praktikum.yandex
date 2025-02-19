export function cloneDeep<T extends object = object>(obj: T): T {
  // Проверка на null и не объект
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Если это массив, создаем новый массив и рекурсивно копируем его элементы
  if (Array.isArray(obj)) {
    const copy: any[] = [];
    for (const item of obj) {
      copy.push(cloneDeep(item));
    }
    return copy as T;
  }

  // Если это объект, создаем новый объект и рекурсивно копируем его ключи и значения
  const copy: { [key: string]: any } = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = cloneDeep((obj as any)[key]);
    }
  }

  return copy as T;
}
