import { Indexed } from '.';

const isObjectOrArray = (value: unknown): value is Indexed | unknown[] => {
    return isObject(value) || isArray(value);
};

const isObject = (value: unknown): value is Indexed => {
    return (
        typeof value === 'object' &&
        value !== null &&
        value.constructor === Object &&
        Object.prototype.toString.call(value) === '[object Object]'
    );
};

const isArray = (value: unknown): value is [] => {
    return Array.isArray(value);
};

export { isObjectOrArray, isObject, isArray };
