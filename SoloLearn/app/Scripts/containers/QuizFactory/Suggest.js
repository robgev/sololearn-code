import React from 'react';

import Layout from 'components/Layouts/GeneralLayout';
import { List, Paper } from 'material-ui';
import { SuggestQuizType } from './components';

const Suggest = () => (
	<Layout>
		<Paper>
			<List>
				<SuggestQuizType text="Multiple Choice" icon="/assets/create_multiple_choice.png" />
				<SuggestQuizType text="Guess the Output" icon="/assets/create_type_in.png" />
				<SuggestQuizType text="Fill in the Blank(s)" icon="/assets/create_multiple_type_in.png" divider={false} />
			</List>
		</Paper>
	</Layout>
);

export default Suggest;
