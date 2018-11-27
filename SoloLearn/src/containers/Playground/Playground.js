import React, { Component } from 'react';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { Layout } from 'components/molecules';
import { Loading, PaperContainer } from 'components/atoms';
import Comments from 'containers/Comments/CommentsBase';

import IPlayground from './IPlayground';
import { Editor, CodeInfoToolbar, InputPopup, CodeActions } from './components';
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
			isFetching,
			isFullscreen,
			isInline,
			data,
		} = this.playground;
		const isMinimal = !data.id || isInline || isFullscreen;
		return isFetching
			? <Loading />
			: (
				<Layout className={isFullscreen ? 'fullscreen' : ''}>
					{ !isMinimal &&
						<CodeInfoToolbar playground={this.playground} />
					}
					<PaperContainer className="playground_main-container">
						<Editor playground={this.playground} />
						<CodeActions playground={this.playground} />
						{!isMinimal &&
						<Comments
							type={1}
							commentsType="code"
							id={data.id}
							commentsCount={data.comments}
						/>
						}
						<InputPopup playground={this.playground} />
					</PaperContainer>
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
