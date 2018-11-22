import React, { Fragment } from 'react';
import { translate } from 'react-i18next';
import {
	Container, SecondaryTextBlock, FlexBox, Title, HorizontalDivider, ListItem,
} from 'components/atoms';
import { ContainerLink, UsernameLink } from 'components/molecules';
import { updateDate } from 'utils';
import NumberWithText from './NumberWithText';
import Tags from '../Tags';

const Question = ({ question, t }) => (
	<Fragment>
		<ListItem>
			<FlexBox column className="question">
				<ContainerLink to={`/discuss/${question.id}`}>
					<FlexBox className="info">
						<FlexBox className="numbers">
							<NumberWithText
								number={question.votes}
								text={t('discuss.votes-title')}
							/>
							<NumberWithText
								number={question.answers > 99 ? '99+' : question.answers}
								text={question.answers === 1 ? t('discuss.answer-one-format') : t('discuss.answer-other-format')}
							/>
						</FlexBox>
						<FlexBox column className="question-info">
							<Title>{question.title}</Title>
							<Tags tags={question.tags} />
						</FlexBox>
					</FlexBox>
				</ContainerLink>
				<Container className="author">
					<SecondaryTextBlock className="text">{updateDate(question.date)} </SecondaryTextBlock>
					<UsernameLink to={`/profile/${question.userID}`}>{question.userName}</UsernameLink>
				</Container>
			</FlexBox>
		</ListItem>
		<HorizontalDivider />
	</Fragment>
);

export default translate()(Question);