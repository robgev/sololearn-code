import React from 'react';
import { observer } from 'mobx-react';
import InfiniteScroll from 'components/InfiniteScroll';
import Localize from 'components/Localize';
import Paper from 'material-ui/Paper';
import DiscussShimmer from 'components/Shimmers/DiscussShimmer';
import 'styles/Discuss/Questions.scss';
import QuestionItem from './QuestionItem';

export default observer(({
	questions, loadMore, hasMore, header,
}) =>
	<Localize>
		{({ t }) => 
			(questions.length === 0 && !hasMore ? (
				<Paper style={{
					padding: 15,
				}}
				>
					{header}
					<div className="no-questions-wrapper">
						{t("common.empty-list-message")}
					</div>
				</Paper>
			) : (
				<div>
					{questions.length === 0 &&
							(
								<Paper style={{ height: '100vh', padding: 15, overflow: 'hidden' }}>
									{header}
									<DiscussShimmer />
								</Paper>
							)}
					<InfiniteScroll
						header={questions.length !== 0 ? header : null}
						loadMore={loadMore}
						hasMore={hasMore}
						style={{
							display: 'flex',
							width: '100%',
							padding: 15,
							flexDirection: 'column',
						}}
					>
						{questions.map(el => <QuestionItem key={el.id} question={el} />)}
					</InfiniteScroll>
				</div>
			))
		}
	</Localize>
);
