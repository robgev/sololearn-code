import React from 'react';

import Layout from 'components/Layouts/GeneralLayout';
import { List, Paper, ListItem, Divider, Subheader } from 'material-ui';

const Suggest = () => (
	<Layout>
		<Paper>
			<List>
				<Subheader>Submit a New Quiz</Subheader>
				<ListItem
					primaryText="Multiple Choice"
					leftIcon={<img src="/assets/create_multiple_choice.png" alt="" />}
					rightIcon={<img src="/assets/keyboard_arrow_right.svg" alt="" />}
				/>
				<Divider inset />
				<ListItem
					primaryText="Guess the Output"
					leftIcon={<img src="/assets/create_type_in.png" alt="" />}
					rightIcon={<img src="/assets/keyboard_arrow_right.svg" alt="" />}
				/>
				<Divider inset />
				<ListItem
					primaryText="Fill in the Blank(s)"
					leftIcon={<img src="/assets/create_multiple_type_in.png" alt="" />}
					rightIcon={<img src="/assets/keyboard_arrow_right.svg" alt="" />}
				/>
			</List>
		</Paper>
	</Layout>
);

export default Suggest;
