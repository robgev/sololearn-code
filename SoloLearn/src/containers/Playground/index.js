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
			basePath="/playground"
			language={language}
			publicId={publicId || null}
			lessonCodeId={lessonCodeId || null}
			key={`${publicId || ''}-${lessonCodeId || ''}`}
		/>
	);
};

const mapStateToProps = ({ userProfile }) => ({
	userId: userProfile.id,
});

export default connect(mapStateToProps)(PlaygroundRoute);
