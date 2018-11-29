import React from 'react';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';

import {
	Heading,
	Loading,
	PaperContainer,
} from 'components/atoms';

const CompiledOutput = ({ t, playground }) => (
	<PaperContainer className="playground_compiled-output-container">
		<Heading>{t('code_playground.output')}</Heading>
		{ playground.isRunning
			?	<Loading />
			: (
				<pre className="default-output">
					{playground.output}
				</pre>
			)
		}
	</PaperContainer>
);

export default translate()(observer(CompiledOutput));
