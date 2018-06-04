import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';

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

	componentWillMount() {
		this.handleQuery(this.props.params.query);
		document.title = 'Sololearn | Discover';
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.params.query !== nextProps.params.query) {
			this.handleQuery(nextProps.params.query);
		}
	}

	handleQuery = async (query) => {
		this.setState({ loading: true });
		await this.props.getDiscoverSuggestions(query);
		this.setState({ loading: false });
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
						loadingComponent={
							<CircularProgress
								size={100}
							/>
						}
					>
						{discoverSuggestions.map(collection => (
							<UserCard
								withLink
								{...collection}
								key={collection.id}
							/>
						))}
					</BusyWrapper>
				</div>
				<div className="sidebar-placeholder">
					<div className="sidebar" />
				</div>
			</div>
		);
	}
}

export default DiscoverContainer;
