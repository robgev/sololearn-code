// React modules
import React, { PureComponent } from 'react';
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
		if (this._selected) {
			setTimeout(() => this._selected.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			}), 0);
		}
	}
	render() {
		const { t, badges, selectedId } = this.props;
		if (!badges) {
			return null;
		}
		return (
			<Paper id="Badges" style={styles.container}>
				<p style={styles.title}>{t('profile.tab.badges')}</p>
				<div className="content" style={styles.content}>
					{
						badges.map((badge) => {
							const isSelected = badge.id.toString() === selectedId.toString();
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
