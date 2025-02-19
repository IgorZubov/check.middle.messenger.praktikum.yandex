function omit<T extends object>(obj: T, fields: (keyof T)[]): Omit<T, typeof fields[0]> {
  // Хорошо бы cloneDeep юзать
  const shallowCopy = {
      ...obj,
  };
  // Можно range через Array или отдельную реализацию
  for (let i = 0; i < fields.length; i++) {
      const key = fields[i];
      delete shallowCopy[key];
  }
  return shallowCopy;
}

export default omit;
