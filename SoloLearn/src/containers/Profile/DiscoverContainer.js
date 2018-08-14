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
		try {
			this.setState({ loading: true });
			await this.props.getDiscoverSuggestions(query);
			this.setState({ loading: false });
		} catch (e) {
			showError(e, 'Error while trying to get user list');
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
							{discoverSuggestions.map(suggestion => (
								<UserCard
									withLink
									{...suggestion}
									withFollowButton
									key={suggestion.id}
								/>
							))}
						</div>
					</BusyWrapper>
				</Paper>
			</Layout>
		);
	}
}

export default DiscoverContainer;
