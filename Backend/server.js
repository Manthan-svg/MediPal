import app from './app.js';
import http from 'http';
import './services/reminderScheduler.service.js'; // Initialize reminder scheduler


const server = http.createServer(app);





server.listen(5000,()=>{
    console.log('Server is running on port 5000');
})