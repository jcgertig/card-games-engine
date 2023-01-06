import { isEqual, isUndefined } from 'lodash';

import {
  IBooleanConditional,
  IPureMathConditional,
  IResolveConditional,
  IValueConditional,
} from '../types/conditional';

export const DataValueSymbol = Symbol('_value');

const sum = (val: Array<number>) => val.reduce((sumVal, i) => sumVal + i, 0);

const get = (val: any, keys: Array<string | number>) => {
  let data = val;
  for (const key of keys) {
    const val = data[key];
    if (isUndefined(val)) return undefined;
    data = val;
  }
  return data[DataValueSymbol]; // DataValueSymbol is a key word in the value proxy
};

export function resolveCheck(
  conditional: IResolveConditional,
  baseData: (() => any) | Record<string, unknown>,
  other?: any
): string | boolean | number | any | undefined {
  const data = typeof baseData === 'function' ? baseData() : baseData;
  const filterConditional = (left, right) =>
    (resolveCheck(left, baseData, other) as Array<any>).filter(entry =>
      resolveCheck(right, baseData, entry)
    );

  // check simple pure value first
  if (
    typeof conditional === 'string' ||
    typeof conditional === 'number' ||
    typeof conditional === 'boolean'
  ) {
    return conditional;
  }

  // check if needs to resolve to a value
  if (!isUndefined((conditional as IValueConditional).unit)) {
    const { unit } = conditional as IValueConditional;
    if (unit.length === 0) {
      return other || data;
    }
    return get(other || data, unit) || get(data, unit);
  }

  // check conditions
  if (
    !isUndefined(
      (conditional as IBooleanConditional | IPureMathConditional).condition
    )
  ) {
    conditional = conditional as IBooleanConditional | IPureMathConditional;
    switch (conditional.condition) {
      case 'and':
        for (const condition of conditional.right) {
          if (!resolveCheck(condition, baseData, other)) {
            return false;
          }
        }
        return true;
      case 'or':
        for (const condition of conditional.right) {
          if (resolveCheck(condition, baseData, other)) {
            return true;
          }
        }
        return false;
      case 'if':
        if (resolveCheck(conditional.left, baseData, other)) {
          return resolveCheck(conditional.right.then, baseData, other);
        }
        return typeof conditional.right.else !== 'undefined'
          ? resolveCheck(conditional.right.else, baseData, other)
          : true;
      case '=':
        return isEqual(
          resolveCheck(conditional.left, baseData, other),
          resolveCheck(conditional.right, baseData, other)
        );
      case '!=':
        return !isEqual(
          resolveCheck(conditional.left, baseData, other),
          resolveCheck(conditional.right, baseData, other)
        );
      case '>':
        return (
          resolveCheck(conditional.left, baseData, other)! >
          resolveCheck(conditional.right, baseData, other)!
        );
      case '>=':
        return (
          resolveCheck(conditional.left, baseData, other)! >=
          resolveCheck(conditional.right, baseData, other)!
        );
      case '<':
        return (
          resolveCheck(conditional.left, baseData, other)! <
          resolveCheck(conditional.right, baseData, other)!
        );
      case '<=':
        return (
          resolveCheck(conditional.left, baseData, other)! <=
          resolveCheck(conditional.right, baseData, other)!
        );
      case 'any >': {
        const rightValue = resolveCheck(
          conditional.right,
          baseData,
          other
        ) as number;
        return (
          resolveCheck(conditional.left, baseData, other) as Array<number>
        ).some(leftVal => leftVal > rightValue);
      }
      case 'any >=': {
        const rightValue = resolveCheck(
          conditional.right,
          data,
          other
        ) as number;
        return (
          resolveCheck(conditional.left, baseData, other) as Array<number>
        ).some(leftVal => leftVal >= rightValue);
      }
      case 'any <': {
        const rightValue = resolveCheck(
          conditional.right,
          baseData,
          other
        ) as number;
        return (
          resolveCheck(conditional.left, baseData, other) as Array<number>
        ).some(leftVal => leftVal < rightValue);
      }
      case 'any <=': {
        const rightValue = resolveCheck(
          conditional.right,
          baseData,
          other
        ) as number;
        return (
          resolveCheck(conditional.left, baseData, other) as Array<number>
        ).some(leftVal => leftVal <= rightValue);
      }
      case 'contains':
        return (
          resolveCheck(conditional.left as any, baseData, other) as Array<any>
        ).includes(resolveCheck(conditional.right, baseData, other));
      case 'not contains':
        return !(
          resolveCheck(conditional.left as any, baseData, other) as Array<any>
        ).includes(resolveCheck(conditional.right, baseData, other));
      case 'least of':
        return (
          (resolveCheck(conditional.left, baseData, other) as number) <=
          Math.min(
            ...(resolveCheck(
              conditional.right as any,
              baseData,
              other
            ) as Array<number>)
          )
        );
      case 'greatest of':
        return (
          (resolveCheck(conditional.left, baseData, other) as number) >=
          Math.max(
            ...(resolveCheck(
              conditional.right as any,
              baseData,
              other
            ) as Array<number>)
          )
        );
      case '+':
        return (
          (resolveCheck(conditional.left, baseData, other)! as number) +
          (resolveCheck(conditional.right, baseData, other)! as number)
        );
      case '-':
        return (
          resolveCheck(conditional.left, baseData, other)! -
          resolveCheck(conditional.right, baseData, other)!
        );
      case '*':
        return (
          resolveCheck(conditional.left, baseData, other)! *
          resolveCheck(conditional.right, baseData, other)!
        );
      case '/':
        return (
          resolveCheck(conditional.left, baseData, other)! /
          resolveCheck(conditional.right, baseData, other)!
        );
      case 'sum':
        return sum(resolveCheck(conditional.right as any, baseData, other));
      case 'avg': {
        const list: Array<number> = resolveCheck(
          conditional.right as any,
          baseData,
          other
        );
        return sum(list) / list.length;
      }
      case 'min': {
        const list: Array<number> = resolveCheck(
          conditional.right as any,
          baseData,
          other
        );
        return Math.min(...list);
      }
      case 'max': {
        const list: Array<number> = resolveCheck(
          conditional.right as any,
          baseData,
          other
        );
        return Math.max(...list);
      }
      case 'abs': {
        const value: number = resolveCheck(
          conditional.right as any,
          baseData,
          other
        );
        return Math.abs(value);
      }
      case 'floor': {
        const value: number = resolveCheck(
          conditional.right as any,
          baseData,
          other
        );
        return Math.floor(value);
      }
      case 'ceil': {
        const value: number = resolveCheck(
          conditional.right as any,
          baseData,
          other
        );
        return Math.ceil(value);
      }
      case 'count': {
        const value: Array<any> = resolveCheck(
          conditional.right as any,
          baseData,
          other
        );
        return value.length;
      }
      case 'first': {
        const value: Array<any> = resolveCheck(
          conditional.right as any,
          baseData,
          other
        );
        return value[0];
      }
      case 'last': {
        const value: Array<any> = resolveCheck(
          conditional.right as any,
          baseData,
          other
        );
        return value.length > 0 ? value[value.length - 1] : undefined;
      }
      case 'value if':
        if (resolveCheck(conditional.left, baseData, other)) {
          return resolveCheck(conditional.right.then, baseData, other);
        }
        return resolveCheck(conditional.right.else, baseData, other);
      case 'filter':
        return filterConditional(conditional.left, conditional.right);

      default:
        throw new Error(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `unknown condition ${(conditional as unknown as any).condition}`
        );
    }
  }

  // complex value non conditional return
  return conditional as any;
}
