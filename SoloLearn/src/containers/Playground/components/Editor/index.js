// React modules
import React, { Fragment } from 'react';
import Editor from './Editor';
import EditorTabs from './EditorTabs';

const EditorRoot = ({ playground }) => (
	<Fragment>
		<EditorTabs playground={playground} />
		<Editor playground={playground} />
	</Fragment>
);

export default EditorRoot;
