import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { getDiscoverSuggestions } from 'actions/discover';
import UserCard from 'components/Shared/UserCard';
import BusyWrapper from 'components/Shared/BusyWrapper';

import 'styles/components/Layouts/DiscoverLayout.scss';

const mapStateToProps = ({ discoverSuggestions }) => ({ discoverSuggestions });

const mapDispatchToProps = { getDiscoverSuggestions };

@connect(mapStateToProps, mapDispatchToProps)
class DiscoverContainer extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
		};
	}

	async componentWillMount() {
		const { params: { query } } = this.props;
		await this.props.getDiscoverSuggestions(query);
		this.setState({
			loading: false,
		});
	}

	render() {
		const { loading } = this.state;
		const { discoverSuggestions } = this.props;
		return (
			<div className="discover-container">
				<div className="main-content">
					<BusyWrapper
						isBusy={loading}
						style={{ minHeight: '60vh' }}
					>
						{discoverSuggestions.map(collection => (
							<UserCard
								{...collection}
								key={collection.name}
							/>
						))}
					</BusyWrapper>
				</div>
				<div className="sidebar" />
			</div>
		);
	}
}

export default DiscoverContainer;
