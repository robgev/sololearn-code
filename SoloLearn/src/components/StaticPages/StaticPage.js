import React, { Component } from 'react';
import Layout from 'components/Layouts/GeneralLayout';
import Service from 'api/service';

class StaticPage extends Component {
	state={
		content: null,
	}

	async componentWillMount() {
		const { page } = await Service.request('GetStaticPage', { alias: this.props.alias });
		this.setState({ content: page.pageContent });
		document.title = page.title;
	}

	render() {
		return (
			<Layout noSidebar>
				<div dangerouslySetInnerHTML={{ __html: this.state.content }} />
			</Layout>
		);
	}
}

export default StaticPage;
