import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';

import { getMoreOnTopic, setSelectedCollection } from 'actions/slay';
import { CodePenCard, LayoutGenerator } from './components';
import SlayDetailedShimmer from 'components/Shimmers/SlayDetailedShimmer';

const mapStateToProps = state => ({
	courses: state.courses,
	collectionCourses: state.slay.filteredCollectionItems,
});

const mapDispatchToProps = { getMoreOnTopic, setSelectedCollection };

@connect(mapStateToProps, mapDispatchToProps)
class SlayDetailed extends PureComponent {
	constructor() {
		super();
		this.state = {
			startIndex: 0,
			loadCount: 10,
			loading: true,
			hasMore: true,
			selectedCourse: null,
		};
		document.title = 'More on Topic';
	}

	async componentWillMount() {
		const { params, courses } = this.props;
		const { startIndex, loadCount } = this.state;
		const courseId = parseInt(params.courseId, 10);
		const selectedCourse = courses.find(c => c.id === courseId);
		const length =
			await this.props.getMoreOnTopic({
				courseId,
				count: loadCount,
				index: startIndex,
			});

		this.setState({
			loading: false,
			selectedCourse,
			hasMore: length === loadCount,
			startIndex: startIndex + length,
		});
		ReactGA.ga('send', 'screenView', { screenName: 'More on Topic Page' });
	}

	loadMore = async () => {
		const { startIndex, loadCount } = this.state;
		const { params } = this.props;
		const courseId = parseInt(params.courseId, 10);
		if (startIndex !== 0) {
			const length =
				await this.props.getMoreOnTopic({
					courseId,
					count: loadCount,
					index: startIndex,
				});
			this.setState({
				hasMore: length === loadCount,
				startIndex: startIndex + loadCount,
			});
		}
	}

	render() {
		const { loading, hasMore, selectedCourse } = this.state;
		const {
			collectionCourses,
		} = this.props;
		return (
			<LayoutGenerator
				paper
				noSidebar
				loading={loading}
				hasMore={hasMore}
				items={collectionCourses}
				loadMore={this.loadMore}
				cardComponent={CodePenCard}
				loadingComponent={SlayDetailedShimmer}
				title={loading ? '' : (selectedCourse ? `More related to ${selectedCourse.name}` : 'More on Topic')}
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
