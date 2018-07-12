export const AppDefaults = {
	downloadHost: 'https://api.sololearn.com/uploads/',
};

class Service {
	constructor() {
		this.accessToken = null;
		this.authPromise = null;
		this.accessToken = null;
		this.accessTokenExpireTime = 0;
	}
	setAccessToken = (accessToken, expiresIn) => {
		this.accessToken = accessToken;
		// Date.now() returns timestamp in miliseconds
		this.accessTokenExpireTime = Date.now() + (expiresIn * 1000);
	}
	_request = (url, options) =>
		fetch(url, { ...options, credentials: 'same-origin' })
			.then(res => res.json())
			.catch(console.error)

	_authenticate = async () => {
		const { accessToken, expiresIn, user } = await this._request(
			'/Ajax/GetSession',
			{ method: 'POST' },
		);
		this.setAccessToken(accessToken, expiresIn);
		return user;
	}

	request = async (url, body = {}) => {
		if (
			this.accessToken === null
			|| Date.now() > this.accessTokenExpireTime) {
			await this.authenticate();
		}
		return this._request(`/api/${url}`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${this.accessToken}`,
			},
		});
	}

	authenticate = async () => {
		if (this.authPromise === null) {
			this.authPromise = this._authenticate()
				.then((res) => {
					this.authPromise = null;
					return res; // Need to read in index.js file to see if authenticate returned a user
				});
		}
		return this.authPromise;
	}
}

export default new Service();
