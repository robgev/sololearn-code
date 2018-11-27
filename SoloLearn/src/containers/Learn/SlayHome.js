import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { refreshLessonCollections, getLessonCollections, getBookmarkLessons } from 'actions/slay';
import { CollectionCard, LayoutGenerator, SidebarCollectionCard } from 'containers/Learn/components';

const mapStateToProps = state => ({
	bookmarks: state.slay.bookmarks.slice(0, 10),
	collections: state.slay.slayCollections,
});

const mapDispatchToProps = { refreshLessonCollections, getLessonCollections, getBookmarkLessons };

@connect(mapStateToProps, mapDispatchToProps)
@translate()
class SlayHome extends PureComponent {
	constructor() {
		super();
		this.state = {
			startIndex: 0,
			loadCount: 10,
			loading: true,
			hasMore: true,
		};
		document.title = 'Sololearn | Learn';
	}

	async componentDidMount() {
		const { startIndex, loadCount } = this.state;
		const { collections, getLessonCollections } = this.props;
		this.props.refreshLessonCollections();
		if (collections.length <= 0) {
			await this.props.getBookmarkLessons({ index: startIndex, count: loadCount });
			const length = await getLessonCollections({ index: startIndex, count: loadCount });
			this.setState({
				loading: false,
				hasMore: length === loadCount,
				startIndex: startIndex + loadCount,
			});
		} else {
			this.setState({
				loading: false,
				startIndex: startIndex + collections.length,
				hasMore: collections.length % loadCount === 0,
			});
		}
		ReactGA.ga('send', 'screenView', { screenName: 'Home Store Page' });
	}

	loadMore = async () => {
		const { startIndex, loadCount } = this.state;
		const length =
			await this.props.getLessonCollections({ index: startIndex, count: loadCount });
		this.setState({
			hasMore: length === loadCount,
			startIndex: startIndex + loadCount,
		});
	}

	render() {
		const { t, collections, bookmarks } = this.props;
		const { loading, hasMore } = this.state;
		return (
			<LayoutGenerator
				noDisplay={false}
				loading={loading}
				hasMore={hasMore}
				items={collections}
				loadMore={this.loadMore}
				cardComponent={CollectionCard}
				sidebarContent={
					<SidebarCollectionCard
						bookmarks
						items={bookmarks}
						title={t('store.bookmarks.title')}
					/>
				}
			/>
		);
	}
}

export default SlayHome;
