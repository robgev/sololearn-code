import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { getLessonCollections } from 'actions/slay';
import SearchBar from 'components/Shared/SearchBar';
import BusyWrapper from 'components/Shared/BusyWrapper';
import CollectionCard from 'components/Shared/CollectionCard';

import 'styles/slayHome.scss';

const mapStateToProps = state => ({ collections: state.slayCollections });

const mapDispatchToProps = { getLessonCollections };

@connect(mapStateToProps, mapDispatchToProps)
class SlayHome extends PureComponent {
	constructor() {
		super();
		this.state = {
			searchText: '',
			loading: true,
		};
	}

	async componentWillMount() {
		await this.props.getLessonCollections({ id: 0, count: 10 });
		this.setState({ loading: false });
	}

	onChange = (searchText) => {
		this.setState({ searchText });
	}

	render() {
		const { collections } = this.props;
		const { searchText, loading } = this.state;
		return (
			<div className="slay-container">
				<div className="main-content">
					<SearchBar
						searchText={searchText}
						onChange={this.onChange}
						onRequestSearch={() => console.log(searchText)}
					/>
					<BusyWrapper isBusy={loading} style={{ minHeight: '60vh' }}>
						{collections.map(collection => (
							<CollectionCard
								key={collection.name}
								name={collection.name}
							/>
						))}
					</BusyWrapper>
				</div>
				<div className="sidebar" />
			</div>
		);
	}
}

export default SlayHome;
