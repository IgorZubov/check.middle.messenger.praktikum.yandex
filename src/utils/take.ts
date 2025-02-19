// Функция, которая создаёт часть массива с n элементами, взятыми с начала.
// В случае ошибки — выбросит исключение ValidationError: bad value

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function take<T>(list: T[], num: number = 1): T[] {
  // Валидация входных значений
  if (
    !Array.isArray(list) ||
    typeof num !== "number" ||
    num < 0 ||
    !Number.isInteger(num)
  ) {
    throw new ValidationError("bad value");
  }

  // Возвращаем срез массива
  return list.slice(0, num);
}

export default take;
