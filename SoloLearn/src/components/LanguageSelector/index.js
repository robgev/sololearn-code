import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
	Popup,
	PopupTitle,
	PopupContent,
	FlexBox,
	ListItem,
	Container,
	List,
} from 'components/atoms';
import { EmptyCard } from 'components/molecules';
import LanguageCard from 'components/LanguageCard';

import './styles.scss';

const LanguageSelector = ({
	t, courses, open, onChoose, onClose, coursesLoading,
}) => {
	const filteredCourses = courses.filter(course =>
		course.language !== 'sql'
		&& course.language !== 'css'
		&& course.language !== 'js');
	const htmlItemIndex = filteredCourses.findIndex(el => el.id === 1014);
	filteredCourses[htmlItemIndex].language = 'web';
	filteredCourses[htmlItemIndex].languageName = 'Web';
	return (
		<Popup
			open={open}
			onClose={onClose}
		>
			<PopupTitle>{t('factory.quiz-choose-language-title')}</PopupTitle>
			<PopupContent>
				{filteredCourses.length === 0 ? <EmptyCard loading={coursesLoading} /> : null}
				<List>
					{filteredCourses.map(course => (
						<Container key={course.id} onClick={() => onChoose(course)} tabIndex={0} role="button">
							<ListItem button>
								<FlexBox align className="language_selector-card-container">
									<LanguageCard language={course.language} />
									{course.languageName}
								</FlexBox>
							</ListItem>
						</Container>
					))}
				</List>
			</PopupContent>
		</Popup>
	);
};

LanguageSelector.defaultProps = {
	onClose: () => { }, // noop
};

LanguageSelector.propTypes = {
	courses: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.number.isRequired,
		languageName: PropTypes.string.isRequired,
	})).isRequired,
	open: PropTypes.bool.isRequired,
	onChoose: PropTypes.func.isRequired,
	onClose: PropTypes.func,
};

const mapStateToProps = (state, ownProps) =>
	({ courses: ownProps.courses || state.courses, coursesLoading: state.coursesLoading });

export default connect(mapStateToProps)(translate()(LanguageSelector));
