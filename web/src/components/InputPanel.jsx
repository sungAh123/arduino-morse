import { useState } from 'react';

export default function InputPanel({ onSend }) {
    const [text, setText] = useState('');

    return (
        <div>
            <input 
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Enter text to convert to Morse code"
            />
            <button onClick={() => onSend(text)}>Send</button>
        </div>
    );
}