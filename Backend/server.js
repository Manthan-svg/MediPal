import app from './app.js';
import http from 'http';
// import './services/reminderScheduler.service.js'; // Initialize reminder scheduler
// import { webSocketService } from './services/websocket.service.js';


const server = http.createServer(app);

// Initialize WebSocket service
// webSocketService.initialize(server);





server.listen(5000, () => {
    console.log('Server is running on port 5000');
    console.log('WebSocket service initialized');
});