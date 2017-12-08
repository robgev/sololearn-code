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
			loading: true,
		};
	}

	async componentWillMount() {
		// Need to rewrite this part after architecture change.
		// We don't need to have this much of difference between
		// initial SL lessons and slay lessons
		const { params } = this.props;
		const collectionId = parseInt(params.collectionId, 10);
		if (collectionId !== 1) {
			await this.props.getCollectionItems(collectionId, { index: 0, count: 10 });
		}
		this.setState({ loading: false });
	}

	render() {
		const { loading } = this.state;
		const { params, collectionCourses, courses } = this.props;
		const collectionId = parseInt(params.collectionId, 10);
		const courseItems = collectionId !== 1 ? collectionCourses : courses;
		return (
			<SlayLayout
				loading={loading}
				items={courseItems}
				cardComponent={CourseCard}
			/>
		);
	}
}

export default SlayDetailed;
