import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
        const broadcastRegex = /^broadcast\:/
        const nameRegex = /^name\:/
        if(nameRegex.test(message))
        {
            message = message.replace(nameRegex,"")
            ws.send(`client 1: ${message}`)
        }
        else if (broadcastRegex.test(message)) {
            message = message.replace(broadcastRegex, '');

            //send back the message to the other clients
            ws.send(message);
            
        } else {
            ws.send(`Hello, you sent -> ${message}`);
        }
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});

//start our server
server.listen( 8999, () => {
    console.log(`Server started on port ${server.address()} :)`);
});