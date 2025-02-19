export const getProxyOptions = (): ProxyHandler<object> => ({
    get(target: { [index: string]: unknown }, prop: string): unknown {
        if (prop.startsWith('_')) {
            throw new Error('Нет прав');
        } else {
            const value = target[prop];
            return typeof value === 'function' ? value.bind(target) : value;
        }
    },

    set(target: { [index: string]: unknown }, prop: string, value: unknown): boolean {
        if (prop.startsWith('_')) {
            throw new Error('Нет прав');
        } else {
            target[prop] = value;

            return true;
        }
    },

    deleteProperty(target: { [index: string]: unknown }, prop: string): boolean {
        if (prop.startsWith('_')) {
            throw new Error('Нет прав');
        } else {
            delete target[prop];
            return true;
        }
    },
});
