//src/common/utils/validation.util.ts

export const isEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isPhoneNumber = (value: string): boolean =>
  /^(\+593|0)[0-9]{9}$/.test(value);
