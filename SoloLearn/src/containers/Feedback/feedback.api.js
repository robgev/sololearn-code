import Service from 'api/service';

export const sendFeedback = (type, message) => {
	Service.request('SendFeedback', { type, message });
};
