export const uppercase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
export const firstCharUpper = (str: string) => str.charAt(0).toUpperCase();

export const validateWithMessage = (value: string | File, regexp: RegExp, errText: string) => {
    if (typeof value === 'string') {
        const isValid = regexp.test(value);
        return isValid ? isValid : errText;
    }

    return true;
};

export const validate = (rules: Record<string, string | true>) => {
    return Object.values(rules).every((validate) => validate === true);
};

export const queryStringify = (data: unknown) => {
    if (!data || typeof data !== 'object') {
        throw new Error('Data must be object');
    }

    const keys = Object.keys(data);
    return keys.reduce((result, key, index) => {
        const param = (data as Record<string, string>)[key];
        const appendSymbol = `${index < keys.length - 1 ? '&' : ''}`;
        return `${result}${key}=${param}${appendSymbol}`;
    }, '?');
};

export const isEqual = (lstr: string, rstr: string) => lstr === rstr;

export const toFormData = (form: Record<string, unknown>) => {
    const formData = new FormData();

    for (const key in form) {
        formData.append(key, `${form[key]}`);
    }

    return formData;
};
