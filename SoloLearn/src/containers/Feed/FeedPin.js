// React modules
import React, { Component } from 'react';

// Utils
import { getLanguageColor, toSeoFriendly } from 'utils';
import PopupTypes from 'defaults/feedPopupTypes';
import { CourseCard } from 'containers/Learn/components';

// Additional data and components
import Course from './FeedTemplates/Course';
import Post from './FeedTemplates/Post';
// import ProfileAvatar from './ProfileAvatar';
import {
	Container,
	PaperContainer,
	Link,
	Image,
	Title,
	SecondaryTextBlock,
	FlexBox,
} from 'components/atoms';
import { FlatButton, ContainerLink, ProfileAvatar } from 'components/molecules';

import 'styles/Feed/FeedPin.scss';

class FeedPin extends Component {
	// Render pin courses
	generateCourses() {
		const { pin } = this.props;

		return pin.courses.map(course => (
			<Course key={`pinCourse ${course.id} ${pin.id}`} course={course} openPopup={this.props.openPopup} />
		));
	}

	// Render pin users
	generateUsers() {
		const { pin } = this.props;

		return pin.users.map(user => (
			<ProfileAvatar key={`pinUser ${user.id} ${pin.id}`} user={user} />
		));
	}

	// Render pin codes
	generateCodes() {
		const { pin } = this.props;

		return pin.codes.map(code => (
			<Link to={`/playground/${code.publicID}`} className="code" key={`pinCode ${code.id} ${pin.id}`}>
				<Container
					className="languageIcon"
					style={{
						backgroundColor: getLanguageColor(code.language),
					}}
				>
					{code.language}
				</Container>
				<Container >
					<SecondaryTextBlock >{code.name}</SecondaryTextBlock>
					<br />
					<SecondaryTextBlock >{code.userName}</SecondaryTextBlock>

				</Container>
			</Link>
		));
	}

	// Render pin posts
	generatePosts() {
		const { pin } = this.props;

		return pin.posts.map(post => (
			<Post noVotes key={`pinPost ${post.id} ${pin.id}`} post={post} isQuestion />
		));
	}

	generateLessons() {
		const { pin } = this.props;
		return pin.lessons.map(lesson => (
			<CourseCard
				small
				{...lesson}
				key={lesson.name}
				style={{
					padding: 15,
					marginBottom: 0,
					paddingBottom: 0,
					boxShadow: 'none',
				}}
			/>
		));
	}

	openCoursePopup = () => {
		const { pin } = this.props;
		const firstCourse = pin.courses[0];
		const data = {
			type: PopupTypes.course,
			courseId: firstCourse.id,
			courseName: firstCourse.name,
		};
		this.props.openPopup(data);
	}

	getPinUrl() {
		const { pin } = this.props;
		let url = pin.action;

		if (pin.action == null || pin.action === '') {
			if (pin.users) {
				const firstUser = pin.users[0];
				url = `/profile/${firstUser.id}`;
			} else if (pin.codes) {
				const firstCode = pin.codes[0];
				url = `/playground/${firstCode.publicID}`;
			} else if (pin.posts) {
				const firstPost = pin.posts[0];
				url = `/discuss/${firstPost.id}`;
			} else if (pin.lessons) {
				const firstLesson = pin.lessons[0];
				url = `/learn/${firstLesson.id}/${toSeoFriendly(firstLesson.name, 100)}/1`;
			} else if (pin.userPosts) {
				const firstPost = pin.userPosts[0];
				url = `/userPost/${firstPost.id}`;
			} else if (pin.courses) {
				url = `/learn/${toSeoFriendly(pin.courses[0].alias)}`;
			}
		} else {
			const parts = url.split('/');
			const primaryPart = parts[1];

			switch (primaryPart) {
			case 'tab':
				if (parts.length < 3) return ''; // check
				url = parts[2] === 'code' ? '/codes' : `/${parts[2]}`;
				break;
			case 'profile':
				url = '/profile';
				if (parts.length > 2) {
					url = parts[2] === 'code' ? `${url}/codes` : `${url}/${parts[2]}`;
				}
				break;
			case 'collection':
				url = `/collection/${parts[2]}`;
				break;
			default:
				// url = `/${primaryPart}`;
				break;
			}
		}

		return url;
	}

	render() {
		const { pin } = this.props;
		return (
			<ContainerLink className="feed-pin-wrapper" to={this.getPinUrl()} target="_blank">
				<PaperContainer className="feed-pin-content">
					<FlexBox column className="heading">
						<Title className="title" >{pin.title}</Title>
						<SecondaryTextBlock >{pin.message}</SecondaryTextBlock>
					</FlexBox>
					{pin.imageUrl &&
						<Image
							alt="Pinned item"
							className="pinImage"
							src={pin.imageUrl}
						/>
					}
					{pin.courses && <Container className="courses" >{this.generateCourses()}</Container>}
					{pin.users && <Container className="users" >{this.generateUsers()}</Container>}
					{pin.codes && <Container className="codes">{this.generateCodes()}</Container>}
					{pin.lessons && <Container className="lessons" >{this.generateLessons()}</Container>}
					{pin.posts && <Container className="posts" >{this.generatePosts()}</Container>}
					<FlexBox className="actions">
						<FlatButton color="primary">
							<Link to={this.getPinUrl()}>
								{pin.actionName}
							</Link>
						</FlatButton>
					</FlexBox>
				</PaperContainer>
				{pin.courses ?
					<SecondaryTextBlock className="feed-pin" onClick={this.openCoursePopup} /> :
					<Link className="feed-pin" to={this.getPinUrl()} />
				}
			</ContainerLink>
		);
	}
}

export default FeedPin;
