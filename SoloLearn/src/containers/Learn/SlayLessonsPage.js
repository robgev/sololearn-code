import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
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
	}

	async componentWillMount() {
		const { params: { courseId } } = this.props;
		const collectionId = parseInt(courseId, 10);
		await this.props.setSelectedCollection(collectionId);
		await this.props.getCollectionItems(collectionId, { index: 0, count: 20 });
		ReactGA.ga('send', 'screenView', { screenName: 'Collection Page' });
		this.setState({ loading: false });
	}

	// This component is just for deciding the right item to show when clicking on round
	// lesson items in learn home page.
	render() {
		const { selectedCollection, collectionCourses } = this.props;
		const { loading } = this.state;
		return (
			<SlayLessonCards
				loading={loading}
				lessons={collectionCourses}
				name={selectedCollection ? selectedCollection.name : ''}
			/>
		);
	}
}

export default SlayLessonsPage;
