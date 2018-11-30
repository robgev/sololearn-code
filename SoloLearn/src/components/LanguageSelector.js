import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from 'components/StyledDialog';
import { List, ListItem } from 'material-ui/List';
import { EmptyCard } from 'components/molecules';
import LanguageCard from 'components/LanguageCard';
import Localize from 'components/Localize';

const LanguageSelector = ({
	courses, open, onChoose, onClose, filter,
}) => {
	const filteredCourses = courses.filter(filter);
	return (
		<Localize>
			{({ t }) => (
				<Dialog
					autoScrollBodyContent
					title={t('factory.quiz-choose-language-title')}
					open={open}
					onRequestClose={onClose}
					bodyStyle={{ border: 'none', padding: 0 }}
				>
					{filteredCourses.length === 0 ? <EmptyCard loading /> : null}
					<List>
						{filteredCourses.map(course => (
							<div key={course.id} onClick={() => onChoose(course)} tabIndex={0} role="button">
								<ListItem
									primaryText={course.languageName}
									leftIcon={<LanguageCard language={course.language} />}
								/>
							</div>
						))}
					</List>
				</Dialog>
			)}
		</Localize>
	);
};

LanguageSelector.defaultProps = {
	onClose: () => { }, // noop
	filter: () => true,
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
};

const mapStateToProps = (state, ownProps) => ({ courses: ownProps.courses || state.courses });

export default connect(mapStateToProps)(LanguageSelector);
