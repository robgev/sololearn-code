// Library name: normalizr
// Authors Robert Gevorgyan<robert1999.g@gmail.com>
// And Erik Davtyan <erikdavtyan@gmail.com>

export default (elements) => {
	const entities = {};
	const ids = [];
	elements.forEach((elm) => {
		const { id } = elm;
		ids.push(id);
		entities[id] = elm;
	});
	return { entities, ids };
};
