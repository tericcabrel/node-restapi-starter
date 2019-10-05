import { SocketEventName } from '../types/socket';

export const getCountryEvent: SocketEventName = {
	request: 'country.get',
	response: 'country.get',
};
