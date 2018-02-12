import React, { Component } from 'react';

class AnimatedNumber extends Component {
	constructor(props) {
		super(props);
		this.state = {
			intervalId: null,
			num: props.fromNumber
		}
	}
	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}
	componentDidMount() {
		const {
			fromNumber,
            toNumber,
            animationDuration,
            animationStartIn
		} = this.props;
		const interval = animationDuration / Math.abs(fromNumber - toNumber);
		setTimeout(() => {
			let intervalId = null;
			if (fromNumber > toNumber) {
				intervalId = setInterval(() => {
					const { num, intervalId } = this.state;
					if (num > toNumber) {
						this.setState({num: num - 1});
					} else {
						clearInterval(intervalId);
					}
				}, interval);
			} else {
				intervalId = setInterval(() => {
					const { num, intervalId } = this.state;
					if (num < toNumber) {
						this.setState({num: num + 1});
					} else {
						clearInterval(intervalId);
					}
				}, interval);
			}
			this.setState({intervalId});
		}, animationStartIn)
	}
	render() {
		const { text } = this.props;
		return (
			<div>
				{this.state.num}{text}
			</div>
		)
	}
}

export default AnimatedNumber;