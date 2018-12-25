import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Title, SecondaryTextBlock, PaperContainer, Container, FlexBox } from 'components/atoms';
import { Slider, ViewMoreLink } from 'components/molecules';

import { CourseChip } from 'containers/Learn/components';
import './styles.scss';

const collectionTypes = {
	slayLessons: 1,
	courses: 2,
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
	const isCourses = type === collectionTypes.courses;
	const slidesToShow = 3;
	const slidesToScroll = 2 * slidesToShow;
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
				{!noViewMore &&
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
								className="collection-card-chip"
								noBoxShadow={!(isCourses && round)}
								customLink={lessonItem.itemType === 5 ? `/learn/collection/${lessonItem.id}` : null}
							/>
						</Container>
					))
				}
			</Slider>
		</PaperContainer>
	);
};

const mapStateToProps = state => ({ courses: state.courses, skills: state.userProfile.skills });

export default connect(mapStateToProps, null)(translate()(CollectionCard));
