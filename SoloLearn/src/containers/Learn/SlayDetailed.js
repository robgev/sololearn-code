import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';

import { getCollectionItems, setSelectedCollection, getLessonCollections } from 'actions/slay';
import SlayDetailedShimmer from 'components/Shimmers/SlayDetailedShimmer';
import { CodePenCard, CourseBox, LayoutGenerator } from './components';

// import 'styles/slayHome.scss';

const mapStateToProps = state => ({
	courses: state.courses,
	selectedCollection: state.slay.selectedCollection,
	collectionCourses: state.slay.filteredCollectionItems,
});

const mapDispatchToProps = { getLessonCollections, getCollectionItems, setSelectedCollection };

@connect(mapStateToProps, mapDispatchToProps)
class SlayDetailed extends PureComponent {
	constructor() {
		super();
		this.state = {
			startIndex: 0,
			loadCount: 10,
			loading: true,
			hasMore: true,
		};
		document.title = 'Slay | Detailed';
	}

	async componentWillMount() {
		const { params } = this.props;
		const { startIndex, loadCount } = this.state;
		const collectionId = parseInt(params.collectionId, 10);
		await this.props.setSelectedCollection(collectionId);
		const length =
		await this.props.getCollectionItems(collectionId, { index: startIndex, count: loadCount });
		this.setState({
			loading: false,
			hasMore: length === loadCount,
			startIndex: startIndex + length,
		});
		if (collectionId !== -1) { // TODO: Rewrite. 1 stands for Default SoloLearn lessons
			ReactGA.ga('send', 'screenView', { screenName: 'Collection Page' });
		} else {
			ReactGA.ga('send', 'screenView', { screenName: 'Lessons Page' });
		}
		this.setState({ loading: false });
	}

	loadMore = async () => {
		const { startIndex, loadCount } = this.state;
		const { params } = this.props;
		const collectionId = parseInt(params.collectionId, 10);
		if (startIndex !== 0) {
			const length =
			await this.props.getCollectionItems(collectionId, { index: startIndex, count: loadCount });
			this.setState({
				hasMore: length === loadCount,
				startIndex: startIndex + loadCount,
			});
		}
	}

	render() {
		const { loading, hasMore } = this.state;
		const {
			params,
			collectionCourses,
			selectedCollection,
		} = this.props;
		const collectionId = parseInt(params.collectionId, 10);
		const isCourses = collectionId === -1;
		return (
			<LayoutGenerator
				paper
				noSidebar
				loading={loading}
				hasMore={hasMore}
				isCourses={isCourses}
				items={collectionCourses}
				loadMore={this.loadMore}
				cardComponent={isCourses ? CourseBox : CodePenCard}
				loadingComponent={SlayDetailedShimmer}
				title={loading ? '' : (selectedCollection ? selectedCollection.name : 'Learn the Basics')}
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
			/>
		);
	}
}

export default SlayDetailed;
