import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from 'components/atoms';

class ConsecutiveSnackbar extends Component {
	queue = [];

	constructor(props) {
		super(props);
		this.state = {
			open: false,
			messageInfo: {},
		};
	}

	componentDidUpdate(oldProps) {
		if (oldProps.message !== this.props.message) {
			console.log(oldProps.message, this.props.message);
			this.handleMessageChange(this.props.message);
		}
	}

	handleMessageChange = (message) => {
		this.queue.push({
			message,
			key: new Date().getTime(),
		});

		if (this.state.open) {
			// immediately begin dismissing current message
			// to start showing new one
			this.setState({ open: false });
		} else {
			this.processQueue();
		}
	};

	processQueue = () => {
		if (this.queue.length > 0) {
			this.setState({
				messageInfo: this.queue.shift(),
				open: true,
			});
		}
	};

	handleClose = (reason) => {
		if (reason !== 'clickaway') {
			this.setState({ open: false });
		}
		this.props.onClose();
	};

	handleExited = () => {
		this.processQueue();
	};

	render() {
		const {
			onClose, message, open, ...props
		} = this.props;
		const { messageInfo } = this.state;

		return (
			<Snackbar
				key={messageInfo.key}
				onClose={this.handleClose}
				onExited={this.handleExited}
				open={this.state.open}
				message={messageInfo.message}
				{...props}
			/>
		);
	}
}

ConsecutiveSnackbar.defaultProps = {
	onClose: () => {},
};

ConsecutiveSnackbar.propTypes = {
	onClose: PropTypes.func,
	message: PropTypes.oneOfType([ PropTypes.string, PropTypes.node ]).isRequired,
};

export default ConsecutiveSnackbar;
