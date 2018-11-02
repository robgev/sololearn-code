import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { sidebarQuestionsSelector, isDiscussSidebarEmpty } from 'reducers/discuss.reducer';
import SidebarShimmer from 'components/Shimmers/SidebarShimmer';
import { PaperContainer, Heading, List, ListItem, SecondaryTextBlock, Link } from 'components/atoms';
import { IconWithText } from 'components/molecules';
import { QuestionAnswer } from 'components/icons';

const mapStateToProps = state => ({
	questions: sidebarQuestionsSelector(state),
	isEmpty: isDiscussSidebarEmpty(state),
});

const DiscussSidebar = ({ isEmpty, questions, t }) => (
	<PaperContainer>
		<Heading>{t('discuss.filter.hot-today')}</Heading>
		{isEmpty
			? <SidebarShimmer noTitle />
			: (
				<List>
					{questions.map(question => (
						<ListItem>
							<Link to={`/discuss/${question.id}`}>
								<IconWithText Icon={QuestionAnswer}>
									<SecondaryTextBlock>{question.title}</SecondaryTextBlock>
								</IconWithText>
							</Link>
						</ListItem>
					))}
				</List>
			)}
	</PaperContainer>
);

export default connect(mapStateToProps)(translate()(DiscussSidebar));
