import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import LiveOutput from './LiveOutput';
import CompiledOutput from './CompiledOutput';
import './styles.scss';

const CodeOutput = ({ playground }) => (!playground.isOutputOpen ? null : (
	<Fragment>
		{playground.hasLiveOutput
			? <LiveOutput playground={playground} />
			: <CompiledOutput playground={playground} />
		}
	</Fragment>
));

export default translate()(observer(CodeOutput));
