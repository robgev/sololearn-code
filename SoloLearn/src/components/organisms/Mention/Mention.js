import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TextBlock } from 'components/atoms';
import { UsernameLink, Linkify } from 'components/molecules';

import './inputMentionStyles.scss';

class Mention extends PureComponent {
	static itemTypes = {
		TEXT: 1,
		TAG: 2,
	};

	static regex = /\[user id ?= ?"?(\d+)"?\](.+?)\[\/user\]/;

	static _replace = (text, acc) => {
		if (!Mention.regex.test(text)) {
			return [ ...acc, { type: Mention.itemTypes.TEXT, value: text, key: acc.length } ];
		}
		const res = Mention.regex.exec(text);
		const [ tagged, id, name ] = res;
		const { index } = res;
		return Mention._replace(text.slice(index + tagged.length), [
			...acc,
			{ type: Mention.itemTypes.TEXT, value: text.slice(0, index), key: acc.length },
			{ type: Mention.itemTypes.TAG, value: { name, id }, key: `${acc.length}:${id}` },
		]);
	};

	static replace = text => Mention._replace(text, [])

	static Item = ({ item }) => {
		switch (item.type) {
		case Mention.itemTypes.TEXT:
			// Have to linkify text here due to the nature of how linkification works
			return (
				<Linkify>
					<TextBlock className="input-main-text">
						{item.value}
					</TextBlock>
				</Linkify>
			);
		case Mention.itemTypes.TAG:
			return (
				<UsernameLink className="mention-link" to={`/profile/${item.value.id}`}>
					{item.value.name}
				</UsernameLink>
			);
		default:
			throw new Error('Can\'t find mention item type');
		}
	}

	render() {
		const mentioned = Mention.replace(this.props.text);
		return (
			<TextBlock className="organism_mention">
				{mentioned.map(el => <Mention.Item key={el.key} item={el} />)}
			</TextBlock>
		);
	}
}

Mention.propTypes = {
	text: PropTypes.string.isRequired,
};

export default Mention;
