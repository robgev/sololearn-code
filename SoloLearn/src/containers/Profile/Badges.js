import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import {
	PaperContainer,
	Container,
	Title,
} from 'components/atoms';
import Badge from './Badge';

@translate()
class Badges extends PureComponent {
	componentDidMount() {
		setTimeout(() => {
			if (this._selected) {
				this._selected.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				});
			}
		}, 0);
	}
	render() {
		const { t, badges, selectedId } = this.props;
		if (!badges) {
			return null;
		}
		return (
			<PaperContainer id="Badges">
				<Title>{t('profile.tab.badges')}</Title>
				<Container className="content">
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
				</Container>
			</PaperContainer>
		);
	}
}

export default Badges;
