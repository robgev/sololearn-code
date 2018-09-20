import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';

import { getDiscoverSuggestions, removeSearchSuggestions } from 'actions/discover';
import UserCard from 'components/UserCard';
import BusyWrapper from 'components/BusyWrapper';
import Layout from 'components/Layouts/GeneralLayout';
import { showError } from 'utils';
import {
	discoverIdsSelector,
	discoverEntitiesSelector,
	discoverSearchIdsSelector,
} from 'reducers/discover.reducer.js';

import 'styles/components/Layouts/DiscoverLayout.scss';

const mapStateToProps = (state, { params: { query } }) => ({
	discoverEntities: discoverEntitiesSelector(state),
	discoverIds: query ? discoverSearchIdsSelector(state) : discoverIdsSelector(state),
});

const mapDispatchToProps = { removeSearchSuggestions, getDiscoverSuggestions };

@connect(mapStateToProps, mapDispatchToProps)
@translate()
class DiscoverContainer extends PureComponent {
	state = {
		loading: true,
	};

	componentDidMount() {
		document.title = 'SoloLearn | Discover';
		this.handleQuery(this.props.params.query);
	}

	componentDidUpdate(prevProps) {
		const { query } = this.props.params;
		if (query !== prevProps.params.query) {
			this.handleQuery(query);
		}
	}

	componentWillUnmount = () => {
		this.props.removeSearchSuggestions();
	}

	handleQuery = async (query) => {
		try {
			this.setState({ loading: true });
			await this.props.getDiscoverSuggestions(query);
		} catch (e) {
			showError(e, 'Error while trying to get user list');
		} finally {
			this.setState({ loading: false });
		}
	}

	render() {
		const { loading } = this.state;
		const { t, discoverIds, discoverEntities } = this.props;
		return (
			<Layout noSidebar>
				<Paper
					className="discover-container"
					style={
						loading
							? {
								display: 'flex',
								minHeight: '60vh',
								alignItems: 'center',
								justifyContent: 'center',
							}
							: null
					}
				>
					<BusyWrapper
						isBusy={loading}
						title={t('discover_peers.title')}
						wrapperClassName="discover-busy-wrapper"
						loadingComponent={
							<CircularProgress
								size={30}
							/>
						}
					>
						<div className="discover-wrapper">
							{
								discoverIds.length === 0
									? <div className="no-user-found">No users found</div>
									: discoverIds.map(id => (
										<UserCard
											key={id}
											withFollowButton
											{...discoverEntities[id]}
										/>
									))
							}
						</div>
					</BusyWrapper>
				</Paper>
			</Layout>
		);
	}
}

export default DiscoverContainer;
