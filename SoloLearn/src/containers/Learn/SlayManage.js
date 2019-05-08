import React, { Component } from 'react';
import { connect } from 'react-redux';

import { PaperContainer, MenuItem, Title } from 'components/atoms';
import { Layout } from 'components/molecules';
import { ManageLessonCard } from './components';

import './SlayManage.scss';

class SlayManage extends Component {
	render() {
		const { skills: myCourses, courses } = this.props;
		const availableCourses = courses.filter(c => !myCourses.find(s => s.id === c.id && (s.iconUrl = c.iconUrl)));
		return (
			<Layout>
				<Title className="title">My Courses</Title>
				<PaperContainer>
					{
						myCourses.map(course => (
							<ManageLessonCard
								{...course}
								actions={
									[
										<MenuItem onClick={() => { console.log('Glossary'); }} >Glossary</MenuItem>,
										<MenuItem onClick={() => { console.log('Reset Progress'); }} >Reset Progress</MenuItem>,
										<MenuItem onClick={() => { console.log('Remove'); }} >Remove</MenuItem>,
									]
								}
							/>
						))
					}
				</PaperContainer>
				<Title className="title">Available Courses</Title>
				<PaperContainer>
					{
						availableCourses.map(course => (
							<ManageLessonCard
								{...course}
								actions={
									[
										<MenuItem onClick={() => { console.log('Glossary'); }} >Glossary</MenuItem>,
										<MenuItem onClick={() => { console.log('Add to My Courses'); }} >Add to My Courses</MenuItem>,
									]
								}
							/>
						))
					}
				</PaperContainer>
			</Layout>
		);
	}
}
const mapStateToProps = state => ({
	skills: state.userProfile.skills,
	courses: state.courses,
});
export default connect(mapStateToProps)(SlayManage);
