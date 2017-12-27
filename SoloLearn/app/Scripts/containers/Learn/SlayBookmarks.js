import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { getBookmarkLessons } from 'actions/slay';
import CourseCard from 'components/Shared/CourseCard';
import SlayLayout from 'components/Layouts/SlayLayout';

const mapStateToProps = state => ({ lessons: state.slay.filteredCollectionItems });

const mapDispatchToProps = { getBookmarkLessons };

@connect(mapStateToProps, mapDispatchToProps)
class SlayHome extends PureComponent {
	constructor() {
		super();
		this.state = {
			startIndex: 0,
			loadCount: 10,
			loading: true,
			hasMore: true,
		};
	}

	async componentWillMount() {
		const { startIndex, loadCount } = this.state;
		const length =
			await this.props.getBookmarkLessons({ index: startIndex, count: loadCount });
		this.setState({
			loading: false,
			hasMore: length === loadCount,
			startIndex: startIndex + loadCount,
		});
	}

	loadMore = async () => {
		const { startIndex, loadCount } = this.state;
		const length =
			await this.props.getBookmarkLessons({ index: startIndex, count: loadCount });
		this.setState({
			hasMore: length === loadCount,
			startIndex: startIndex + loadCount,
		});
	}

	render() {
		const { loading, hasMore } = this.state;
		const { lessons } = this.props;
		return (
			<SlayLayout
				items={lessons}
				loading={loading}
				hasMore={hasMore}
				cardComponent={CourseCard}
			>
				{lessons.length ||
					<p>There are no bookmarks yet</p>
				}
			</SlayLayout>
		);
	}
}

export default SlayHome;
