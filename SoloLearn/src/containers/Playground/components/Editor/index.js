// React modules
import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import Editor from './Editor';
import EditorTabs from './EditorTabs';

const EditorRoot = ({ playground, onClose, size }) => (
	<Fragment>
		<EditorTabs onClose={onClose} playground={playground} />
		{!(playground.hasLiveOutput && playground.isOutputOpen) &&
			<Editor size={size} playground={playground} />
		}
	</Fragment>
);

export default observer(EditorRoot);
