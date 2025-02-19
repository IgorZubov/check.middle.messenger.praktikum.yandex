import { expect } from "chai";
import { merge } from "./merge";

describe("merge function", () => {
  it("объединяет 2 объекта", () => {
    const lhs = { a: 1, b: 2 };
    const rhs = { b: 3, c: 4 };

    const result = merge(lhs, rhs);

    expect(result).to.deep.equal({ a: 1, b: 3, c: 4 });
  });

  it("объединяет вложенные объекты", () => {
    const lhs = { a: 1, b: { x: 10, y: 20 } };
    const rhs = { b: { y: 30, z: 40 }, c: 4 };

    const result = merge(lhs, rhs);

    expect(result).to.deep.equal({
      a: 1,
      b: { x: 10, y: 30, z: 40 },
      c: 4,
    });
  });

  it("переопределяет значения из левой части в правую", () => {
    const lhs = { a: 1, b: 2 };
    const rhs = { a: 3, b: 4 };

    const result = merge(lhs, rhs);

    expect(result).to.deep.equal({ a: 3, b: 4 });
  });

  it("обрабатывает пустой объект", () => {
    const lhs = {};
    const rhs = { a: 1, b: 2 };

    const result = merge(lhs, rhs);

    expect(result).to.deep.equal({ a: 1, b: 2 });
  });

  it("возвращает левую часть, когда правая пустая", () => {
    const lhs = { a: 1, b: 2 };
    const rhs = {};

    const result = merge(lhs, rhs);

    expect(result).to.deep.equal({ a: 1, b: 2 });
  });

  it("не изменяет левую часть, когда правая undefined", () => {
    const lhs = { a: 1, b: 2 };
    const rhs = undefined;

    const result = merge(lhs, rhs);

    expect(result).to.deep.equal({ a: 1, b: 2 });
  });
});
