export default class Storage {
    save = function (key, value) {
    	try {
    		localStorage.setItem(key, JSON.stringify({ data: value }));
    	} catch (e) {
    		console.log(`LocalStorageWriteFault: ${e.message} D: ${e.description}`);
    	}
    }

    load = function (key) {
    	let item = null;
    	try {
    		item = localStorage.getItem(key);
    	} catch (e) {
    		console.log(`LocalStorageReadFault: ${e.message} D: ${e.description}`);
    	}
    	if (!item) return null;

    	return JSON.parse(item).data;
    }

    remove = function (key) {
    	try {
    		localStorage.removeItem(key);
    	} catch (e) {
    		console.log(`LocalStorageRemoveFault: ${e.message} D: ${e.description}`);
    	}
    }

    clear = function (keepCredentials) {
    	try {
    		localStorage.clear();
    	} catch (e) {
    		console.log(`LocalStorageClearFault: ${e.message} D: ${e.description}`);
    	}
    }
}
