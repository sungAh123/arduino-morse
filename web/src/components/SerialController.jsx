export default function SerialController({ connected, status, onConnect, onDisconnect }) {
    return (
        <div>
            <h2>Serial Controller</h2>
            <p>Status: {status}</p>
            { !connected 
            ? (
                <button onClick={onConnect}>Arduino Connect</button>
            ) : (
                <button onClick={onDisconnect}>Arduino Disconnect</button>
            )}
        </div>
    );
}