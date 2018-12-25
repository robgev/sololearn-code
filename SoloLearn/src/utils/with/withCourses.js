import React from 'react';
import { connect } from 'react-redux';
import { getCourseByAlias, getCourseAliasById } from 'reducers/courses.reducer';

const mapStateToProps = store => ({ store, courses: store.courses });

export default (Component) => {
	@connect(mapStateToProps)
	class WithCourses extends React.Component {
		getCourseByAlias = alias => getCourseByAlias(this.props.store, alias);

		getCourseAliasById = id => getCourseAliasById(this.props.courses, id);

		render() {
			const { store, ...rest } = this.props;
			return (
				<Component
					{...rest}
					getCourseByAlias={this.getCourseByAlias}
					getCourseAliasById={this.getCourseAliasById}
				/>
			);
		}
	}
	return WithCourses;
};
