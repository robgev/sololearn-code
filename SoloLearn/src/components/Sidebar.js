import React, { PureComponent } from 'react';

class Sidebar extends PureComponent {
	state = {
		scrollTop: 0,
	};

	stickyThreshold = 300; // px

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	handleScroll = () => {
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
		this.setState({ scrollTop });
	}

	render() {
		const { scrollTop } = this.state;
		const { children } = this.props;
		return (
			<div className="sidebar-placeholder">
				<div className={`sidebar ${scrollTop > this.stickyThreshold ? 'sticky' : ''}`}>
					{children}
				</div>
			</div>
		);
	}
}

export default Sidebar;
