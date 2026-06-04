import { useState } from 'react';
import { calcMorseDuration } from '../utils/morseConverter';

export function useSerial() {
    const [connected, setConnected] = useState(false);
    const [status, setStatus] = useState('Disconnected');
    const [ports, setPorts] = useState([]);

    const API_URL = 'http://localhost:5000/api';

    const getPorts = async () => {
        try {
            const res = await fetch(`${API_URL}/ports`);
            const data = await res.json();
            setPorts(data);
            return data;
        } catch (error) {
            setStatus('Failed to fetch ports' + error.message);
        }
    };

    const connect = async (portPath) => {
        try {
            const res = await fetch(`${API_URL}/connect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ portPath, baudRate: 9600 }),
            });
            const data = await res.json();

            if (res.ok) {
                setConnected(true);
                setStatus('Connected');
            } else {
                setStatus('Connection failed: ' + data.error);
            }
        } catch (error) {
            setStatus('Connection failed' + error.message);
        }
    };

    const disconnect = async () => {
        try {
            const res = await fetch(`${API_URL}/disconnect`, { method: 'POST' });
            const data = await res.json();

            if (res.ok) {
                setConnected(false);
                setStatus('Disconnected');
            } else {
                setStatus('Disconnection failed: ' + data.error);
            }
        } catch (error) {
            setStatus('Disconnection failed' + error.message);
        }
    };

    const send = async (text) => {
        if (!connected) {
            setStatus('Not connected to Arduino');
            return; 
        }
        try {
           const res = await fetch(`${API_URL}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });
            const data = await res.json();

            if (res.ok) {
                const duration = calcMorseDuration(text);
                setStatus('Message sent [' + text + ']');
                setTimeout(() => {
                    setStatus('Connected');
                }, duration);
            } else {
                setStatus('Send failed: ' + data.error);
            }
        } catch (error) {
            setStatus('Send failed' + error.message);
        }
    };

    return { connected, status, ports, getPorts, connect, disconnect, send };
}