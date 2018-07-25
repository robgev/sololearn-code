import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';

import { getCollectionItems, setSelectedCollection } from 'actions/slay';
import CodePenCard from 'components/CodePenCard';
import CourseBox from 'components/CourseBox';
import SlayLayout from 'components/Layouts/SlayLayout';
import SlayDetailedShimmer from 'components/Shimmers/SlayDetailedShimmer';

// import 'styles/slayHome.scss';

const mapStateToProps = state => ({
	courses: state.courses,
	selectedCollection: state.slay.selectedCollection,
	collectionCourses: state.slay.filteredCollectionItems,
});

const mapDispatchToProps = { getCollectionItems, setSelectedCollection };

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
		// Need to rewrite this part after architecture change.
		// We don't need to have this much of difference between
		// initial SL lessons and slay lessons
		const { params } = this.props;
		const { startIndex, loadCount } = this.state;
		const collectionId = parseInt(params.collectionId, 10);
		if (collectionId !== 1) { // 1 stands for Default SoloLearn lessons
			await this.props.setSelectedCollection(collectionId);
			const length =
				await this.props.getCollectionItems(collectionId, { index: startIndex, count: loadCount });
			this.setState({
				loading: false,
				hasMore: length === loadCount,
				startIndex: startIndex + length,
			});
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
			<SlayLayout
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