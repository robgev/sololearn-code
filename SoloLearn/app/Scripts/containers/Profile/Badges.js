// React modules
import React, { PureComponent } from 'react';
import scrollToElement from 'scroll-to-element';
import { translate } from 'react-i18next';
import Paper from 'material-ui/Paper';

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
@translate()
class Badges extends PureComponent {
	componentDidMount() {
		scrollToElement(this._selected, { offset: -100 });
	}
	render() {
		const { t, badges, selectedId } = this.props;
		return (
			<Paper id="Badges" style={styles.container}>
				<p style={styles.title}>{t('profile.tab.badges')}</p>
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
			</Paper>
		);
	}
}

export default Badges;
