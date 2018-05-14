// React modules
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import Radium from 'radium';
import { connect } from 'react-redux';

// Redux modules
import { getCodesInternal, emptyCodes } from 'actions/playground';

// Additional components
import LoadingOverlay from 'components/Shared/LoadingOverlay';
import InfiniteVirtualizedList from 'components/Shared/InfiniteVirtualizedList';
import CodeShimmer from 'components/Shared/Shimmers/CodeShimmer';
import CodeItem from './CodeItem';

const styles = {
	bottomLoading: {
		base: {
			position: 'relative',
			width: '100%',
			height: '50px',
			visibility: 'hidden',
			opacity: 0,
			transition: 'opacity ease 300ms, -webkit-transform ease 300ms',
		},

		active: {
			visibility: 'visible',
			opacity: 1,
			transform: 'translateY(0)',
		},
	},

	noResults: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%,-50%)',
		fontSize: '20px',
		color: '#777',
	},
};

class Codes extends Component {
	state = {
		isLoading: true,
	}
	componentWillMount() {
		if (!this.props.isLoaded) {
			this.loadCodes();
		}
		document.title = 'Sololearn | Code';
		ReactGA.ga('send', 'screenView', { screenName: 'Codes Page' });
	}

	loadCodes = async () => {
		try {
			const {
				codes, ordering, language, userId,
			} = this.props;
			const index = codes ? codes.length : 0;
			this.setState({ isLoading: true });
			await this.props.getCodesInternal(index, ordering, language, '', userId);
			this.setState({ isLoading: false });
		} catch (e) {
			console.log(e);
		}
	}

	// Load codes when condition changes
	loadCodesByState = async () => {
		await this.props.emptyCodes();
		this.loadCodes();
	}

	renderCode = code => (
		<CodeItem code={code} />
	)

	render() {
		const { isLoading } = this.state;
		const {
			isLoaded, codes, isUserProfile, t,
		} = this.props;
		return (
			<div>
				{(isLoaded && codes.length > 0) &&
					<InfiniteVirtualizedList
						list={codes}
						item={this.renderCode}
						loadMore={this.loadCodes}
						rowHeight={100}
						window
					/>
				}
				{(isLoading && !isUserProfile)
					&& <CodeShimmer />}
				{ codes.length === 0 &&
				<p>{t('code.no-saved-code-title')}</p>
				}
				{
					((isUserProfile || codes.length > 0)) &&
					<div
						style={!this.state.isLoading ?
							styles.bottomLoading.base :
							[ styles.bottomLoading.base, styles.bottomLoading.active ]}
					>
						<LoadingOverlay size={30} />
					</div>
				}
			</div>
		);
	}
}

const mapDispatchToProps = {
	getCodesInternal,
	emptyCodes,
};

export default connect(null, mapDispatchToProps, null, { withRef: true })(Radium(Codes));
