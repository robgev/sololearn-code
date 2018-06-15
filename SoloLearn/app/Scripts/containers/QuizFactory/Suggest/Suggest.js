import React from 'react';
import { Link } from 'react-router';
import Layout from 'components/Layouts/GeneralLayout';
import { List, Paper, ListItem, Divider, Subheader } from 'material-ui';

const Suggest = () => (
	<Layout>
		<Paper>
			<List>
				<Subheader>Submit a New Quiz</Subheader>
				<Link to="/quiz-factory/suggest/multiple-choice">
					<ListItem
						primaryText="Multiple Choice"
						leftIcon={<img src="/assets/create_multiple_choice.png" alt="" />}
						rightIcon={<img src="/assets/keyboard_arrow_right.svg" alt="" />}
					/>
				</Link>
				<Divider inset />
				<Link to="/quiz-factory/suggest/type-in">
					<ListItem
						primaryText="Guess the Output"
						leftIcon={<img src="/assets/create_type_in.png" alt="" />}
						rightIcon={<img src="/assets/keyboard_arrow_right.svg" alt="" />}
					/>
				</Link>
				<Divider inset />
				<Link to="/quiz-factory/suggest/fill-in">
					<ListItem
						primaryText="Fill in the Blank(s)"
						leftIcon={<img src="/assets/create_multiple_type_in.png" alt="" />}
						rightIcon={<img src="/assets/keyboard_arrow_right.svg" alt="" />}
					/>
				</Link>
			</List>
		</Paper>
	</Layout>
);

export default Suggest;
