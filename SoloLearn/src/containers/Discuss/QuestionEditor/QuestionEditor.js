import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { PaperContainer, Input, Heading, FlexBox, SecondaryTextBlock } from 'components/atoms';
import {
	PromiseButton,
	FlatButton,
	ProfileAvatar,
	UsernameLink,
	ModBadge,
} from 'components/molecules';
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
			return Promise.resolve();
		}
		return this.props.submit({
			title,
			message: this.mentionInput.getValue(),
			tags,
		});
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
		const { t, isNew, profile } = this.props;
		const {
			title, titleErrorText, tags, tagsError,
			isReplyBoxOpen, replyLength,
		} = this.state;
		return (
			<PaperContainer className="discuss_question-editor">
				<FlexBox column>
					<Heading className="question-heading">{isNew ? t('question.title') : t('discuss.editTitle')}</Heading>
					<FlexBox fullWidth>
						<ProfileAvatar
							className="user-avatar"
							user={profile}
						/>
						<FlexBox column className="discuss-main-wrapper">
							<FlexBox className="author" align>
								<UsernameLink
									className="user-name"
									to={`/profile/${profile.id}`}
								>
									{profile.name}
								</UsernameLink>
								<ModBadge
									className="badge"
									badge={profile.badge}
								/>
							</FlexBox>

							<FlexBox column className="counting-input">
								<SecondaryTextBlock className="discuss-input-titles">{t('code_playground.details.name')}</SecondaryTextBlock>
								<Input
									variant="outlined"
									error={titleErrorText !== ''}
									fullWidth
									value={title}
									onChange={this.onTitleChange}
									maxLength={QuestionEditor.maxTitleLength}
									className="discuss-input"
								/>
								<SecondaryTextBlock className="count">
									{title.length} / {QuestionEditor.maxTitleLength}
								</SecondaryTextBlock>
							</FlexBox>
							<SecondaryTextBlock className="discuss-input-titles">{t('question.message-placeholder')}</SecondaryTextBlock>
							<CountingMentionInput
								ref={(input) => { this.mentionInput = input; }}
								initText={this.props.post !== null ? this.props.post.message : null}
								getUsers={{ type: 'discuss' }}
								// placeholder={!isReplyBoxOpen && replyLength === 0 ? t('question.message-placeholder') : ''}
								maxLength={QuestionEditor.maxQuestionLength}
								className="question-editor-description-input discuss-input"
							/>
							<SecondaryTextBlock className="discuss-input-titles">Tags</SecondaryTextBlock> {/* needs translation */}
							<FlexBox column className="counting-input">
								<TagsInput
									error={tagsError}
									tags={tags}
									addTag={this.addTag}
									deleteTag={this.deleteTag}
									setTagsError={this.setTagsError}
									canAddTag={this.canAddTag()}
									className="discuss-input discuss-tags-input"
								/>
								<SecondaryTextBlock className="count">
									{tags.length} / {QuestionEditor.maxTagsLength}
								</SecondaryTextBlock>
							</FlexBox>
							<FlexBox className="actions-container" justifyEnd align>
								<FlatButton
									className="cancel-button"
									onClick={this.props.handleCancel}
								>
									{t('common.cancel-title')}
								</FlatButton>
								<PromiseButton
									raised
									className="submit-button"
									color="primary"
									mouseDown
									fire={this.handleSubmit}
								>
									{isNew ? t('common.post-action-title') : t('common.save-action-title')}
								</PromiseButton>
							</FlexBox>
						</FlexBox>
					</FlexBox>
				</FlexBox>
			</PaperContainer>
		);
	}
}

QuestionEditor.defaultProps = {
	post: null,
};

const mapStateToProps = state => ({
	profile: state.userProfile,
});

export default connect(mapStateToProps)(QuestionEditor);
