import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';

import { getBookmarkLessons } from 'actions/slay';
import CodePenCard from 'components/Shared/CodePenCard';
import SlayLayout from 'components/Layouts/SlayLayout';
import SlayDetailedShimmer from 'components/Shared/Shimmers/SlayDetailedShimmer';

// i18n
import { translate } from 'react-i18next';

const mapStateToProps = state => ({ lessons: state.slay.bookmarks });

const mapDispatchToProps = { getBookmarkLessons };

@connect(mapStateToProps, mapDispatchToProps)
class SlayHome extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			startIndex: props.lessons.length,
			loadCount: 10,
			loading: true,
			hasMore: true,
		};
		document.title = 'Sololearn | Bookmarks';
	}

	async componentWillMount() {
		const { startIndex, loadCount } = this.state;
		const length =
			await this.props.getBookmarkLessons({ index: startIndex, count: loadCount });
		this.setState({
			loading: false,
			hasMore: length === loadCount,
			startIndex: startIndex + loadCount,
		});
		ReactGA.ga('send', 'screenView', { screenName: 'Bookmarks Page' });
	}

	loadMore = async () => {
		const { startIndex, loadCount } = this.state;
		const length =
			await this.props.getBookmarkLessons({ index: startIndex, count: loadCount });
		this.setState({
			hasMore: length === loadCount,
			startIndex: startIndex + loadCount,
		});
	}

	render() {
		const { loading, hasMore } = this.state;
		const { lessons, t } = this.props;
		return (
			<SlayLayout
				paper
				noSidebar
				loading={loading}
				hasMore={hasMore}
				items={lessons}
				loadMore={this.loadMore}
				cardComponent={CodePenCard}
				loadingComponent={SlayDetailedShimmer}
				wrapperStyle={{
					alignItems: 'initial',
				}}
				style={{
					width: 'initial',
					padding: 15,
					flexDirection: 'row',
					flexWrap: 'wrap',
					justifyContent: 'flex-start',
				}}
			>
				{lessons.length ? null : <p>{t('common.empty-list-message')}</p>}
			</SlayLayout>
		);
	}
}

export default translate()(SlayHome);
