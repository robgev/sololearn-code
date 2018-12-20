// React modules
import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import Editor from './Editor';
import EditorTabs from './EditorTabs';

const EditorRoot = ({ playground, onClose }) => (
	<Fragment>
		<EditorTabs onClose={onClose} playground={playground} />
		{!(playground.isOutputOpen && playground.hasLiveOutput) &&
			<Editor playground={playground} />
		}
	</Fragment>
);

export default observer(EditorRoot);
