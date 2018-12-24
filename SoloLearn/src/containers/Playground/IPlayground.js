import Service from 'api/service';
import { observable, action, computed } from 'mobx';
import { defaultCodes } from './utils/Texts';
import {
	addExternal,
	addUserScript,
	checkForInput,
	wrapCodeWithComment,
} from './utils/Functions';

class IPlayground {
	MAX_INPUT_LENGTH = 100;
	@observable data = null;
	@observable language = null;
	@observable getCodePromise = null;
	@observable isDark = true;
	@observable isInputPopupOpen = false;
	@observable isOutputOpen = false;
	@observable isFullscreen = false;
	@observable editorState = null;
	@observable inputValue = '';
	@observable saveCodePromise = null;
	@observable compileCodePromise = null;
	@observable output = null;

	constructor({
		userId,
		inline,
		publicId,
		language,
		lessonCodeId,
	}) {
		this.userId = userId;
		this.lessonCodeId = lessonCodeId;
		this.publicId = publicId;
		this.isInline = inline;
		this.isFullscreen = !inline;
		this.isDark = !inline;
		this.language = language;
		this.editorState = {
			sourceCode: defaultCodes[language],
			cssCode: defaultCodes.css,
			jsCode: defaultCodes.js,
		};
		this.data = { ...this.editorState, isPublic: false, name: null };
		this.type = null;
	}

	@action getCode = async () => {
		if (this.getCodePromise === null && (this.publicId !== null || this.lessonCodeId !== null)) {
			if (this.publicId !== null) {
				this.getCodePromise = Service.request('Playground/GetCode', { publicId: this.publicId });
			} else
			if (this.lessonCodeId !== null) {
				this.getCodePromise = Service.request('Playground/GetCodeSample', { id: this.lessonCodeId });
			}
			try {
				const { code } = await this.getCodePromise;
				this.data = code;
				const { cssCode, jsCode, sourceCode } = code;
				this.editorState = { cssCode, jsCode, sourceCode };
				if (this.language === null) {
					this.language = this.data.language === 'web' ? 'html' : this.data.language;
				}
			} finally {
				this.getCodePromise = null;
			}
		}
		return this.getCodePromise;
	}

	extractCodeFromObject(target) {
		switch (this.language) {
		case 'css':
			return target.cssCode;
		case 'js':
			return target.jsCode;
		default:
			return target.sourceCode;
		}
	}

	@computed get code() {
		return this.extractCodeFromObject(this.editorState);
	}

	@computed get totalCode() {
		return this.isWeb
			? `${this.editorState.sourceCode}\n${this.editorState.cssCode}\n${this.editorState.jsCode}`
			: this.editorState.sourceCode;
	}

	@computed get numberOfLines() {
		// Note: We get unicode return symbol, so I added that symbol to regex
		// IMPORTANT: This needs to be changed ASAP
		return this.totalCode.split((/\r\n|\n|\r|↵/)).length;
	}

	@computed get numberOfSymbols() {
		return this.totalCode.length;
	}

	@computed get latestSavedCode() {
		return this.extractCodeFromObject(this.data);
	}

	@computed get isFetching() {
		return this.getCodePromise !== null;
	}

	@computed get isSaving() {
		return this.saveCodePromise !== null;
	}

	@computed get isRunning() {
		return this.compileCodePromise !== null;
	}

	@computed get isWeb() {
		return [ 'html', 'css', 'js' ].includes(this.language);
	}

	@computed get hasLiveOutput() {
		return this.isWeb || this.language === 'php';
	}

	@computed get isMyCode() {
		return this.data.userID === this.userId;
	}

	@computed get isResetDisabled() {
		return this.code === this.latestSavedCode;
	}

	set code(value) {
		switch (this.language) {
		case 'css':
			this.editorState.cssCode = value;
			break;
		case 'js':
			this.editorState.jsCode = value;
			break;
		default:
			this.editorState.sourceCode = value;
			break;
		}
	}

	@action changeLanguage = (language) => {
		this.language = language;
	}

	@action togglePublic = async () => {
		this.data.isPublic = !this.data.isPublic;
		const { error } = await Service.request('Playground/ToggleCodePublic', { id: this.data.id, isPublic: this.data.isPublic });
		if (error) {
			this.data.isPublic = !this.data.isPublic;
		}
	}

	@action toggleTheme = () => {
		this.isDark = !this.isDark;
	}

	@action toggleInputPopup = () => {
		this.isInputPopupOpen = !this.isInputPopupOpen;
	}

	@action toggleFullScreen = () => {
		this.isFullscreen = !this.isFullscreen;
	}

	@action resetToSaved = () => {
		this.code = this.latestSavedCode;
	}

	@action changeInputValue = (e) => {
		if (e.target.value.length <= this.MAX_INPUT_LENGTH) {
			this.inputValue = e.target.value;
		} else {
			this.inputValue = e.target.value.substring(0, this.MAX_INPUT_LENGTH);
		}
	}

	@action changeEditorState = (editorValue) => {
		this.code = editorValue;
	}

	@action addExternalResource = ({ sourceUrl }) => {
		this.editorState.sourceCode =
			addExternal({
				code: this.editorState.sourceCode,
				value: `<script src="${sourceUrl}"></script>`,
			});
	}

	@action showOutput = (output) => {
		this.output = output;
		this.isOutputOpen = true;
	}

	@action hideOutput = () => {
		this.isOutputOpen = false;
	}

	@action runCodeRequest = async () => {
		this.compileCodePromise =
		Service.request('Playground/CompileCode', {
			code: this.editorState.sourceCode,
			language: this.language,
			input: this.inputValue,
		});
		try {
			this.isOutputOpen = true;
			const { output } = await this.compileCodePromise;
			this.showOutput(output);
		} finally {
			this.compileCodePromise = null;
			this.inputValue = '';
		}
	}

	@action runWebCode = () => {
		const htmlWithCss = addExternal({
			code: this.editorState.sourceCode,
			value: `<style>${this.editorState.cssCode}</style>`,
		});
		const errorHandlerEmbedded = addExternal({
			code: htmlWithCss,
			value: `
			<script type="text/javascript">
				window.onerror = (msg, url, line, col, error) => {
					const lineText = line === 0 ? "" : \`Line: $\{line}\`;
					const errorMessage = \`$\{msg}
					$\{lineText}\`;
					console.error(errorMessage);
					return false;
				}
			</script>
			`,
		});
		const wholeCode = addUserScript({
			code: errorHandlerEmbedded,
			value: `<script type="text/javascript">${this.editorState.jsCode}</script>`,
		});
		this.showOutput(wholeCode);
	}

	@action runCompiledCode = async () => {
		const needsInput = checkForInput({
			code: this.editorState.sourceCode,
			language: this.language,
		});
		if (needsInput && !this.inputValue && !this.isInputPopupOpen) {
			this.toggleInputPopup();
		} else {
			this.isInputPopupOpen = false;
			this.runCodeRequest();
		}
	}

	@action saveCodeRequest = async ({
		id,
		name = this.data.name,
		isPublic = this.data.isPublic,
	}) => {
		this.saveCodePromise =
			Service.request('Playground/SaveCode', {
				id,
				name,
				isPublic,
				code: this.editorState.sourceCode,
				language: this.isWeb ? 'web' : this.language,
				jsCode: this.isWeb ? this.editorState.jsCode : null,
				cssCode: this.isWeb ? this.editorState.cssCode : null,
			});
		try {
			const { code } = await this.saveCodePromise;
			this.data = { ...this.data, ...code };
		} finally {
			this.saveCodePromise = null;
		}
	}

	@action saveCode = () => {
		this.saveCodeRequest({ id: this.data.id });
	}

	@action saveNewCode = async ({ name, isPublic }) => {
		if (this.data) {
			if (!this.isMyCode && this.data.userID) {
				// If it is another user's code we should give credits :)
				this.editorState =
					wrapCodeWithComment({
						editorState: this.editorState,
						userName: this.data.userName,
						language: this.language,
					});
			}
		}
		// We need to send id = 0 if we want to create a brand new code.
		await this.saveCodeRequest({ id: 0, name, isPublic });
	}
}

export default IPlayground;
