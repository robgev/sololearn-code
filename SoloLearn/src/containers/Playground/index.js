// React modules
import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Playground from './AsyncPlayground';

const defaultLanguage = 'html';

const PlaygroundRoute = ({ userId, params, location }) => {
	const { publicId } = params;
	const { language, lessonCodeId } = location.query;
	if (!(language || lessonCodeId || publicId)) {
		// handle the case when nothing is given, open editor with default lang.
		browserHistory.replace({ ...location, query: { language: defaultLanguage } });
	}

	return (
		<Playground
			userId={userId}
			publicId={publicId}
			language={language}
			basePath="/playground"
			lessonCodeId={lessonCodeId}
			key={`${publicId || ''}-${lessonCodeId || ''}`}
		/>
	);
};

PlaygroundRoute.defaultProps = {
	publicId: null,
	lessonCodeId: null,
};

const mapStateToProps = ({ userProfile }) => ({
	userId: userProfile && userProfile.id,
});

export default connect(mapStateToProps)(PlaygroundRoute);
