import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { searchLessons } from 'actions/slay';
import SlayDetailedShimmer from 'components/Shimmers/SlayDetailedShimmer';
import { CodePenCard, LayoutGenerator } from './components';

const mapStateToProps = state => ({ lessons: state.slay.filteredCollectionItems });

const mapDispatchToProps = { searchLessons };

@connect(mapStateToProps, mapDispatchToProps)
class SlayDetailed extends PureComponent {
	constructor() {
		super();
		this.state = {
			startIndex: 0,
			loadCount: 20,
			loading: true,
			hasMore: true,
		};
		document.title = 'Sololearn | Slay Search';
	}

	async componentWillMount() {
		// Need to rewrite this part after architecture change.
		// We don't need to have this much of difference between
		// initial SL lessons and slay lessons
		const { startIndex, loadCount } = this.state;
		const { params: { query } } = this.props;
		const length =
			await this.props.searchLessons(query, { index: startIndex, count: loadCount });
		this.setState({
			loading: false,
			hasMore: length === loadCount,
			startIndex: startIndex + loadCount,
		});
	}

	async componentWillReceiveProps(newProps) {
		const { loadCount } = this.state;
		const { params } = this.props;
		const { params: { query } } = newProps;
		if (params.query !== query) {
			this.setState({ loading: true, startIndex: 0 });
			const length =
				await this.props.searchLessons(query, { index: 0, count: loadCount });
			this.setState({
				loading: false,
				hasMore: length === loadCount,
				startIndex: loadCount,
			});
		}
	}

	loadMore = async () => {
		const { startIndex, loadCount } = this.state;
		const { params: { query } } = this.props;
		const length =
			await this.props.searchLessons(query, { index: startIndex, count: loadCount });
		this.setState({
			hasMore: length === loadCount,
			startIndex: startIndex + loadCount,
		});
	}

	render() {
		const { loading, hasMore } = this.state;
		const { lessons } = this.props;
		return (
			<LayoutGenerator
				paper
				noSidebar
				items={lessons}
				loading={loading}
				hasMore={hasMore}
				loadMore={this.loadMore}
				cardComponent={CodePenCard}
				loadingComponent={SlayDetailedShimmer}
				wrapperStyle={{
					alignItems: 'initial',
				}}
				style={{
					width: 'initial',
					flexDirection: 'row',
					flexWrap: 'wrap',
					justifyContent: 'flex-start',
				}}
			/>
		);
	}
}

export default SlayDetailed;
