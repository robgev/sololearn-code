// React modules
import React, { Component } from 'react';

// Utils
import getStyles from '../../../utils/styleConverter';

const styles = {
	achievement: {
		display: 'flex',
		alignItems: 'center',
	},

	badge: {
		base: {
			height: '40px',
			width: '40px',
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
		},

		icon: {
			height: '90%',
			width: '90%',
		},
	},

	details: {
		color: '#545454',
		margin: '0 0 0 5px',
	},

	title: {
		fontSize: '13px',
		margin: '0 0 3px 0',
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
				<div className="badge-icon" style={getStyles(styles.badge.base, { backgroundColor: achievement.color })}>
					<img src="../../../assets/achievement.png" style={styles.badge.icon} />
				</div>
				<div className="details" style={styles.details}>
					<p className="title" style={styles.title}>{achievement.title}</p>
					<p className="description" style={styles.description}>{achievement.description}</p>
				</div>
			</div>
		);
	}
}

export default Badge;
