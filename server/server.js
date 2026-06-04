import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { SerialPort } from 'serialport';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let port = null;

app.get('/api/ports', async (req, res) => {
    try {
        const ports = await SerialPort.list();
        res.json(ports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 포트 연결
app.post('/api/connect', (req, res) => {
    const { portPath, baudRate } = req.body;

    if (port && port.isOpen) {
        return res.status(400).json({ error: '이미 포트가 연결되어 있습니다.' });
    }

    try {
        port = new SerialPort({ path: portPath, baudRate });

        port.on('open', () => {
            console.log('포트가 연결됨: ${portPath}');
            res.json({ success: true, message: 'success connected' });
        });

        port.on('error', (err) => {
            console.error('포트 연결 오류:', err);
            res.status(500).json({ error: err.message });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 포트 연결 해제
app.post('/api/disconnect', (req, res) => {
    if (!port || !port.isOpen) {
        return res.status(400).json({ error: '포트가 연결되어 있지 않습니다.' });
    }     

    port.close((err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        port = null;
        console.log('포트 연결 해제됨');
        res.json({ success: true, message: 'success disconnected' });
    });
});

// 데이터 전송
app.post('/api/send', (req, res) => {
    const { text } = req.body;

    if (!port || !port.isOpen) {
        return res.status(400).json({ error: 'not connected to arduino' });
    }

    try {
        const data = text + '\n'; // 데이터 끝에 줄바꿈 추가
        port.write(data, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            console.log(`sent: ${data}`);
            res.json({ success: true, message: `success sent: ${text}` });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 연결 상태 확인
app.get('/api/status', (req, res) => {
    const isConnected = port && port.isOpen;
    res.json({ connected: isConnected });
});

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});