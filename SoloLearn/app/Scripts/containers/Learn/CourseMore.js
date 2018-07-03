import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { getCollectionItems, setSelectedCollection } from 'actions/slay';

import Modules from './Modules';
import SlayLessonsPage from './SlayLessonsPage';

const mapStateToProps = state => ({
	courses: state.courses,
	selectedCollection: state.slay.selectedCollection,
	collectionCourses: state.slay.filteredCollectionItems,
});

const mapDispatchToProps = { getCollectionItems, setSelectedCollection };

@connect(mapStateToProps, mapDispatchToProps)
class CourseMore extends PureComponent {
	state = {
		loading: true,
	}

	async componentWillMount() {
		const { params } = this.props;
		const itemType = parseInt(params.itemType, 10);
		const collectionId = parseInt(params.courseId, 10);
		if (itemType === 5) { // 5 stands for newly created lessons(like Git, Kotlin etc.)
			await this.props.setSelectedCollection(collectionId);
			await this.props.getCollectionItems(collectionId, { index: 0, count: 20 });
			ReactGA.ga('send', 'screenView', { screenName: 'Collection Page' });
		} else {
			ReactGA.ga('send', 'screenView', { screenName: 'Modules Page' });
		}
		this.setState({ loading: false });
	}

	// This component is just for deciding the right item to show when clicking on round
	// lesson items in learn home page.
	render() {
		const { params, selectedCollection, collectionCourses } = this.props;
		const { loading } = this.state;
		const itemType = parseInt(params.itemType, 10);
		return itemType === 1 ?
			<Modules
				params={params}
			/> :
			<SlayLessonsPage
				loading={loading}
				lessons={collectionCourses}
				name={selectedCollection ? selectedCollection.name : ''}
			/>;
	}
}

export default CourseMore;
