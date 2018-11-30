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
	playground = new IPlayground({
		inline: this.props.inline,
		userId: this.props.userId,
		publicId: this.props.publicId,
		language: this.props.language,
		lessonCodeId: this.props.lessonCodeId,
	})

	componentDidMount() {
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
		const isMinimal = !data.id || isInline || isFullscreen || !publicId;
		const LayoutContainer = isInline ? Container : Layout;
		const MainContainer = isInline ? Container : PaperContainer;
		const EditorContainer = !hasLiveOutput ? SplitPane : Fragment;
		return (
			<LayoutContainer className={isFullscreen ? 'fullscreen' : ''}>
				{isFetching
					? <EmptyCard loading paper />
					: (
						<Fragment>
							{ !isMinimal &&
								<CodeInfoToolbar playground={this.playground} />
							}
							<MainContainer className="playground_main-container">
								<EditorContainer
									playground={this.playground}
								>
									<Editor playground={this.playground} />
									<CodeOutput playground={this.playground} />
								</EditorContainer>
								<CodeActions playground={this.playground} />
								<InputPopup playground={this.playground} />
							</MainContainer>
							{!isMinimal &&
								<Comments
									type={1}
									commentsType="code"
									id={data.id}
									commentsCount={data.comments}
								/>
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
