import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getCourseByLanguage } from 'actions/learn';
import CircularProgress from 'material-ui/CircularProgress';
import { isCourseLoadedByLanguageSelector } from 'reducers/courses.reducer';

const mapStateToProps = (state, ownProps) => {
	const { courseName } = ownProps.params;
	return {
		courseName,
		isCourseLoaded: isCourseLoadedByLanguageSelector(state, courseName),
		isCourseFullyLoaded: isCourseLoadedByLanguageSelector(state, courseName, { full: true }),
	};
};

const mapDispatchToProps = {
	getCourseByLanguage,
};

const courseLoader = (Comp) => {
	@withRouter
	@connect(mapStateToProps, mapDispatchToProps)
	class CourseLoader extends Component {
		componentDidMount() {
			if (this.props.isCourseLoaded && !this.props.isCourseFullyLoaded) {
				this.getCourse();
			}
		}

		componentDidUpdate(prevProps) {
			if (prevProps.isCourseLoaded !== this.props.isCourseLoaded) {
				this.getCourse();
			}
		}

		getCourse = () => {
			this.props.getCourseByLanguage(this.props.courseName);
		}

		render() {
			// Take the injected props out, not to pollute child props namespace
			const {
				courseName,
				isCourseLoaded,
				isCourseFullyLoaded,
				getCourseByLanguage, // eslint-disable-line no-shadow
				...childProps
			} = this.props;
			if (!isCourseFullyLoaded) {
				return (
					<CircularProgress
						size={40}
						style={{ display: 'flex', alignItems: 'center', margin: 'auto' }}
					/>);
			}
			return <Comp {...childProps} />;
		}
	}

	return CourseLoader;
};

export default courseLoader;
