import React, { Component, Fragment } from 'react';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { Layout, EmptyCard } from 'components/molecules';
import { PaperContainer } from 'components/atoms';
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
			isFetching,
			isFullscreen,
			hasLiveOutput,
		} = this.playground;
		const isMinimal = !data.id || isInline || isFullscreen;
		const EditorContainer = !hasLiveOutput ? SplitPane : Fragment;
		return (
			<Layout className={isFullscreen ? 'fullscreen' : ''}>
				{
					isFetching
						? <EmptyCard loading paper />
						: (
							<Fragment>
								{!isMinimal &&
									<CodeInfoToolbar playground={this.playground} />
								}
								<PaperContainer className="playground_main-container">
									<EditorContainer
										playground={this.playground}
									>
										<Editor playground={this.playground} />
										<CodeOutput playground={this.playground} />
									</EditorContainer>
									<CodeActions playground={this.playground} />
									<InputPopup playground={this.playground} />
								</PaperContainer>
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
			</Layout>
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
