import { Big } from 'big.js';

export function divide(valueA: number, valueB: number): number {
  return new Big(valueA).div(valueB).toNumber();
}

export function toExponential(value: number, exponential: number): string {
  return new Big(value).toExponential(exponential, 0);
}

export function toFixed(value: number, decimals: number): string {
  return new Big(value).toFixed(decimals);
}

export function truncateNumber(value: number): string {
  if (value < 1e6) {
    return `${value}`;
  }
  if (value < 1e9) {
    return `${toFixed(divide(value, 1e6), 2)}M`;
  }
  if (value < 1e12) {
    return `${toFixed(divide(value, 1e9), 2)}B`;
  }
  if (value < 1e15) {
    return `${toFixed(divide(value, 1e12), 2)}T`;
  }
  if (value < 1e18) {
    return `${toFixed(divide(value, 1e15), 2)}Q`;
  }
  if (value < 1e21) {
    return `${toFixed(divide(value, 1e18), 2)}QQ`;
  }
  if (value < 1e24) {
    return `${toFixed(divide(value, 1e21), 2)}QQQ`;
  }
  return toExponential(value, 2);
}
