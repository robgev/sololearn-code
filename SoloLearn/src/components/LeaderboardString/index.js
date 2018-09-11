import React, { Component } from 'react';
import { Link } from 'react-router';
import { findBestRank } from 'utils';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import countries from 'constants/Countries.json';

import './styles.scss';

const mapStateToProps = state => ({
	ranks: state.userProfile.rank,
});

@connect(mapStateToProps)
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

	getCountryName = (countryCode) => {
		const foundCountry = countries.find(c => c.code === countryCode);
		return foundCountry ? foundCountry.name : '';
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
					country: this.getCountryName(ranks.countryCode),
				});
			}
		}
		return t('leaderboard.rank.placeholder');
	}

	render() {
		return (
			<Link to="/leaderboards" className="leaderboard-link hoverable">
				<img className="learboards-goblet" src="/assets/rank_goblet.png" alt="g" />
				{this.getLeaderboardString()}
			</Link>
		);
	}
}

export default LeaderboardString;
