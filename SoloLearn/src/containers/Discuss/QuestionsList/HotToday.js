import React from 'react';
import SidebarShimmer from 'components/Shimmers/SidebarShimmer';
import { Heading, List, ListItem, FlexBox, Link, PaperContainer } from 'components/atoms';
import { UsernameLink, ModBadge, ProfileAvatar } from 'components/molecules';

const HotToday = ({ isEmpty, questions, t }) => (
	<PaperContainer className="discuss-sidebar">
		<Heading>Hot discussions today</Heading>
		{isEmpty
			? <SidebarShimmer noTitle />
			: (
				<List>
					{questions.map((question) => {
						const user = {
							id: question.userID,
							name: question.userName,
							avatarUrl: question.avatarUrl,
							badge: question.badge,
							level: question.level,
						};
						return (
							<ListItem key={question.id} className="hot-today-item">
								<ProfileAvatar
									size="extra-small"
									className="user-avatar"
									user={user}
								/>
								<FlexBox column className="hot-today-content">
									<Link to={`/discuss/${question.id}`} className="hot-today-question">
										{question.title}
									</Link>
									<FlexBox>
										<UsernameLink className="author-name" to={`/profile/${question.userID}`}>{question.userName}</UsernameLink>
										<ModBadge
											className="badge"
											badge={question.badge}
										/>
									</FlexBox>
								</FlexBox>
							</ListItem>
						);
					})}
				</List>
			)}
	</PaperContainer>
);

export default HotToday;
