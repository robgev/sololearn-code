import React, { useState } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Title, SecondaryTextBlock, PaperContainer, Container, FlexBox } from 'components/atoms';
import { Slider, ViewMoreLink } from 'components/molecules';

import { CourseChip } from 'containers/Learn/components';
import './styles.scss';
import SlayManage from '../../SlayManage';

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
}) => {
	// lessons are the old Sololearn-created courses, like learn HTML, C# etc.
	const [ openSlayManage, toggleSlayManage ] = useState(false);
	const isCourses = collectionTypes.courses.indexOf(type) !== -1;
	const slidesToShow = items.length <= 6 ? items.length : 6;
	const slidesToScroll = 6;// 2 * slidesToShow;
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
						? <ViewMoreLink className="manage-button" onClick={() => toggleSlayManage(!openSlayManage)}>
							{t('common.manage')}
        </ViewMoreLink>
						: !noViewMore &&
						<ViewMoreLink to={userID ? `/learn/more/author/${userID}` : `/learn/more/${id}`} >
							{t('common.loadMore')}
						</ViewMoreLink>
				}
			</FlexBox>
			{description &&
				<SecondaryTextBlock className="course-description">{description}</SecondaryTextBlock>
			}
			<Slider
				slidesToShow={slidesToShow}
				slidesToScroll={slidesToScroll}
				className={`courses-list ${(isCourses || round) ? 'round' : ''}`}
				responsive={generateBreakpoints(items.length, isCourses || round)}
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
			<SlayManage
				open={openSlayManage}
				onClose={() => toggleSlayManage(!openSlayManage)}
			/>
		</PaperContainer>
	);
};

const mapStateToProps = state => ({ courses: state.courses, skills: state.userProfile.skills });

export default connect(mapStateToProps, null)(translate()(CollectionCard));
