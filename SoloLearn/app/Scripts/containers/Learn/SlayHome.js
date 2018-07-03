import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
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
		document.title = 'Sololearn | Learn';
	}

	async componentWillMount() {
		const { startIndex, loadCount } = this.state;
		const { collections, getLessonCollections } = this.props;
		if (!collections.length) {
			const length = await getLessonCollections({ index: startIndex, count: loadCount }) - 1;
			this.setState({
				loading: false,
				hasMore: length === loadCount,
				startIndex: startIndex + loadCount,
			});
		} else {
			this.setState({
				loading: false,
				startIndex: startIndex + collections.length,
				// If number of collections is divisible by the number
				// of items we get on every load, then there is 1 more collection
				hasMore: collections.length % loadCount === 0,
			});
		}
		ReactGA.ga('send', 'screenView', { screenName: 'Home Store Page' });
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
				noDisplay={false}
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
