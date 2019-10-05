import socketIo from 'socket.io';

export type SocketSessionItem = {
	socket: socketIo.Socket;
};

export type SocketSession = {
	[key: string]: SocketSessionItem;
};

export type SocketEventName = {
	request: string;
	response: string;
};
