import React, { useState } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Title, SecondaryTextBlock, PaperContainer, Container, FlexBox } from 'components/atoms';
import { Slider, ViewMoreLink, RaisedButton } from 'components/molecules';

import { CourseChip } from 'containers/Learn/components';
import './styles.scss';
import SlayManage from '../../SlayManage';
import { refreshMyCourses } from 'actions/slay';
import Service from 'api/service';

const collectionTypes = {
	slayLessons: [ 1 ],
	courses: [ 2, 4 ],
};

const generateBreakpoints = (numberOfItems, roundItems) => {
	const breakpointValues = [ 1224, 880, 499 ];
	const initialNumberOfShownItems = roundItems ? 4 : 3;
	return breakpointValues.map((currentPoint, index) => {
		const slidesToShow = initialNumberOfShownItems - (index + 1);
		return {
			breakpoint: currentPoint,
			settings: {
				slidesToShow,
				slidesToScroll: 2 * slidesToShow,
			},
		};
	});
};

const CollectionCard = ({
	t,
	id,
	type,
	name,
	items,
	userID,
	description,
	round = false,
	noName = false,
	noViewMore = false,
	refreshMyCourses,
}) => {
	// lessons are the old Sololearn-created courses, like learn HTML, C# etc.
	const [ openSlayManage, toggleSlayManage ] = useState(false);
	const [ toggling, togglingCourses ] = useState(false);
	const isCourses = collectionTypes.courses.indexOf(type) !== -1;
	const slidesToShow = items && items.length < 6 ? items.length : 6;
	const slidesToScroll = 6;// 2 * slidesToShow;

	const toggleCourse = async (courseId, enable) => {
		togglingCourses(true);
		await Service.request('Profile/ToggleCourse', { courseId, enable });
		await refreshMyCourses(-1);
		togglingCourses(false);
	};

	return (
		<PaperContainer
			elevation={1}
			style={{
				padding: '15px 20px',
				width: '100%',
				marginBottom: 10,
				overflow: 'hidden',
			}}
		>
			<FlexBox align justifyBetween className={`meta-info ${!description ? 'big-padding-bottom' : ''}`}>
				<Title>{name}</Title>
				{
					id === -1
						? items && items.length > 0
							? <ViewMoreLink className="manage-button" onClick={() => toggleSlayManage(!openSlayManage)}>
								{t('common.manage')}
							</ViewMoreLink>
							: null
						: !noViewMore &&
						<ViewMoreLink to={userID ? `/learn/more/author/${userID}` : `/learn/more/${id}`} >
							{t('common.loadMore')}
						</ViewMoreLink>
				}
			</FlexBox>
			{description &&
				<SecondaryTextBlock className="course-description">{description}</SecondaryTextBlock>
			}
			{
				items && items.length > 0
					? <Slider
						slidesToShow={slidesToShow}
						slidesToScroll={slidesToScroll}
						className={`courses-list ${(isCourses || round) ? 'round' : ''}`}
						responsive={items && generateBreakpoints(items.length, isCourses || round)}
					>
						{
							items.map(lessonItem => (
								lessonItem.itemType !== 4 &&
								<Container className="course-chip-wrapper" key={`${lessonItem.name}-${lessonItem.id}`}>
									<CourseChip
										{...lessonItem}
										round={round}
										noName={noName}
										isCourse={isCourses}
										size={(isCourses || round) ? 85 : 95}
										className="collection-card-chip"
										noBoxShadow={!(isCourses && round)}
										customLink={lessonItem.itemType === 5 ? `/learn/collection/${lessonItem.id}` : null}
									/>
								</Container>
							))
						}

					</Slider>
					: <FlexBox justify column align>
						<SecondaryTextBlock>
							{t('learn.no-selected-courses-message')}
						</SecondaryTextBlock>
						<RaisedButton
							color="secondary"
							onClick={() => toggleSlayManage(!openSlayManage)}
						>
							{t('learn.add-courses-message')}
						</RaisedButton>
					</FlexBox>
			}
			{
				id === -1
					? <SlayManage
						open={openSlayManage}
						myCourses={items}
						toggleCourse={toggleCourse}
						toggling={toggling}
						onClose={() => toggleSlayManage(!openSlayManage)}
					/>
					: null
			}
		</PaperContainer>
	);
};

const mapStateToProps = state => ({ courses: state.courses, skills: state.userProfile.skills });

const mapDispatchToProps = {
	refreshMyCourses,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CollectionCard));
