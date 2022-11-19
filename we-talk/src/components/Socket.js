import { over } from 'stompjs';

import SockJS from 'sockjs-client';

export let stompClient = null;

export const connect = () => {
    const Sock = new SockJS('http://localhost:8080/ws');
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
}