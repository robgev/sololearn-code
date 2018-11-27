export const htmlWrapperRegex = new RegExp(/<html>([\s\S]*)<\/html>/);
export const headWrapperRegex = new RegExp(/<head>([\s\S]*)<\/head>/);
export const bodyWrapperRegex = new RegExp(/<body>([\s\S]*)<\/body>/);
export const htmlOpenTag = new RegExp(/<\s*html\s*>/);
export const htmlCloseTag = new RegExp(/<\s*html\s*\/\s*>/);

export const inputRegexes = {
	cpp: /(cin\s*>>)|(cin\.getline\s*\([a-zA-Z]*,[0-9]*(,[a-zA-Z]*)?\))|((std::)?getline\s*\((std::)?(cin))/,
	cs: /(Console)[\s\S]*Read(Line)?[\s\S]*\(/,
	java: /((Scanner[\s\S]*\([\s\S]*System\.in[\s\S]*\))[\s\S]*(next))|((InputStreamReader[\s\S]*\([\s\S]*System\.in[\s\S]*\))[\s\S]*(read(Line)?[\s\S]*\())/,
	py: /([^a-zA-Z_0-9]input[\s\S]*\()|(^input[\s\S]*\()/,
	rb: /([^a-zA-Z_0-9]gets)/, // ,
	swift: /\breadLine\b\(/,
	kt: /readLine\s*\(|nextInts\s*\(|Scanner\s*\(\s*System\.in\s*\)[\s\S]*next|InputStreamReader\s*\(\s*System\.in\s*\)[\s\S]*read(?:Line)?\(/,
	c: /getchar\s*\(|gets\s*\(|scanf\s*\(|fgets\s*\(/,
};
