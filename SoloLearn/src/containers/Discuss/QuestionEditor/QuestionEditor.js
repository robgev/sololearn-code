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
			query: '',
		};
	}

	static maxTagsLength = 10;
	static maxQuestionLength = 1024;
	static maxTitleLength = 128;

	static Chip = ({ value, handleRequestDelete, defaultStyle }, key) => (
		<Chip style={defaultStyle} label={value} key={key} onDelete={handleRequestDelete} />
	);

	static isEndingInNewline = str => str.match(/\n$/);

	// Detect title change
	onTitleChange = (e) => {
		const { value: title } = e.currentTarget;
		if (!QuestionEditor.isEndingInNewline(title) && title.length <= QuestionEditor.maxTitleLength) {
			this.setState({ title });
			if (title.length > 0) {
				this.setState({ titleErrorText: '' });
			}
		}
	}

	addTag = (newTag) => {
		this.setState((s) => {
			if (s.tags.length !== 10) {
				return { tags: [ ...s.tags, newTag ] };
			}
			return { tagsErrorText: 'Can\'t add more tags' };
		});
	}

	handleDeleteTag = (tag) => {
		this.setState(s => ({ tags: s.tags.filter(t => t !== tag), tagsErrorText: '' }));
	}

	// Get search suggestions
	handleUpdateInput = async (query) => {
		this.setState({ query });
		if (query.length > 0) {
			this.setState({ tagsErrorText: '' });
		}
		if (query.length < 2) {
			this.setState({ suggestions: [] });
		} else {
			this.getSuggestions(query);
		}
	}

	getSuggestions = async (query) => {
		const { tags: suggestions } = await Service.request('Discussion/getTags', { query });
		if (this.state.query === query) {
			this.setState({ suggestions });
		}
	}

	// Add question form submit
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
				title: this.state.title,
				message: this.mentionInput.getValue(),
				tags: this.state.tags,
			});
		}
	}

	// Customly render tag
	handleChipBlur = (e) => {
		const { value } = e.currentTarget;
		if (value !== '') {
			this.setState(s => ({ tags: [ ...s.tags, value ] }));
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
			isReplyBoxOpen, replyLength, titleErrorText,
		} = this.state;
		return (
			<PaperContainer className="discuss_question-editor">
				<FlexBox column>
					<Heading>{isNew ? t('question.title') : t('discuss.editTitle')}</Heading>
					<FlexBox column className="counting-input">
						<Input
							error={titleErrorText !== ''}
							multiLine
							fullWidth
							value={this.state.title}
							onChange={this.onTitleChange}
							label={titleErrorText !== '' ? titleErrorText : t('question.title-placeholder')}
							maxLength={QuestionEditor.maxTitleLength}
						/>
						<SecondaryTextBlock className="count">
							{this.state.title.length} / {QuestionEditor.maxTitleLength}
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
							value={this.state.tags}
							onBlur={this.handleChipBlur}
							newChipKeyCodes={[ 13, 32 ]}
							chipRenderer={QuestionEditor.Chip}
							dataSource={this.state.suggestions}
							errorText={this.state.tagsErrorText}
							onRequestAdd={this.addTag}
							onUpdateInput={this.handleUpdateInput}
							onRequestDelete={this.handleDeleteTag}
							floatingLabelText={t('question.tags-placeholder')}
						/>
						<SecondaryTextBlock className="count">
							{this.state.tags.length} / {QuestionEditor.maxTagsLength}
						</SecondaryTextBlock>
					</FlexBox>
					<RaisedButton
						primary
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
