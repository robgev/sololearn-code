import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { getLessonCollections, getBookmarkLessons } from 'actions/slay';
import SlayLayout from 'components/Layouts/SlayLayout';
import CollectionCard from 'components/CollectionCard';
import SidebarCollectionCard from 'components/SidebarCollectionCard';

const mapStateToProps = state => ({
	bookmarks: state.slay.bookmarks.slice(0, 10),
	collections: state.slay.slayCollections,
});

const mapDispatchToProps = { getLessonCollections, getBookmarkLessons };

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

	async componentWillMount() {
		const { startIndex, loadCount } = this.state;
		const { collections, getLessonCollections } = this.props;
		if (collections.length < 10) {
			await this.props.getBookmarkLessons({ index: startIndex, count: loadCount });
			// -1 for lesson collection with id -1 (round items)
			const length = await getLessonCollections({ index: startIndex, count: loadCount }) - 1;
			this.setState({
				loading: false,
				hasMore: length === loadCount,
				startIndex: startIndex + loadCount,
			});
		} else {
			this.setState({
				loading: false,
				startIndex: startIndex + collections.length,
				// If number of collections is divisible by the number
				// of items we get on every load, then there is 1 more collection
				// Same -1 as mentioned above
				hasMore: (collections.length - 1) % loadCount === 0,
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
			<SlayLayout
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
