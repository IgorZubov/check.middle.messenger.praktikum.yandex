// Тип Indexed: описывает объект с ключами типа string и значениями типа T (по умолчанию T = unknown).

export type Indexed<T = unknown> = {
  [key in string]: T;
};
