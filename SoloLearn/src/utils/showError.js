import { toast } from 'react-toastify';
import faultGenerator from './faultGenerator';

const showError = (err, message) => {
	if (err.data) {
		faultGenerator(err.data).forEach(curr =>
			toast.warn(`${curr.split(/(?=[A-Z])/).join(' ')}`));
	} else {
		toast.error(`${message}: ${err.message}`);
	}
};

export default showError;
