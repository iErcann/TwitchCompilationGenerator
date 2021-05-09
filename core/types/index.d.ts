export interface IResolution {
	width: number;
	height: number;
}

 

// export interface IAutomaticCompilationConfig {
// 	channelName?: string;
// 	clipCount?: number;
// 	period?: string;
// 	trending?: boolean;
// 	language?: string;
// 	editing: boolean;
// 	game?: string;
// 	log: boolean;
// 	introPath?: string;
// 	outroPath?: string;
// 	clipsList?: string;
// }


 
export interface IManualCompilationConfig extends ICompilationConfig {
	clipsList: Array<string>;
}

export interface IAutomaticCompilationConfig extends ICompilationConfig {
	channelName?: string;
	clipCount: number;
	period: string;
	trending?: boolean;
	language?: string;
	game?: string;
 }

export interface ICompilationConfig {
	log: boolean;
	editing: boolean;
	introPath?: string;
	outroPath?: string;
}
export interface BroadcasterData {
	id: string;
	name: string;
	display_name: string;
	channel_url: string;
	logo: string;
}

export interface VodData {
	id: string;
	url: string;
	offset: number;
	preview_image_url: string;
}
export interface ClipData {
	tracking_id: string;
	url: string;
	embed_html: string;
	embed_url: string;
	language: string;
	broadcaster: BroadcasterData;
	vod: VodData;
	game: string;
	title: string;
	views: number;
	duration: number;
	created_at: string;
	thumbnails: {
		medium: string;
		small: string;
		tiny: string;
	}
}



export interface NetworkMessage {
	header: string,
	data: object;
}