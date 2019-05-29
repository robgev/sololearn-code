import React from 'react';
import {
	CSSTransition,
	TransitionGroup,
} from 'react-transition-group';
import { toSeoFriendly } from 'utils';
import { Container, PaperContainer, SecondaryTextBlock } from 'components/atoms';
import { ContainerLink } from 'components/molecules';

import Progress, { ProgressState } from 'api/progress';
import './styles.scss';

const LessonTiles = ({
	t,
	lessons,
	slayLessons,
	onItemClick,
}) => (
	<TransitionGroup
		appear
	>
		{lessons.map((lesson, index) => {
			const lessonState = slayLessons ?
				{
					visualState: lesson.progress === 0 ? 2 : 3,
					stateClass: lesson.progress === 0 ? 'active' : 'normal',
				} :
				Progress.getLessonState(lesson);
			const isDisabled = lessonState.visualState === ProgressState.Disabled;
			const WrapperComponent = slayLessons ? ContainerLink : Container;

			return (
				<CSSTransition
					key={lesson.id}
					classNames="lesssons-in"
					timeout={150 + ((index % 20) * 30)}
				>
					<WrapperComponent
						tabIndex={0}
						role="button"
						key={lesson.id}
						style={{ animationDelay: `${(index % 20) * 30}ms` }}
						className={`lesson-item ${lessonState.stateClass}`}
						{...(slayLessons ? { to: `/learn/${lesson.id}/${toSeoFriendly(lesson.name, 100)}/1` } :
							{ onClick: () => onItemClick(lesson.id, lessonState, lesson.name) })
						}
					>
						<PaperContainer
							key={lesson.id}
							elevation={isDisabled ? 0 : 1}
							className={`lesson ${isDisabled ? 'disabled' : ''}`}
						>
							<Container className="number">{`${index + 1}/${lessons.length}`}</Container>
							<SecondaryTextBlock className="name">{lesson.name}</SecondaryTextBlock>
							{ !slayLessons &&
							<Container className={`info ${lessonState.stateClass}`}>
								<SecondaryTextBlock className="lesson-tiles_questions">{lesson.quizzes.length} {t('learn.questions-format')}</SecondaryTextBlock>
							</Container>
							}
							{ slayLessons &&
								<Container className={`info ${lessonState.stateClass}`}>
									<SecondaryTextBlock className="lesson-tiles_comments">
										{
											lesson.comments === 1 ?
												t('common.comment-format-one') :
												`${lesson.comments} ${t('common.comments')}`
										}
									</SecondaryTextBlock>
								</Container>
							}
						</PaperContainer>
					</WrapperComponent>
				</CSSTransition>
			);
		})
		}
	</TransitionGroup>
);

export default LessonTiles;
