import React, { PureComponent } from 'react';

class Sidebar extends PureComponent {
	state = {
		scrollTop: 0,
	};

	sidebarVisibleSize = 300 // px;
	sidebarOffset = this.sidebarVisibleSize - 70 // some paddings and stuff in this 70px

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}

	componentWillUnmount() {
		this.threshold = 0;
		window.removeEventListener('scroll', this.handleScroll);
	}

	handleScroll = () => {
		// this.sidebarElem.scrollHeight - height of our sidebar
		// document.body.clientHeight - height of the screen

		// this.sidebarElem.scrollHeight - document.body.clientHeight - scroll amount
		// we need to scroll if we want to completely scroll out the sidebar

		// (this.sidebarElem.scrollHeight - document.body.clientHeight) + 300 - amount
		// we need to scroll to see only 300 px of our sidebar.

		// this.isScrollable - in some pages sidebars can be too small for this logic
		// So we check if we need that logic or not
		// if not, we just make the sidebar sticky at start
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
		this.threshold = (this.sidebarElem.scrollHeight - document.body.clientHeight) + this.sidebarVisibleSize; // "Cut" only bottom 300 px of the sidebar
		this.isScrollable = this.sidebarElem.scrollHeight > document.body.clientHeight;
		this.setState({ scrollTop });
	}

	render() {
		const { scrollTop } = this.state;
		const { children } = this.props;
		const reachedThreshold = scrollTop > this.threshold;
		return (
			<div className="sidebar-placeholder">
				<div
					ref={(sidebarElem) => { this.sidebarElem = sidebarElem; }}
					className={`sidebar ${reachedThreshold || !this.isScrollable ? 'sticky' : ''}`}
					style={{
						bottom: (reachedThreshold && this.isScrollable) ? this.sidebarOffset : 'initial',
					}}
				>
					{children}
				</div>
			</div>
		);
	}
}

export default Sidebar;
