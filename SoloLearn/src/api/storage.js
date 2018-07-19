class Storage {
	save = (key, value) => {
		try {
			localStorage.setItem(key, JSON.stringify({ data: value }));
		} catch (e) {
			throw new Error(`LocalStorageWriteFault: ${e.message} D: ${e.description}`);
		}
	}

	load = (key) => {
		try {
			const item = localStorage.getItem(key);
			return item === null ? null : JSON.parse(item).data;
		} catch (e) {
			throw new Error(`LocalStorageReadFault: ${e.message} D: ${e.description}`);
		}
	}

	remove = (key) => {
		try {
			localStorage.removeItem(key);
		} catch (e) {
			throw new Error(`LocalStorageRemoveFault: ${e.message} D: ${e.description}`);
		}
	}

	clear = () => {
		try {
			localStorage.clear();
		} catch (e) {
			throw new Error(`LocalStorageClearFault: ${e.message} D: ${e.description}`);
		}
	}
}

export default new Storage();
