import React from 'react';
import {
	CSSTransition,
	TransitionGroup,
} from 'react-transition-group';
import Paper from 'material-ui/Paper';
import { Link } from 'react-router';

import Progress, { ProgressState } from 'api/progress';
import 'styles/Learn/LessonTiles.scss';

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
			const Container = slayLessons ? Link : 'div';

			return (
				<CSSTransition
					key={lesson.id}
					classNames="lesssons-in"
					timeout={150 + (index * 30)}
				>
					<Container
						tabIndex={0}
						role="button"
						key={lesson.id}
						style={{ animationDelay: `${index * 30}ms` }}
						className={`lesson-item ${lessonState.stateClass}`}
						{...(slayLessons ? { to: `/learn/lesson/${lesson.itemType === 3 ? 'course-lesson' : 'user-lesson'}/${lesson.id}/1` } :
							{ onClick: () => onItemClick(lesson.id, lessonState, lesson.name) })
						}
					>
						<Paper
							key={lesson.id}
							zDepth={isDisabled ? 0 : 1}
							className={`lesson ${isDisabled ? 'disabled' : ''}`}
						>
							<div className="number">{`${index + 1}/${lessons.length}`}</div>
							<div className="name">{lesson.name}</div>
							{ !slayLessons &&
							<div className={`info ${lessonState.stateClass}`}>
								<span>{lesson.quizzes.length} {t('learn.questions-format')}</span>
							</div>
							}
							{ slayLessons &&
								<div className={`info ${lessonState.stateClass}`}>
									<span>
										{
											lesson.comments === 1 ?
												t('common.comment-format-one') :
												`${lesson.comments} ${t('common.comments')}`
										}
									</span>
								</div>
							}
						</Paper>
					</Container>
				</CSSTransition>
			);
		})
		}
	</TransitionGroup>
);

export default LessonTiles;
