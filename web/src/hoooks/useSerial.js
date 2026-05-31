import { useState, useRef } from 'react';

export function useSerial() {
    const [connected, setConnected] = useState(false);
    const [status, setStatus] = useState('Disconnected');
    const portRef = useRef(null);
    const writerRef = useRef(null);

    const connect = async () => {
        try {
            const port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });
            portRef.current = port;
            writerRef.current = port.writable.getWriter();
            setConnected(true);
            setStatus('Connected');
        } catch (error) {
            setStatus('Connection failed' + error.message);
        }
    };

    const disconnect = async () => {
        try {
            writerRef.current?.releaseLock();
            await portRef.current?.close();
            setConnected(false);
            setStatus('Disconnected');
        } catch (error) {
            setStatus('Disconnection failed' + error.message);
        }
    };

    const send = async (text) => {
        if (!writerRef.current) return;
        try {
            const encoder = new TextEncoder();
            await writerRef.current.write(encoder.encode(text + '\n'));
            setStatus('Message sent' + text);

            // 5초 뒤 다시 연결됨으로 상태 변경
            setTimeout(() => {
                setStatus('Connected');
            }, 5000);
        } catch (error) {
            setStatus('Send failed' + error.message);
        }
    };

    return { connected, status, connect, disconnect, send };
}