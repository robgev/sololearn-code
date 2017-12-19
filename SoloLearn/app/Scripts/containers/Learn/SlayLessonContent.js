import React, { PureComponent } from 'react';
import { omit } from 'lodash';
import { Tabs, Tab } from 'material-ui/Tabs';

import QuizText from './QuizText';

const SlayLessonContent = (props) => {
	const { parts } = props;
	return parts ?
		<Tabs>
			{parts.map((singlePart, index) => (
				<Tab key={singlePart.id} label={index + 1}>
					<QuizText
						{...omit(props, 'textContent')}
						textContent={singlePart.textContent}
					/>
				</Tab>
			))}
		</Tabs> :
		<QuizText {...props} />;
};

export default SlayLessonContent;
