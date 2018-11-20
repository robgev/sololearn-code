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

	_isMounted;

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	fire = () => {
		this.setState({ pending: true });
		return this.props.fire()
			.then((data) => {
				if (this._isMounted) {
					this.setState({ data });
				}
			})
			.catch((error) => {
				if (this._isMounted) {
					this.setState({ error });
				}
			})
			.finally(() => {
				if (this._isMounted) {
					this.setState({ pending: false });
				}
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
