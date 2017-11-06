import EnumNameMapper from '../utils/enumNameMapper';

const contestTypes = {
	Won: 1,
	Lost: 2,
	GotChallenged: 3, // You are invited
	Started: 4, // Your turn
	Challenged: 5, // Opponents turn
	GotDeclined: 6, // Opponent declined
	Expired: 7,
	Draw: 8,
};
EnumNameMapper.apply(contestTypes);

export default contestTypes;
