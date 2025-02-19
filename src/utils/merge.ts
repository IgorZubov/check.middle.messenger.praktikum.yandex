import { Indexed } from "../types/Indexed.t";

export function merge(lhs: Indexed, rhs: Indexed): Indexed {
  // Проходим по ключам правого объекта (rhs)
  for (const key in rhs) {
    if (rhs.hasOwnProperty(key)) {
      // Если значение по ключу - объект и в lhs оно тоже объект, то рекурсивно объединяем
      if (
        typeof rhs[key] === 'object' &&
        rhs[key] !== null &&
        typeof lhs[key] === 'object' &&
        lhs[key] !== null
      ) {
        lhs[key] = merge(lhs[key] as Indexed, rhs[key] as Indexed);
      } else {
        // В противном случае, просто присваиваем значение из rhs
        lhs[key] = rhs[key];
      }
    }
  }

  return lhs;
}

// merge({a: {b: {a: 2}}, d: 5}, {a: {b: {c: 1}}});
/*
{
	a: {
		b: {
			a: 2,
			c: 1,
		}
	},
	d: 5,
}
*/
