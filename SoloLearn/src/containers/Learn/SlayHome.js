import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';

import { refreshLessonCollections, getLessonCollections, getBookmarkLessons } from 'actions/slay';
import { CollectionCard, LayoutGenerator } from 'containers/Learn/components';

const mapStateToProps = state => ({
	bookmarks: state.slay.bookmarks.slice(0, 10),
	collections: state.slay.slayCollections,
});

const mapDispatchToProps = { refreshLessonCollections, getLessonCollections, getBookmarkLessons };

@connect(mapStateToProps, mapDispatchToProps)
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
			this.setState({
				loading: false,
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
		const { collections } = this.props;
		const { loading, hasMore } = this.state;
		return (
			<LayoutGenerator
				noSidebar
				noDisplay={false}
				loading={loading}
				hasMore={hasMore}
				items={collections}
				loadMore={this.loadMore}
				cardComponent={CollectionCard}
			/>
		);
	}
}

export default SlayHome;
