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
			loading: true,
		};
	}

	async componentWillMount() {
		await this.props.getBookmarkLessons({ id: 0, count: 10 });
		this.setState({ loading: false });
	}

	render() {
		const { loading } = this.state;
		const { lessons } = this.props;
		return (
			<SlayLayout
				items={lessons}
				loading={loading}
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
