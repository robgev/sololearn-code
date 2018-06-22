import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';

import { getDiscoverSuggestions } from 'actions/discover';
import UserCard from 'components/Shared/UserCard';
import BusyWrapper from 'components/Shared/BusyWrapper';
import Layout from 'components/Layouts/GeneralLayout';

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
		this.setState({ loading: true });
		await this.props.getDiscoverSuggestions(query);
		this.setState({ loading: false });
	}

	render() {
		const { loading } = this.state;
		const { t, discoverSuggestions } = this.props;
		return (
			<Layout>
				<Paper className="discover-container">
					<BusyWrapper
						isBusy={loading}
						title={t('discover_peers.title')}
						wrapperClassName="discover-busy-wrapper"
						style={{ minHeight: '60vh' }}
						loadingComponent={
							<CircularProgress
								size={100}
							/>
						}
					>
						<div className="discover-wrapper">
							{discoverSuggestions.map(collection => (
								<UserCard
									withLink
									{...collection}
									key={collection.id}
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
