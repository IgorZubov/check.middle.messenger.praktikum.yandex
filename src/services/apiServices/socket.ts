export const initSocket = () => {
    const baseUrl = 'wss://ya-praktikum.tech/api/v2/';
    const socket = new WebSocket(baseUrl);

    const onOpen = () => {
        console.log('onOpenSocket');
    };

    socket.addEventListener('open', onOpen); // соединение установлено
    // socket.addEventListener('message', onMessage) // пришло новое сообщение
    // socket.addEventListener('error', onError)     // ошибка
    // socket.addEventListener('close', onClose)     // сокет закрылся
};
