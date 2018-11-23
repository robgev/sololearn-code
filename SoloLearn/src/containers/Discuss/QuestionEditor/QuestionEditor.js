import React, { Component } from 'react';
import { translate } from 'react-i18next';

import { PaperContainer, Input, Heading, FlexBox, SecondaryTextBlock } from 'components/atoms';
import { FlatButton } from 'components/molecules';
import { CountingMentionInput } from 'components/organisms';

import TagsInput from './TagsInput';
import './styles.scss';

@translate()
class QuestionEditor extends Component {
	constructor(props) {
		super(props);
		const { post } = props;
		this.state = {
			title: post !== null ? post.title : '',
			titleErrorText: '',
			tags: post !== null ? post.tags : [],
			tagsError: false,
			isReplyBoxOpen: false,
			replyLength: 0,
		};
	}

	static maxTagsLength = 10;
	static maxQuestionLength = 1024;
	static maxTitleLength = 128;

	static isEndingInNewline = str => str.match(/\n$/);

	onTitleChange = (e) => {
		const { value: title } = e.currentTarget;
		if (!QuestionEditor.isEndingInNewline(title) && title.length <= QuestionEditor.maxTitleLength) {
			this.setState({ title });
			if (title.length > 0) {
				this.setState({ titleErrorText: '' });
			}
		}
	}

	/* Chip input */

	canAddTag = () => this.state.tags.length < QuestionEditor.maxTagsLength;

	setTagsError = (tagsError) => {
		this.setState({ tagsError });
	}

	addTag = (tag) => {
		if (this.canAddTag() && !this.state.tags.includes(tag)) {
			this.setState(s => ({
				tags: [ ...s.tags, tag ],
			}));
			this.setTagsError(false);
			return true; // added
		}
		this.setTagsError(true);
		return false; // not added
	}

	deleteTag = (tag) => {
		this.setState(s => ({ tags: s.tags.filter(t => tag !== t) }));
		this.setTagsError(false);
	}

	/* End of tag input */

	handleSubmit = () => {
		const { t } = this.props;
		const { title, tags } = this.state;
		const isTitleEmpty = title.trim().length === 0;
		const isTagsEmpty = tags.length === 0;
		if (isTitleEmpty || isTagsEmpty) {
			this.setState({
				titleErrorText: isTitleEmpty ? t('question.invalid-title') : '',
				tagsError: isTagsEmpty,
			});
		} else {
			this.props.submit({
				title,
				message: this.mentionInput.getValue(),
				tags,
			});
		}
	}

	/* Mention input functions */
	openReplyBox = () => {
		this.setState({ isReplyBoxOpen: true });
	}
	closeReplyBox = () => {
		this.setState({ isReplyBoxOpen: false });
	}
	handleBlur = () => {
		if (this.state.replyLength <= 1) { this.closeReplyBox(); }
	}
	onLengthChange = (replyLength) => {
		if (this.mentionInput) {
			this.setState({ replyLength });
		}
	}
	/* End mention input functions */

	render() {
		const { t, isNew } = this.props;
		const {
			title, titleErrorText, tags, tagsError,
			isReplyBoxOpen, replyLength,
		} = this.state;
		return (
			<PaperContainer className="discuss_question-editor">
				<FlexBox column>
					<Heading>{isNew ? t('question.title') : t('discuss.editTitle')}</Heading>
					<FlexBox column className="counting-input">
						<Input
							error={titleErrorText !== ''}
							fullWidth
							value={title}
							onChange={this.onTitleChange}
							label={titleErrorText !== '' ? titleErrorText : t('question.title-placeholder')}
							maxLength={QuestionEditor.maxTitleLength}
						/>
						<SecondaryTextBlock className="count">
							{title.length} / {QuestionEditor.maxTitleLength}
						</SecondaryTextBlock>
					</FlexBox>
					<CountingMentionInput
						ref={(input) => { this.mentionInput = input; }}
						initText={this.props.post !== null ? this.props.post.message : null}
						getUsers={{ type: 'discuss' }}
						placeholder={!isReplyBoxOpen && replyLength === 0 ? t('question.message-placeholder') : ''}
						maxLength={QuestionEditor.maxQuestionLength}
					/>
					<FlexBox column className="counting-input">
						<TagsInput
							error={tagsError}
							tags={tags}
							addTag={this.addTag}
							deleteTag={this.deleteTag}
							setTagsError={this.setTagsError}
							canAddTag={this.canAddTag()}
						/>
						<SecondaryTextBlock className="count">
							{tags.length} / {QuestionEditor.maxTagsLength}
						</SecondaryTextBlock>
					</FlexBox>
					<FlatButton
						color="primary"
						onMouseDown={this.handleSubmit}
					>
						{isNew ? t('common.post-action-title') : t('common.save-action-title')}
					</FlatButton>
				</FlexBox>
			</PaperContainer>
		);
	}
}

QuestionEditor.defaultProps = {
	post: null,
};

export default QuestionEditor;
