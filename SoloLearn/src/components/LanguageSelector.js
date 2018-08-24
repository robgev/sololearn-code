import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from 'components/StyledDialog';
import { List, ListItem } from 'material-ui/List';
import LoadingOverlay from 'components/LoadingOverlay';
import LanguageCard from 'components/LanguageCard';

const LanguageSelector = ({
	courses, open, onChoose, onClose, filter,
}) => {
	const filteredCourses = courses.filter(filter);
	return (
		<Dialog
			autoScrollBodyContent
			title="Choose Language"
			open={open}
			onRequestClose={onClose}
			bodyStyle={{ border: 'none', paddingBottom: 10 }}
		>
			{filteredCourses.length === 0 ? <LoadingOverlay /> : null}
			<List>
				{filteredCourses.map((course, idx) => (
					<div key={course.id} onClick={() => onChoose(course)} tabIndex={0} role="button">
						<ListItem
							primaryText={course.languageName}
							leftIcon={<LanguageCard language={course.language} />}
						/>
					</div>
				))}
			</List>
		</Dialog>
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
