import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { getCollectionItems } from 'actions/slay';
import CourseCard from 'components/Shared/CourseCard';
import SlayLayout from 'components/Layouts/SlayLayout';

// import 'styles/slayHome.scss';

const mapStateToProps = state => ({
	courses: state.courses,
	collectionCourses: state.slay.filteredCollectionItems,
});

const mapDispatchToProps = { getCollectionItems };

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
		if (collectionId !== 1) { // Default SoloLearn lessons
			const length =
				await this.props.getCollectionItems(collectionId, { index: startIndex, count: loadCount });
			this.setState({ loading: false, hasMore: length === loadCount });
		}
		this.setState({ loading: false });
	}

	loadMore = async () => {
		const { startIndex, loadCount } = this.state;
		const { params } = this.props;
		const collectionId = parseInt(params.collectionId, 10);
		const length =
			await this.props.getCollectionItems(collectionId, { index: startIndex, count: loadCount });
		this.setState({
			hasMore: length === loadCount,
			startIndex: startIndex + loadCount,
		});
	}

	render() {
		const { loading, hasMore } = this.state;
		const { params, collectionCourses, courses } = this.props;
		const collectionId = parseInt(params.collectionId, 10);
		const isCourses = collectionId === 1;
		const courseItems = !isCourses ? collectionCourses : courses;
		return (
			<SlayLayout
				loading={loading}
				hasMore={hasMore}
				items={courseItems}
				isCourses={isCourses}
				loadMore={this.loadMore}
				cardComponent={CourseCard}
			/>
		);
	}
}

export default SlayDetailed;
