import React, { PureComponent } from 'react';
import { LinearProgress } from 'material-ui';

export default class extends PureComponent {
	state = { timer: 100 }
	componentDidMount() {
		this.timer = setInterval(this.addTime, this.props.period * 1000);
	}
	componentWillUnmount() {
		clearInterval(this.timer);
	}
	addTime = () => {
		const { time, period } = this.props;
		const timer = this.state.timer - ((period * 100) / time);
		if (timer <= 0) {
			clearInterval(this.timer);
			this.props.onTimerEnd();
		} else {
			this.setState({ timer });
		}
	}
	render() {
		return <LinearProgress mode="determinate" value={this.state.timer} style={this.props.style} />;
	}
}
