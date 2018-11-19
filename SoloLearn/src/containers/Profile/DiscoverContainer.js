import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { getDiscoverSuggestions, removeSearchSuggestions } from 'actions/discover';
import UserCard from 'components/UserCard';
import BusyWrapper from 'components/BusyWrapper';
import { showError } from 'utils';
import {
	discoverIdsSelector,
	discoverEntitiesSelector,
	discoverSearchIdsSelector,
} from 'reducers/discover.reducer.js';

import {
	Container,
	PaperContainer,
	TextBlock,
	Loading,
} from 'components/atoms';
import { Layout } from 'components/molecules';

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
			<Layout>
				<PaperContainer
					className={`discover-container ${loading ? ' loading' : ''}`}
				>
					<BusyWrapper
						isBusy={loading}
						title={t('discover_peers.title')}
						wrapperClassName="discover-busy-wrapper"
						loadingComponent={
							<Loading/>
						}
					>
						<Container className={`discover-wrapper ${discoverIds.length === 0 ? 'centered' : ''}`}>
							{
								discoverIds.length === 0
									? <TextBlock className="no-user-found">{t('common.no-results')}</TextBlock>
									: discoverIds.map(id => (
										<UserCard
											key={id}
											withFollowButton
											{...discoverEntities[id]}
										/>
									))
							}
						</Container>
					</BusyWrapper>
				</PaperContainer>
			</Layout>
		);
	}
}

export default DiscoverContainer;
