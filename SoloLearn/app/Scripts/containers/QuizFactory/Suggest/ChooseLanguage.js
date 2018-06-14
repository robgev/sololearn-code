import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getQuizFactoryCourses } from 'selectors';
import { Dialog, List, ListItem, Divider } from 'material-ui';

const ChooseLanguage = ({
	courses, open, onChoose, onClose,
}) => (
	<Dialog
		modal={false}
		autoScrollBodyContent
		title="Choose Language"
		open={open}
		onRequestClose={onClose}
	>
		<List>
			{courses.map((course, idx) => (
				<div key={course.id} onClick={() => onChoose(course)} tabIndex={0} role="button">
					<ListItem primaryText={course.languageName} leftIcon={<img src={course.iconUrl} alt="" />} />
					{idx !== courses.length - 1 ? <Divider inset /> : null}
				</div>
			))}
		</List>
	</Dialog>
);

ChooseLanguage.propTypes = {
	courses: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.number.isRequired,
		iconUrl: PropTypes.string.isRequired,
		languageName: PropTypes.string.isRequired,
	})).isRequired,
	open: PropTypes.bool.isRequired,
	onChoose: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ courses: getQuizFactoryCourses(state) });

export default connect(mapStateToProps)(ChooseLanguage);
