## Simple twitch compilation generator.
---
## Install
    $ git clone git@github.com:iErcann/TwitchCompilationGenerator.git
    $ cd TwitchCompilationGenerator
    $ npm install
    
## Requirements
Node.js, NPM, installed in your environment.

#### Windows
 You have to add ffmpeg to your path: [tutorial](https://windowsloop.com/install-ffmpeg-windows-10/#add-ffmpeg-to-Windows-path)
 
 FFmpeg builds [here](https://github.com/BtbN/FFmpeg-Builds/releases)
 
#### Debian/Ubuntu
It should work without any problem, see if this package is installed:  `libav-tools`

#### If you have any issue with ffmpeg/ffprobe
https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#prerequisites

### Configure  
Open `config.ts` then paste your client id. 
To get your own client id you need to create a Twitch application [here](https://dev.twitch.tv/console/apps)

### Running the project
    $ npm run start
 
 
