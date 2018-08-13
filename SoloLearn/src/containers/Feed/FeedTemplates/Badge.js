// React modules
import React, { Component } from 'react';

const styles = {
	achievement: {
		display: 'flex',
		alignItems: 'center',
	},

	badge: {
		base: {
			height: '60px',
			width: '60px',
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
		},

		icon: {
			width: '80%',
		},
	},

	details: {
		color: '#545454',
		marginLeft: 10,
	},

	title: {
		fontSize: '16px',
		fontWeight: 500,
		margin: '0 0 3px 0',
	},

	description: {
		fontSize: '13px',
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
				<div
					className="badge-icon"
					style={{ ...styles.badge.base, backgroundColor: achievement.color }}
				>
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
