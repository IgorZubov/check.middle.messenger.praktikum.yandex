const isArray = (value: unknown): value is [] => Array.isArray(value);

export type PlainObject<T = unknown> = {
  [k in string]: T;
};

const isPlainObject = (value: unknown): value is PlainObject =>
  typeof value === "object" && value !== null && value.constructor === Object && Object.prototype.toString.call(value) === "[object Object]";

const isArrayOrObject = (value: unknown): value is [] | PlainObject => isPlainObject(value) || isArray(value);

export const isEqual = (lhs: PlainObject, rhs: PlainObject) => {
  if (Object.keys(lhs).length !== Object.keys(rhs).length) {
    return false;
  }

  for (const [key, value] of Object.entries(lhs)) {
    const rightValue = rhs[key];
    if (isArrayOrObject(value) && isArrayOrObject(rightValue)) {
      if (isEqual(value as PlainObject, rightValue as PlainObject)) {
        continue;
      }
      return false;
    }

    if (value !== rightValue) {
      return false;
    }
  }

  return true;
};
