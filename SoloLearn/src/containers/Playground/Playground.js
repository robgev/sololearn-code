import React, { Component, Fragment } from 'react';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { Container, PaperContainer } from 'components/atoms';
import { Layout, EmptyCard } from 'components/molecules';
import Comments from 'containers/Comments/CommentsBase';

import IPlayground from './IPlayground';
import {
	Editor,
	SplitPane,
	CodeOutput,
	InputPopup,
	CodeActions,
	CodeInfoToolbar,
} from './components';
import './styles.scss';

@translate()
@observer
class Playground extends Component {
	constructor(props) {
		super(props);
		this.playground = new IPlayground({
			inline: this.props.inline,
			userId: this.props.userId,
			publicId: this.props.publicId === 'new' ? null : this.props.publicId,
			language: this.props.language,
			lessonCodeId: this.props.lessonCodeId,
		});
		this.playground.getCode();
		ReactGA.ga('send', 'screenView', { screenName: 'Code Editor Page' });
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.language !== this.playground.language) {
			this.playground.changeLanguage(nextProps.language);
		}
	}

	render() {
		const {
			data,
			isInline,
			publicId,
			isFetching,
			isFullscreen,
			hasLiveOutput,
		} = this.playground;
		// If it's not a public code or we are not in fullscreen mode
		// We don't need some of the elements on the page.
		const isMinimal = !data.id || isInline || !publicId;
		const LayoutContainer = isInline ? Container : Layout;
		const MainContainer = isInline ? Container : PaperContainer;
		const EditorContainer = !hasLiveOutput ? SplitPane : Fragment;
		const fullScreenCN = isInline ? '' : 'fullscreen';
		const sidebarCN = (isFullscreen || isMinimal) ? 'no-sidebar' : '';
		return (
			<LayoutContainer className={`${fullScreenCN} ${sidebarCN}`}>
				{isFetching
					? <EmptyCard className="playground_full-loading" loading />
					: (
						<Fragment>
							<MainContainer className={`playground_main-container ${isInline ? 'bordered' : ''}`}>
								<EditorContainer
									playground={this.playground}
								>
									<Editor onClose={this.props.onClose} playground={this.playground} />
									<CodeOutput playground={this.playground} />
								</EditorContainer>
								<CodeActions playground={this.playground} />
								<InputPopup playground={this.playground} />
							</MainContainer>
							{!(isMinimal || isFullscreen) &&
								<Container className="playground_sidebar scrollbar">
									<CodeInfoToolbar playground={this.playground} />
									<Comments
										type={1}
										id={data.id}
										useWindow={false}
										commentsType="code"
										commentsCount={data.comments}
									/>
								</Container>
							}
						</Fragment>
					)
				}
			</LayoutContainer>
		);
	}
}

Playground.propTypes = {
	inline: PropTypes.bool,
	userId: PropTypes.number.isRequired,
	publicId: PropTypes.string,
	language: PropTypes.string,
	lessonCodeId: PropTypes.string,
};

Playground.defaultProps = {
	inline: false,
	publicId: null,
	language: null,
	lessonCodeId: null,
};

export default Playground;
