import React, { Component } from 'react';
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
			const { key, rank, queryParams, tab } = findBestRank(ranks);
			if (key !== null) {
				const localeFormat = this.getRightLocaleFormat(key);
				const numberFormat = key.endsWith('p') ? 'percent-format' : 'default-format';
				return {
					queryParams,
					tab,
					string: t(`${localePrefix}.${localeFormat}`, {
						rank: t(`${localePrefix}.${numberFormat}`, { number: +rank.toFixed(2) }),
						country: getCountryName(ranks.countryCode),
					}),
				};
			}
		}
		return {
			queryParams: null,
			string: t('leaderboard.rank.placeholder'),
		};
	}

	render() {
		const { userID } = this.props;
		const { queryParams: query, string, tab } = this.getLeaderboardString();

		return (
			<UsernameLink
				to={query
					? { pathname: `/leaderboard/${tab}/${userID}`, query }
					: '/leaderboard'
				}
				className="leaderboard-link hoverable"
			>
				<Image className="learboards-goblet" src="/assets/rank_goblet.png" alt="g" />
				{string}
			</UsernameLink>
		);
	}
}

export default LeaderboardString;
