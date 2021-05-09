import { ICompilationConfig } from '../types';


export function isAutomatic(config: ICompilationConfig): boolean {
	return config.hasOwnProperty("clipCount");
}



export function getSlug(url: string): string {
	url = url.substring(url.lastIndexOf('/') + 1);
	if (url.includes("?")) {
		url = url.substring(0, url.lastIndexOf('?'));
	}
	return url;
}






