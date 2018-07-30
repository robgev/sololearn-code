import React from 'react';
import { observer } from 'mobx-react';
import Paper from 'material-ui/Paper';
import InfiniteScroll from 'components/InfiniteScroll';
import CodeShimmer from 'components/Shimmers/CodeShimmer';
import 'styles/Playground/Codes.scss';
import CodeItem from './CodeItem';

const CodesList = observer(({
	codes, loadMore, hasMore, header = null,
}) => (
	<div className="codes-wrapper">
		{
			codes.length === 0 && !hasMore
				? <div>No codes found</div>
				: (
					<div>
						{
							codes.length === 0 &&
								<Paper style={{ height: '100vh', overflow: 'hidden' }}>
									{header}
									<CodeShimmer />
								</Paper>
						}
						<InfiniteScroll
							header={codes.length !== 0 ? header : null}
							loadMore={loadMore}
							hasMore={hasMore}
							style={{
								display: 'flex',
								padding: 15,
								flexDirection: 'column',
							}}
						>
							{codes.map(code => (
								<CodeItem key={code.id} code={code} />
							))}
						</InfiniteScroll>
					</div>
				)
		}
	</div>
));

export default CodesList;
