import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { searchLessons } from 'actions/slay';
import CourseCard from 'components/Shared/CourseCard';
import SlayLayout from 'components/Layouts/SlayLayout';

const mapStateToProps = state => ({ lessons: state.slay.filteredCollectionItems });

const mapDispatchToProps = { searchLessons };

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
		const { params: { query } } = this.props;
		await this.props.searchLessons(query, { index: 0, count: 10 });
		this.setState({ loading: false });
	}

	async componentWillReceiveProps(newProps) {
		this.setState({ loading: true });
		const { params } = this.props;
		const { params: { query } } = newProps;
		if (params.query !== query) {
			await this.props.searchLessons(query, { index: 0, count: 10 });
		}
		this.setState({ loading: false });
	}

	render() {
		const { loading } = this.state;
		const { lessons, params: { query } } = this.props;
		return (
			<SlayLayout
				items={lessons}
				loading={loading}
				searchValue={query}
				cardComponent={CourseCard}
			/>
		);
	}
}

export default SlayDetailed;
