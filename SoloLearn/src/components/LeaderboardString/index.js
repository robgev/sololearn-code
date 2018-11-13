import React, { Component } from 'react';
//import { Link } from 'react-router';
import { findBestRank, getCountryName } from 'utils';
import { translate } from 'react-i18next';

import { Image } from 'components/atoms';
import { UsernameLink } from 'components/molecules';

import './styles.scss';

@translate()
class LeaderboardString extends Component {
	getRightLocaleFormat = (key) => {
		switch (key.substring(0, 2)) {
		case 'mt':
			return 'month';
		case 'wt':
			return 'week';
		case 'mc':
			return 'country-month';
		case 'wc':
			return 'country-week';
		default:
			return '';
		}
	}

	getLeaderboardString = () => {
		const { ranks, t } = this.props;
		if (ranks !== null) {
			const localePrefix = 'leaderboard.rank';
			const { key, rank } = findBestRank(ranks);
			if (key !== null) {
				const localeFormat = this.getRightLocaleFormat(key);
				const numberFormat = key.endsWith('p') ? 'percent-format' : 'default-format';
				return t(`${localePrefix}.${localeFormat}`, {
					rank: t(`${localePrefix}.${numberFormat}`, { number: +rank.toFixed(2) }),
					country: getCountryName(ranks.countryCode),
				});
			}
		}
		return t('leaderboard.rank.placeholder');
	}

	render() {
		return (
			<UsernameLink to="/leaderboards" className="leaderboard-link hoverable">
				<Image className="learboards-goblet" src="/assets/rank_goblet.png" alt="g" />
				{this.getLeaderboardString()}
			</UsernameLink>
		);
	}
}

export default LeaderboardString;
