import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';

import Progress from 'api/progress';
import Service from 'api/service';
import { loadCourseInternal } from 'actions/learn';
import BusyWrapper from 'components/BusyWrapper';

const mapStateToProps = state => ({
	courses: state.courses,
	course: state.course,
});

const mapDispatchToProps = {
	loadCourseInternal,
};

@connect(mapStateToProps, mapDispatchToProps)
class Certificate extends PureComponent {
	state = {
		imageData: '',
		loading: true,
	}

	async componentWillMount() {
		const { params: { id }, loadCourseInternal } = this.props;
		const courseId = parseInt(id, 10);
		if (!this.props.course) {
			await loadCourseInternal(courseId);
		}
		const { modules } = this.props.course;
		const lastModule = modules[modules.length - 1];
		const { progress } = Progress.getModuleState(lastModule);
		const isCourseFinished = progress === 100;
		if (isCourseFinished) {
			const imageStream = await Service.request('/DownloadCertificate', { courseId });
			const blob = new Blob([ imageStream ], { type: 'image/jpeg' });
			const imageData = URL.createObjectURL(blob);
			this.setState({
				imageData,
				loading: false,
			});
		} else {
			this.redirect();
		}
		document.title = 'Certificate';
		ReactGA.ga('send', 'screenView', { screenName: 'Certificate Page' });
	}

	redirect = () => {
		const { params: { id }, courses } = this.props;
		const courseId = parseInt(id, 10);
		const { name } = courses.find(singleCourse => singleCourse.id === courseId);
		browserHistory.replace(`/learn/course/${name}`);
	}

	render() {
		const { loading, imageData } = this.state;
		return (
			<BusyWrapper
				isBusy={loading}
				style={{ minHeight: '60vh' }}
				loadingComponent={
					<CircularProgress
						size={100}
					/>
				}
			>
				<div>
					<img src={imageData} alt="Certificate" />
				</div>
			</BusyWrapper>
		);
	}
}

export default Certificate;
