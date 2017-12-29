// React modules
import React, { PureComponent } from 'react';

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

class Badge extends PureComponent {
	render() {
		const { achievement, isSelected, selectedRef } = this.props;
		return (
			<div
				className={isSelected && 'fadeOut'}
				style={styles.achievement}
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
						src="../../../assets/achievement.png"
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
