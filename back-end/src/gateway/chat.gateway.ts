//import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
//import { Server } from 'socket.io';
//
//@WebSocketGateway()
//export class ChatGateway {
//    @WebSocketServer() server: Server;
//
//    @SubscribeMessage('message')
//  handleMessage(client: any, payload: any): void {
//        this.server.emit('message', payload); // Broadcast message to all connected clients
//        console.log(payload);
//    }
//}

import {SubscribeMessage, MessageBody, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import { Server } from 'socket.io';

@WebSocketGateway(3003, {namespace: 'chat'})
export class ChatGateway {
    @WebSocketServer() server: Server;
    
    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: string): void {
        this.server.emit('message', message);
    }
}