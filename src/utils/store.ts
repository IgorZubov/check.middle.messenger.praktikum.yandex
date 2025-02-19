const LOCAL = {
    getItem: <T>(key: string): T | null => {
        const item = localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : null;
    },
    setItem: <T>(key: string, item: T) => localStorage.setItem(key, JSON.stringify(item)),
    removeItem: (key: string) => localStorage.removeItem(key),
};

export { LOCAL };
