// Утилита для объединения имён классов
function classNames(...args: unknown[]): string {
  const result: string[] = [];

  const process = (item: unknown): void => {
      if (!item) return; // Пропускаем значения вроде null, undefined, false, 0

      if (typeof item === "string" || (typeof item === "number" && item !== 0)) {
          result.push(String(item)); // Добавляем строку или число
      } else if (Array.isArray(item)) {
          for (const el of item) {
              process(el); // Рекурсивно обрабатываем элементы массива
          }
      } else if (typeof item === "object") {
          for (const key in item as Record<string, boolean>) {
              if ((item as Record<string, boolean>)[key]) {
                  result.push(key); // Добавляем ключи с truthy-значениями
              }
          }
      }
  };

  for (const arg of args) {
      process(arg);
  }

  return result.join(" "); // Возвращаем итоговую строку
}

export default classNames;
