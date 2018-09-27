import React from 'react';
import { Link } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Localize from 'components/Localize';

const Suggest = () => (
	<Localize>
		{({ t }) => (
			<List>
				<Link to="/quiz-factory/suggest/multiple-choice">
					<ListItem
						primaryText={t('factory.quiz-type-multiple-choice')}
						leftIcon={<img src="/assets/create_multiple_choice.png" alt="" />}
						rightIcon={<img src="/assets/keyboard_arrow_right.svg" alt="" />}
					/>
				</Link>
				<Divider inset />
				<Link to="/quiz-factory/suggest/type-in">
					<ListItem
						primaryText={t('factory.quiz-type-guess-the-output')}
						leftIcon={<img src="/assets/create_type_in.png" alt="" />}
						rightIcon={<img src="/assets/keyboard_arrow_right.svg" alt="" />}
					/>
				</Link>
				<Divider inset />
				<Link to="/quiz-factory/suggest/fill-in">
					<ListItem
						primaryText={t('factory.quiz-type-fill-in-the-blanks')}
						leftIcon={<img src="/assets/create_multiple_type_in.png" alt="" />}
						rightIcon={<img src="/assets/keyboard_arrow_right.svg" alt="" />}
					/>
				</Link>
				<Divider inset />
			</List>
		)}
	</Localize>
);

export default Suggest;
