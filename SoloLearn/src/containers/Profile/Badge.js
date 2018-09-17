// React modules
import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import './badge.scss';

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
			height: '60px',
			width: '60px',
			flexShrink: 0,
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

@observer
class Badge extends Component {
	@observable highlighted = this.props.isSelected
	componentDidMount() {
		setTimeout(() => {
			this.setHighlighted(false);
		}, 2000);
	}
	@action setHighlighted = (val) => {
		if (this.highlighted !== val) {
			this.highlighted = val;
		}
	}
	render() {
		const { achievement, isSelected, selectedRef } = this.props;
		return (
			<div
				className={`badge-item ${this.highlighted ? 'animate' : ''}`}
				style={{ ...styles.achievement }}
				ref={isSelected && selectedRef}
			>
				<div
					className="badge-icon"
					style={{
						...styles.badge.base,
						...(achievement.isUnlocked ? { backgroundColor: achievement.color } : {}),
					}}
				>
					<img
						alt="Achievement badge"
						style={styles.badge.icon}
						src={achievement.icon}
					/>
				</div>
				<div className="details" style={styles.details}>
					<p
						className="title"
						style={{
							...styles.title.base,
							...(achievement.isUnlocked ? styles.title.unlocked : {}),
						}}
					>{achievement.title}
					</p>
					<p className="description" style={styles.description}>{achievement.description}</p>
				</div>
			</div>
		);
	}
}

export default Badge;
