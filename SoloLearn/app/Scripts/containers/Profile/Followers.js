// General modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Redux modules
import { isLoaded } from 'reducers';
import { getFollowersInternal } from 'actions/profile';

// Additional data and components
import LoadingOverlay from 'components/Shared/LoadingOverlay';
import Follower from './FollowerItem';

const styles = {
	container: {
		position: 'relative',
		height: '500px',
		overflowY: 'scroll',
	},

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

		fullyLoaded: {
			display: 'none',
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

class Followers extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			fullyLoaded: false,
		};

		this.handleScroll = this.handleScroll.bind(this);
	}

	loadFollowers(index, userId) {
		this.setState({ isLoading: true });

		return this.props.getFollowers(index, userId).then((count) => {
			if (count < 20) {
				this.setState({ fullyLoaded: true });
			}

			this.setState({ isLoading: false });
		}).catch((error) => {
			console.log(error);
		});
	}

	// Check scroll state
	handleScroll() {
		const scollingArea = document.getElementById('followers');
		const neededScrollTop = scollingArea.scrollHeight - scollingArea.offsetHeight;
		if (scollingArea.scrollTop === neededScrollTop && !this.state.fullyLoaded) {
			if (!this.state.isLoading && !this.state.fullyLoaded) {
				this.loadFollowers(this.props.followers.length, this.props.userId);
			}
		}
	}

	renderFollowers = () => this.props.followers.map(follower => (
		<Follower key={follower.id} follower={follower} fromFollowers />
	))

	render() {
		const { isFollowersLoaded, followers } = this.props;
		const { fullyLoaded, isLoading } = this.state;

		return (
			<div id="followers" style={styles.container}>
				{(isFollowersLoaded && followers.length > 0) && this.renderFollowers()}
				{
					((!isFollowersLoaded || followers.length === 0) && !fullyLoaded) &&
					<LoadingOverlay />
				}
				{
					followers.length > 0 &&
					<div
						className="loading"
						style={{
							...(isLoading ? {}
								: { ...styles.bottomLoading.base, ...styles.bottomLoading.active }),
							...(fullyLoaded ? styles.bottomLoading.fullyLoaded : styles.bottomLoading.base),
						}}
					>

						<LoadingOverlay size={30} />
					</div>
				}
				{(fullyLoaded && followers.length === 0) &&
					<div style={styles.noResults}>No Results Found</div>
				}
			</div>
		);
	}

	componentWillMount() {
		if (!this.props.isFollowersLoaded) {
			this.loadFollowers(0, this.props.userId);
		}
	}

	// Add event listeners after component mounts
	componentDidMount() {
		const scollingArea = document.getElementById('followers');
		scollingArea.addEventListener('scroll', this.handleScroll);
	}

	// Remove event listeners after component unmounts
	componentWillUnmount() {
		const scollingArea = document.getElementById('followers');
		scollingArea.removeEventListener('scroll', this.handleScroll);
	}
}

function mapStateToProps(state) {
	return {
		followers: state.profile.followers,
		isFollowersLoaded: isLoaded(state, 'followers'),
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		getFollowers: getFollowersInternal,
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Followers);
