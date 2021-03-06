import * as http from 'http';
import socketIo from 'socket.io';

import { randomStr } from '../../utils/helpers';
import { SocketSession, SocketSessionItem } from '../types/socket';
import { getCountryEvent } from './events';

// Socket tasks
import { GetCountryTask } from './tasks/get-country.task';

class SocketManager {
	static sessions: SocketSession = { };

	/**
	 * @param  {http.Server} server
	 *
	 * @return void
	 */
	static init(server: http.Server): void {
		const io: socketIo.Server = socketIo.listen(server, { pingTimeout: 700000 });

		io.sockets.on('connection', async (socket: socketIo.Socket) => {
			const socketSessionId: string = SocketManager.createSession(socket);

			socket.on(getCountryEvent.request, (data: any) => {
				console.log(`[${getCountryEvent}]: %s`, JSON.stringify(data));
				GetCountryTask.run(SocketManager.sessions, socketSessionId, data);
			});

			socket.on('disconnect', () => {
				socket.disconnect(true);
				SocketManager.deleteSession(socketSessionId);
				console.log('Client disconnected');
			});
		});
	}

	/**
	 * Create a socket's session for the user connected
	 *
	 * @param socket The socket instance of the user
	 *
	 * @return string The socket's session ID
	 */
	static createSession(socket: socketIo.Socket): string {
		const socketSessionId: string = randomStr(24);

		console.log('socketSessionId', socketSessionId);

		if (!SocketManager.sessions[socketSessionId]) {
			SocketManager.sessions = {
				...this.sessions, [socketSessionId]: { socket },
			};
		}

		return socketSessionId;
	}

	/**
	 * Get a socket's session
	 *
	 * @param socketSessionId The socket's session ID
	 *
	 * @return SocketSessionItem|null The socket's session item associated to the provided ID or null if not found
	 */
	static getSession(socketSessionId: string): SocketSessionItem | null {
		if (!SocketManager.sessions[socketSessionId]) {
			return SocketManager.sessions[socketSessionId];
		}

		return null;
	}

	/**
	 * Get a socket's session
	 *
	 * @param socketSessionId The socket's session ID to delete
	 *
	 * @return void
	 */
	static deleteSession(socketSessionId: string): void {
		if (!SocketManager.sessions[socketSessionId]) {
			delete SocketManager.sessions[socketSessionId];
		}
	}
}

export { SocketManager };
