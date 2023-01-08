import { Int } from "../types";

/**
 * rational fraction
 */
export class Rational {
  constructor(public x: Int = 0, public y: Int = 1) {}

  set(value: Int): this {
    this.x = value;
    this.y = 1;
    return this;
  }

  toString(): string {
    const { x, y } = this;
    return y === 1 ? String(x) : `${x}/${y}`;
  }

  copy(): Rational {
    return new Rational(this.x, this.y);
  }

  isZero(): boolean {
    return this.x === 0;
  }

  absLess(other: Rational): boolean {
    // Числитель каждой дроби домножаем на знаменатель другой, чтобы привести обе дроби к общему знаменателю.
    return Math.abs(this.x) * other.y < Math.abs(other.x) * this.y;
  }

  sign(): -1 | 0 | 1 {
    if (this.x < 0) return -1;
    if (this.x > 0) return 1;
    return 0;
  }

  negx(): Rational {
    return new Rational(-this.x, this.y);
  }

  absx(): Rational {
    return new Rational(Math.abs(this.x), this.y);
  }

  norm(): this {
    if (this.y < 0) {
      this.x = -this.x;
      this.y = -this.y;
    }
    if (this.x === 0) {
      this.y = 1;
    } else if (this.x < 1 || this.x > 1) {
      const m = calcAbsMCD(this.x, this.y);
      this.x /= m;
      this.y /= m;
    }
    return this;
  }

  addi(v: Int | Rational): this {
    if (typeof v === "number") {
      // целое число
      this.x += v * this.y; // v домножается на знаменатель
    } else {
      // дробь
      if (this.y === v.y) {
        // Если дроби имеют одинаковый знаменатель, то можно просто сложить числители
        this.x += v.x;
      } else {
        // Для приведения к общему знаменателю домножаем числители на чужие знаменатели. А знаменатели друг на друга
        this.x = this.x * v.y + v.x * this.y;
        this.y *= v.y;
      }
      this.norm();
    }
    return this;
  }

  addx(v: Int | Rational): Rational {
    return typeof v === "number"
      ? new Rational(this.x + v * this.y, this.y)
      : this.copy().addi(v);
  }

  subi(a: Rational): this {
    // вариант вычитания числа из дроби не нужен.
    return this.addi(a.negx());
  }

  subx(a: Rational) {
    // вариант вычитания числа из дроби не нужен.
    return a.negx().addi(this);
  }

  // Умножение на целое число / Умножение на дробь
  muli(v: Int | Rational): this {
    if (typeof v === "number") {
      this.x *= v; // при домножении дроби на число меняется только числитель
    } else {
      this.x *= v.x;
      this.y *= v.y;
    }
    return this.norm();
  }

  mulx(v: Int | Rational): Rational {
    if (typeof v === "number") {
      // при домножении дроби на число меняется только числитель
      return new Rational(this.x * v, this.y).norm();
    }
    const r = new Rational(this.x * v.x, this.y * v.y);
    return r.norm();
  }

  // Деление на дробь
  divi(a: Rational): this {
    // Деление = умножение на перевёрнутую дробь
    const { x, y } = a;
    this.x *= y;
    this.y *= x;
    return this.norm();
  }

  divx(a: Rational): Rational {
    // Деление = умножение на перевёрнутую дробь
    const r = new Rational(this.x * a.y, this.y * a.x);
    return r.norm();
  }
}

/**
 * Вычисление наибольшего общего делителя для двух чисел. Знак не имеет значения.
 * @param a
 * @param b
 * @return {number}
 */
export const calcAbsMCD = (a: Int, b: Int): Int => {
  // Минимальное значение (без учёта знака)
  let m = Math.min(Math.abs(a), Math.abs(b));
  while (m > 1) {
    if (a % m === 0 && b % m === 0) break;
    m--;
  }
  return m;
};
