import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { InfiniteScroll, LayoutWithSidebar, EmptyCard } from 'components/molecules';
import { getCollectionItems, setSelectedCollection, unsetCollection } from 'actions/slay';

import { UserProgressToolbar } from './components';
import SlayLessonCards from './SlayLessonCards';

const mapStateToProps = state => ({
	selectedCollection: state.slay.selectedCollection,
	collectionCourses: state.slay.filteredCollectionItems,
});

const mapDispatchToProps = { getCollectionItems, setSelectedCollection, unsetCollection };

@connect(mapStateToProps, mapDispatchToProps)
class SlayLessonsPage extends Component {
	state = {
		hasMore: true,
		startIndex: 0,
		loadCount: 20,
		initialLoad: true,
	}

	async componentDidMount() {
		const { loadCount, startIndex } = this.state;
		const { params: { collectionId } } = this.props;
		const parsedCollectionId = parseInt(collectionId, 10);
		await this.props.setSelectedCollection(parsedCollectionId);
		const length = await this.props.getCollectionItems(parsedCollectionId, { index: 0, count: 20 });
		ReactGA.ga('send', 'screenView', { screenName: 'Collection Page' });
		this.setState({
			hasMore: length === loadCount,
			startIndex: startIndex + length,
			initialLoad: false,
		});
	}

	componentWillUnmount() {
		this.props.unsetCollection();
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
		const { hasMore, initialLoad } = this.state;
		return (

			<LayoutWithSidebar
				sidebar={<UserProgressToolbar />}
			>
				{initialLoad
					? 
					<EmptyCard loading/>
					:
					<InfiniteScroll
					pageStart={0}
					hasMore={hasMore}
					loadMore={this.loadMore}
				>
					<SlayLessonCards
						lessons={collectionCourses}
						name={selectedCollection ? selectedCollection.name : ''}
					/>
				</InfiniteScroll>
				}

			</LayoutWithSidebar>
		);
	}
}

export default SlayLessonsPage;
