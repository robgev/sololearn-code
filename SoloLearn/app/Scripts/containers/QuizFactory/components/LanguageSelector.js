import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dialog, List, ListItem, Divider } from 'material-ui';
import LoadingOverlay from 'components/Shared/LoadingOverlay';

const LanguageSelector = ({
	courses, open, onChoose, onClose, filter,
}) => {
	const filteredCourses = courses.filter(filter);
	return (
		<Dialog
			modal={false}
			autoScrollBodyContent
			title="Choose Language"
			open={open}
			onRequestClose={onClose}
		>
			{filteredCourses.length === 0 ? <LoadingOverlay /> : null}
			<List>
				{filteredCourses.map((course, idx) => (
					<div key={course.id} onClick={() => onChoose(course)} tabIndex={0} role="button">
						<ListItem primaryText={course.languageName} leftIcon={<img src={course.iconUrl} alt="" />} />
						{idx !== courses.length - 1 ? <Divider inset /> : null}
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
		iconUrl: PropTypes.string.isRequired,
		languageName: PropTypes.string.isRequired,
	})).isRequired,
	open: PropTypes.bool.isRequired,
	onChoose: PropTypes.func.isRequired,
	onClose: PropTypes.func,
	filter: PropTypes.func,
};

const mapStateToProps = state => ({ courses: state.courses });

export default connect(mapStateToProps)(LanguageSelector);
