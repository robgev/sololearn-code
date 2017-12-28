import React, { PureComponent } from 'react';
import { LinearProgress } from 'material-ui';

const timeDifferenceInSeconds = (date1, date2) => (date1 - date2) / 1000;

export default class extends PureComponent {
	state = { timer: 100 }
	componentDidMount() {
		this.timeCounter = performance.now();
		requestAnimationFrame(this.addTime);
	}
	componentWillUnmount() {
		clearInterval(this.timer);
	}
	addTime = () => {
		const { time } = this.props;
		const now = performance.now();
		const timer = this.state.timer -
			((timeDifferenceInSeconds(now, this.timeCounter) * 100) / time);
		this.timeCounter = now;
		if (timer <= 0) {
			clearInterval(this.timer);
			this.props.onTimerEnd();
		} else {
			this.setState({ timer });
			requestAnimationFrame(this.addTime);
		}
	}
	render() {
		return <LinearProgress mode="determinate" value={this.state.timer} style={this.props.style} />;
	}
}
