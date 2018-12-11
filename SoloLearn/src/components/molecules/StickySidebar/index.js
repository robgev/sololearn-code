import React, { Component } from 'react';
import { Container } from 'components/atoms';
import { RefLink } from '../RefLink';

import './styles.scss';

class Sidebar extends Component {
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
		const scrollTop =
			window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
		// "Cut" only bottom 300 px of the sidebar
		this.threshold =
			((this.sidebarElem.scrollHeight + 20) - document.body.clientHeight) + this.sidebarVisibleSize;
		// 20px added for padding top of the page (under the header)
		this.isScrollable = (this.sidebarElem.scrollHeight + 20) >= document.body.clientHeight;
		this.setState({ scrollTop });
	}

	render() {
		const { scrollTop } = this.state;
		const { children } = this.props;
		const reachedThreshold = scrollTop > this.threshold;
		return (
			<Container className="sidebar-placeholder">
				<Container
					ref={(sidebarElem) => { this.sidebarElem = sidebarElem; }}
					className={`sidebar-wrapper ${reachedThreshold || !this.isScrollable ? 'sticky' : ''}`}
					style={{
						bottom: (reachedThreshold && this.isScrollable) ? this.sidebarOffset : 'initial',
					}}
				>
					<Container className="sidebar-main-content">
						{children}
					</Container>
					<Container className="sidebar-static-pages">
						<RefLink className="static-link hoverable" to="/privacy">
							Privacy
						</RefLink>
						<RefLink className="static-link hoverable" to="/faq">
							FAQ
						</RefLink>
						<RefLink className="static-link hoverable" to="/contact">
							Contact
						</RefLink>
					</Container>
				</Container>
			</Container>
		);
	}
}

export default Sidebar;
