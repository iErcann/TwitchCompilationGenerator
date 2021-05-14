import * as ffmpeg from 'fluent-ffmpeg';
import * as  ffmpegStatic from 'ffmpeg-static';
import * as ffprobeStatic from 'ffprobe-static';
ffmpeg.setFfmpegPath(ffmpegStatic);
ffmpeg.setFfprobePath(ffprobeStatic.path);
export default ffmpeg;










