// React modules
import React, { PureComponent } from 'react';
import scrollToElement from 'scroll-to-element';

// Additional data and components
import Badge from './Badge';

const styles = {
	container: {
		margin: '5px 0 0 0',
		padding: '10px',
	},

	content: {
		display: 'flex',
		flexWrap: 'wrap',
		margin: '10px 0 0 0',
	},

	title: {
		textTransform: 'uppercase',
	},
};

class Badges extends PureComponent {
	componentDidMount() {
		scrollToElement(this._selected);
	}
	render() {
		const { badges, selectedId } = this.props;
		return (
			<div id="Badges" style={styles.container}>
				<p style={styles.title}>Badges</p>
				<div className="content" style={styles.content}>
					{
						badges.map((badge) => {
							const isSelected = !!selectedId && badge.id.toString() === selectedId.toString();
							return (
								<Badge
									{...{
										key: badge.id,
										achievement: badge,
										isSelected,
										selectedRef: isSelected && ((ref) => { this._selected = ref; }),
									}}
								/>
							);
						})
					}
				</div>
			</div>
		);
	}
}

export default Badges;
