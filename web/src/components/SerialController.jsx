import { useState, useEffect } from 'react';

export default function SerialController({ 
    connected, status, ports, onGetPorts, onConnect, onDisconnect 
}) {
    const [selectedPort, setSelectedPort] = useState('');

    useEffect(() => {
        onGetPorts();
    }, [onGetPorts]);

    const handleConnect = () => {
        if (selectedPort) {
            onConnect(selectedPort);
        } else {
            alert('select a port to connect');
        }
    };

    return (
        <div>
            <h2>Serial Controller</h2>
            <p>Status: {status}</p>
            
            {!connected ? (
                <>
                <select value={selectedPort} onChange={(e) => setSelectedPort(e.target.value)}>
                    <option value="">Select Port</option>
                    {ports.map((port) => (
                        <option key={port.path} value={port.path}>
                            {port.path} - {port.freindlyName || 'Unknown'}
                        </option>
                    ))}
                </select>
                <button onClick={handleConnect}>Arduino Connect</button>
                <button onClick={onGetPorts}>Refresh Ports</button>
                </>
            ) : (
                <button onClick={onDisconnect}>Arduino Disconnect</button>
            )}
        </div>
    );
}