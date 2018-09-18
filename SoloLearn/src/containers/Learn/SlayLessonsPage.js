import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import CircularProgress from 'material-ui/CircularProgress';
import { getCollectionItems, setSelectedCollection } from 'actions/slay';

import SlayLessonCards from './SlayLessonCards';

const mapStateToProps = state => ({
	selectedCollection: state.slay.selectedCollection,
	collectionCourses: state.slay.filteredCollectionItems,
});

const mapDispatchToProps = { getCollectionItems, setSelectedCollection };

@connect(mapStateToProps, mapDispatchToProps)
class SlayLessonsPage extends Component {
	state = {
		loading: true,
		hasMore: true,
		startIndex: 0,
		loadCount: 20,
	}

	async componentWillMount() {
		const { loadCount, startIndex } = this.state;
		const { params: { collectionId } } = this.props;
		const parsedCollectionId = parseInt(collectionId, 10);
		await this.props.setSelectedCollection(parsedCollectionId);
		const length = await this.props.getCollectionItems(parsedCollectionId, { index: 0, count: 20 });
		ReactGA.ga('send', 'screenView', { screenName: 'Collection Page' });
		this.setState({
			loading: false,
			hasMore: length === loadCount,
			startIndex: startIndex + length,
		});
	}

	loadMore = async () => {
		const { startIndex, loadCount } = this.state;
		const { params: { collectionId } } = this.props;
		if (startIndex !== 0) {
			const length =
			await this.props.getCollectionItems(collectionId, { index: startIndex, count: loadCount });
			this.setState({
				hasMore: length === loadCount,
				startIndex: startIndex + loadCount,
			});
		}
	}

	// This component is just for deciding the right item to show when clicking on round
	// lesson items in learn home page.
	render() {
		const { selectedCollection, collectionCourses } = this.props;
		const { loading, hasMore } = this.state;
		return (
			<InfiniteScroll
				pageStart={0}
				hasMore={hasMore}
				loadMore={this.loadMore}
				loader={loading ?
					null :
					<CircularProgress
						style={{
							width: '100%',
							paddingBottom: 15,
							textAlign: 'center',
						}}
						key={collectionCourses.length ? collectionCourses[0].name : 'progress'}
					/>
				}
			>
				<SlayLessonCards
					loading={loading}
					lessons={collectionCourses}
					name={selectedCollection ? selectedCollection.name : ''}
				/>
			</InfiniteScroll>
		);
	}
}

export default SlayLessonsPage;
