const http = require('http');
const { Server } = require('socket.io');
const app = require('./app'); // Use app.js for all routes
require('dotenv').config();

// Log environment variables (without sensitive data)
console.log('Environment Variables Check:');
console.log('PORT:', process.env.PORT);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
// Don't log sensitive data like passwords or secrets

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

app.set('io', io); // Make io accessible in routes

io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('orderUpdated', (data) => {
        io.emit('updateOrders', data);
    });
    socket.on('disconnect', () => console.log('User disconnected'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
