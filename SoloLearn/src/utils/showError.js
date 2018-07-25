import { toast } from 'react-toastify';
import faultGenerator from './faultGenerator';

const showError = (err) => {
	faultGenerator(err).forEach(curr =>
		toast.warn(`⚠️${curr.split(/(?=[A-Z])/).join(' ')}`));
};

export default showError;
