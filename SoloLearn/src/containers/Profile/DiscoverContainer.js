import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';

import { getDiscoverSuggestions } from 'actions/discover';
import UserCard from 'components/UserCard';
import BusyWrapper from 'components/BusyWrapper';
import Layout from 'components/Layouts/GeneralLayout';
import { showError } from 'utils';

import 'styles/components/Layouts/DiscoverLayout.scss';

const mapStateToProps = ({ discoverSuggestions }) => ({ discoverSuggestions });

const mapDispatchToProps = { getDiscoverSuggestions };

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
		const { t, discoverSuggestions } = this.props;
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
								discoverSuggestions.length === 0
									? <div className="no-user-found">No users found</div>
									: discoverSuggestions.map(suggestion => (
										<UserCard
											{...suggestion}
											withFollowButton
											key={suggestion.id}
											badge={suggestion.badge}
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
