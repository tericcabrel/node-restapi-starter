import SocketIO from 'socket.io';

export type SocketSessionItem = {
	socket: SocketIO.Socket
};

export type SocketSession = {
	[key: string]: SocketSessionItem
}
