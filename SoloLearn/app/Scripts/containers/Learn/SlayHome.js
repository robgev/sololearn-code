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
			loading: true,
		};
	}

	async componentWillMount() {
		await this.props.getLessonCollections({ id: 0, count: 10 });
		this.setState({ loading: false });
	}

	render() {
		const { collections } = this.props;
		const { loading } = this.state;
		return (
			<SlayLayout
				loading={loading}
				items={collections}
				cardComponent={CollectionCard}
			/>
		);
	}
}

export default SlayHome;
