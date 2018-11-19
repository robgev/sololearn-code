import { Component } from 'react';
import PropTypes from 'prop-types';

class Async extends Component {
	static propTypes = {
		fire: PropTypes.func.isRequired,
	}

	state = {
		data: null,
		pending: false,
		error: null,
	}

	fire = () => {
		this.setState({ pending: true });
		return this.props.fire()
			.then((data) => {
				this.setState({ data });
			})
			.catch((error) => {
				this.setState({ error });
			})
			.finally(() => {
				this.setState({ pending: false });
			});
	}

	render() {
		const { pending, error, data } = this.state;
		return this.props.children({
			pending, fire: this.fire, error, data,
		});
	}
}

export default Async;
