import React, { Component } from 'react';
import Service from 'api/service';
import { translate } from 'react-i18next';
import ChipInput from 'material-ui-chip-input';

import { PaperContainer, Input, Chip, Heading, FlexBox, SecondaryTextBlock } from 'components/atoms';
import { RaisedButton } from 'components/molecules';
import { CountingMentionInput } from 'components/organisms';

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
			tagsErrorText: '',
			suggestions: [],
			isReplyBoxOpen: false,
			replyLength: 0,
			tagValue: '',
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

	static Chip = ({ value, handleDelete, className }, key) => (
		<Chip className={className} label={value} key={key} onDelete={handleDelete} />
	);

	addTag = (newTag) => {
		this.setState(s => ({ tags: [ ...s.tags, newTag ], tagValue: '' }));
	}

	handleDeleteTag = (tag) => {
		this.setState(s => ({
			tags: s.tagValue === ''
				? s.tags.filter(t => t !== tag)
				: [ ...s.tags.filter(t => t !== tag), s.tagValue ],
			tagsErrorText: '',
			tagValue: '',
		}));
	}

	onChange = (e) => {
		const { value: tagValue } = e.currentTarget;
		if (this.canUpdateTag()) {
			this.setState({ tagValue });
			if (tagValue.length > 0) {
				this.setState({ tagsErrorText: '' });
			}
			if (tagValue.length < 2) {
				this.setState({ suggestions: [] });
			} else {
				this.getSuggestions(tagValue);
			}
		} else {
			this.setState({ tagsErrorText: 'Can\'t add more tags' });
		}
	}

	getSuggestions = async (tagValue) => {
		const { tags: suggestions } = await Service.request('Discussion/GetTags', { query: tagValue });
		if (this.state.tagValue === tagValue) {
			this.setState({ suggestions });
		}
	}

	canUpdateTag = () => this.state.tags.length < 10

	/* End of tag input */

	handleSubmit = () => {
		const { t } = this.props;
		const { title, tags } = this.state;
		const isTitleEmpty = title.trim().length === 0;
		const isTagsEmpty = tags.length === 0;
		if (isTitleEmpty || isTagsEmpty) {
			this.setState({
				titleErrorText: isTitleEmpty ? t('question.invalid-title') : '',
				tagsErrorText: isTagsEmpty ? t('question.empty-tags') : '',
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
			title, titleErrorText, tags, tagsErrorText,
			suggestions, isReplyBoxOpen, replyLength, tagValue,
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
						<ChipInput
							fullWidth
							value={tags}
							newChipKeyCodes={[ 13, 32 ]}
							InputProps={{
								value: tagValue,
								onChange: this.onChange,
							}}
							blurBehavior="add"
							chipRenderer={QuestionEditor.Chip}
							error={tagsErrorText !== ''}
							dataSource={suggestions}
							onAdd={this.addTag}
							onDelete={this.handleDeleteTag}
							label={t('question.tags-placeholder')}
						/>
						<SecondaryTextBlock className="count">
							{tags.length} / {QuestionEditor.maxTagsLength}
						</SecondaryTextBlock>
					</FlexBox>
					<RaisedButton
						onMouseDown={this.handleSubmit}
					>
						{isNew ? t('common.post-action-title') : t('common.save-action-title')}
					</RaisedButton>
				</FlexBox>
			</PaperContainer>
		);
	}
}

QuestionEditor.defaultProps = {
	post: null,
};

export default QuestionEditor;
