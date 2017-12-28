import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { getLessonCollections } from 'actions/slay';
import SlayLayout from 'components/Layouts/SlayLayout';
import CollectionCard from 'components/Shared/CollectionCard';

const mapStateToProps = state => ({ collections: state.slay.slayCollections });

const mapDispatchToProps = { getLessonCollections };

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
		const length = await this.props.getLessonCollections({ index: startIndex, count: loadCount });
		this.setState({
			loading: false,
			hasMore: length === loadCount,
			startIndex: startIndex + loadCount,
		});
	}

	loadMore = async () => {
		const { startIndex, loadCount } = this.state;
		const length =
			await this.props.getLessonCollections({ index: startIndex, count: loadCount });
		this.setState({
			hasMore: length === loadCount,
			startIndex: startIndex + loadCount,
		});
	}

	render() {
		const { collections } = this.props;
		const { loading, hasMore } = this.state;
		return (
			<SlayLayout
				loading={loading}
				hasMore={hasMore}
				items={collections}
				loadMore={this.loadMore}
				cardComponent={CollectionCard}
			/>
		);
	}
}

export default SlayHome;
