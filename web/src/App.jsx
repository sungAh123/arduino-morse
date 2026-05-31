import {useState} from 'react';
import { useSerial } from './hoooks/useSerial';
import { toMorse } from './utils/morseConverter';
import InputPanel from './components/InputPanel';
import MorsePreview from './components/MorsePreview';
import SerialController from './components/SerialController';

export default function App() {
    const [morse, setMorse] = useState('');
    const { connected, status, connect, disconnect, send } = useSerial();

    const handleSend = (text) => {
        const morseText = toMorse(text);
        setMorse(morseText);
        if (connected) {
            send(text);
        }
    };

    return (
        <div>
            <h1>Arduino Morse Code Converter</h1>
            <SerialController 
                connected={connected}
                status={status}
                onConnect={connect}
                onDisconnect={disconnect}
            />
            <InputPanel onSend={handleSend} />
            <MorsePreview morse={morse} />
        </div>
    );
}