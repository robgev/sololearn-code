// React modules
import React, { Component } from 'react';

// Utils
import getStyles from '../../utils/styleConverter';

const styles = {
	achievement: {
		display: 'inline-flex',
		width: '50%',
		alignItems: 'center',
		padding: '0 5px 10px 0',
		boxSizing: 'border-box',
	},

	badge: {
		base: {
			height: '40px',
			width: '40px',
			borderRadius: '50%',
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: '#E0E0E0',
		},

		icon: {
			height: '80%',
			width: '80%',
		},
	},

	details: {
		color: '#545454',
		margin: '0 0 0 5px',
	},

	title: {
		base: {
			fontSize: '14px',
			margin: '0 0 3px 0',
		},

		unlocked: {
			color: '#000',
		},
	},

	description: {
		fontSize: '11px',
	},
};

class Badge extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const achievement = this.props.achievement;

		return (
			<div className="achievement" style={styles.achievement}>
				<div className="badge-icon" style={achievement.isUnlocked ? getStyles(styles.badge.base, { backgroundColor: achievement.color }) : styles.badge.base}>
					<img src="../../../assets/achievement.png" style={styles.badge.icon} />
				</div>
				<div className="details" style={styles.details}>
					<p className="title" style={achievement.isUnlocked ? getStyles(styles.title.base, styles.title.unlocked) : styles.title.base}>{achievement.title}</p>
					<p className="description" style={styles.description}>{achievement.description}</p>
				</div>
			</div>
		);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.achievement !== nextProps.achievement;
	}
}

export default Badge;
