const formatChatsDate = (str?: string) => {
    if (!str) {
        return '';
    }

    const date = new Date(str);
    const dateNow = new Date();
    const day = 24 * 60 * 60 * 1000;
    const week = 7 * day;
    const dateDiff = dateNow.getTime() - date.getTime();

    if (!date) {
        return '';
    }

    if (dateDiff < day) {
        const time = date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return time;
    }
    if (dateDiff > day && dateDiff < week) {
        const weekday = date.toLocaleDateString('ru-RU', {
            weekday: 'short',
        });
        return weekday;
    }

    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatTime = (time: string) => {
    const result = new Date(time).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return result || '';
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU');
};

const isToday = (date: string, isLocaledFormatted = false) => {
    const currentDate = new Date().toLocaleDateString('ru-RU');
    const externalDate = new Date(date).toLocaleDateString('ru-RU');
    if (isLocaledFormatted) {
        return currentDate === date;
    }
    return currentDate === externalDate;
};

const isYesterday = (date: string, isLocaledFormatted = false) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    const externalDate = new Date(date).toLocaleDateString('ru-RU');
    if (isLocaledFormatted) {
        return currentDate.toLocaleDateString('ru-RU') === date;
    }
    return currentDate.toLocaleDateString('ru-RU') === externalDate;
};

export { formatChatsDate, formatTime, formatDate, isToday, isYesterday };
