import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { getLessonsByAuthor } from 'actions/slay';
import CourseCard from 'components/CourseCard';
import SlayLayout from 'components/Layouts/SlayLayout';

// import 'styles/slayHome.scss';

const mapStateToProps = state => ({
	collectionCourses: state.slay.lessonsByUser,
	authorName: state.slay.activeLesson.userName,
});

const mapDispatchToProps = { getLessonsByAuthor };

@connect(mapStateToProps, mapDispatchToProps)
class SlayMoreByAuthor extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			startIndex: 0,
			loadCount: 10,
			loading: true,
			hasMore: true,
		};
		document.title = `Sololearn | More lessons by ${props.authorName}`;
	}

	async componentWillMount() {
		// Need to rewrite this part after architecture change.
		// We don't need to have this much of difference between
		// initial SL lessons and slay lessons
		const { params } = this.props;
		const { startIndex, loadCount } = this.state;
		const userId = parseInt(params.userId, 10);
		const length =
			await this.props.getLessonsByAuthor(0, userId, { index: startIndex, count: loadCount });
		this.setState({ loading: false, hasMore: length === loadCount });
		this.setState({ loading: false });
	}

	loadMore = async () => {
		const { startIndex, loadCount } = this.state;
		const { params } = this.props;
		const userId = parseInt(params.userId, 10);
		const length =
			await this.props.getLessonsByAuthor(0, userId, { index: startIndex, count: loadCount });
		this.setState({
			hasMore: length === loadCount,
			startIndex: startIndex + loadCount,
		});
	}

	render() {
		const { loading, hasMore } = this.state;
		const { collectionCourses } = this.props;
		return (
			<SlayLayout
				loading={loading}
				hasMore={hasMore}
				items={collectionCourses}
				loadMore={this.loadMore}
				cardComponent={CourseCard}
			/>
		);
	}
}

export default SlayMoreByAuthor;
