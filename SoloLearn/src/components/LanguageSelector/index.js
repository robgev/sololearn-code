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
	t, courses, open, onChoose, onClose, filter, coursesLoading, loading,
}) => {
	const filteredCourses = courses.filter(filter);
	const handleEnter = (e, course) => {
		if (e.keyCode === 13) { // on enter
			onChoose(course);
		}
	};
	return (
		<Popup
			open={open}
			onClose={onClose}
		>
			<PopupTitle>{t('factory.quiz-choose-language-title')}</PopupTitle>
			<PopupContent>
				{filteredCourses.length === 0 ? <EmptyCard loading={coursesLoading || loading} /> : null}
				<List>
					{filteredCourses.map(course => (
						<Container key={course.id} onKeyDown={e => handleEnter(e, course)} onClick={() => onChoose(course)} tabIndex={0} role="button">
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
	filter: () => true,
	loading: false,
};

LanguageSelector.propTypes = {
	courses: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.number.isRequired,
		languageName: PropTypes.string.isRequired,
	})).isRequired,
	open: PropTypes.bool.isRequired,
	onChoose: PropTypes.func.isRequired,
	onClose: PropTypes.func,
	filter: PropTypes.func,
	loading: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) =>
	({ courses: ownProps.courses || state.courses, coursesLoading: state.coursesLoading });

export default connect(mapStateToProps)(translate()(LanguageSelector));
