import React, { Fragment } from 'react';
import { translate } from 'react-i18next';
import {
	Link,
	 SecondaryTextBlock,
	  FlexBox,
	  Title,
	   ListItem,
	    PaperContainer,
} from 'components/atoms';
import {
	 ViewStats,
	  UsernameLink,
	   ProfileAvatar,
	ModBadge,
} from 'components/molecules';
import { updateDate } from 'utils';
import Tags from '../Tags';
import './styles.scss';

const Question = ({ question, t, fromProfile }) => {
	const user = {
		id: question.userID,
		name: question.userName,
		avatarUrl: question.avatarUrl,
		badge: question.badge,
	};

	return (
		<Fragment>
			<ListItem>
				<PaperContainer className="question-conatainer">
					<FlexBox justifyBetween className="question" fullWidth>
						<FlexBox className="info">
							<ProfileAvatar
								className="user-avatar"
								user={user}
							/>
							<FlexBox column className="question-info">
								<Link to={`/discuss/${question.id}${fromProfile ? '?fromProfile=true' : ''}`}>
									<Title className="question-title">{question.title}</Title>
								</Link>
								<Tags tags={question.tags} />
								<ViewStats
									className="question-view_stats"
									views={question.viewCount}
									votes={question.votes}
									comments={question.answers}
								/>
							</FlexBox>
						</FlexBox>
						<FlexBox className="author" justifyEnd>
							<SecondaryTextBlock className="text">{updateDate(question.date)} </SecondaryTextBlock>
							<UsernameLink className="author-name" to={`/profile/${question.userID}`}>{question.userName}</UsernameLink>
							<ModBadge
								className="badge"
								badge={question.badge}
							/>
						</FlexBox>
					</FlexBox>
				</PaperContainer>
			</ListItem>
		</Fragment>
	);
};

export default translate()(Question);
