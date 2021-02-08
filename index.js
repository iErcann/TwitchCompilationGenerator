const { client_id } = require("./config.js");
const axios = require("axios").default;
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const https = require("https");
const fs = require("fs");
const readline = require("readline");
if (client_id === "")
  throw new Error("Empty client_id, please modify it in config.js!");

axios.defaults.headers.common["Client-ID"] = client_id;
axios.defaults.headers.common["Accept"] = "application/vnd.twitchtv.v5+json";

!fs.existsSync("output") && fs.mkdirSync("output");
!fs.existsSync("edited_videos") && fs.mkdirSync("edited_videos");
!fs.existsSync("videos") && fs.mkdirSync("videos");

(async function () {
  function askQuestion(query) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) =>
      rl.question(query, (ans) => {
        rl.close();
        resolve(ans);
      })
    );
  }

  const channel = await askQuestion("Enter a channel name : ");
  const clipsNumber = await askQuestion("How many clips do you want? ");
  let period = await askQuestion("Which period? (day, week, month) :");
  axios
    .get(
      `https://api.twitch.tv/kraken/clips/top?channel=${channel}&period=${period}&trending=false&limit=${clipsNumber}`,
      {}
    )
    .then(async (res) => {
      const clips = res.data.clips;
      console.log("GET request finished.");

      for (let i = 0; i < clips.length; i++) {
        const filename = `${i}`;
        const path = `videos/${filename}.mp4`;
        const clip = clips[i];
        const thumbUrl = clip.thumbnails.medium;
        const dlUrl =
          thumbUrl.substring(0, thumbUrl.indexOf("-preview")) + ".mp4";
        console.log(`Downloading clip  ${i}`);
        console.log(`Channel :  ${clip.broadcaster.display_name}`);
        console.log(`Title :  ${clip.title}`);
        console.log(`Game: ${clip.game}`);
        console.log(`Views: ${clip.views}`);

        //console.log(clip);
        await downloadClip(path, dlUrl);
        await editVideo(path, filename, clip);
        console.log(`Downloaded and edited. ${i}`);
      }
      await mergeVideos();
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      console.log("done");
    });

  function downloadClip(path, dlUrl) {
    const file = fs.createWriteStream(path);
    return new Promise((resolve) => {
      https.get(dlUrl, async (response) => {
        response.pipe(file);
        file.on("finish", async () => {
          console.log(`Clip downloaded.`);
          resolve("foo");
        });
      });
    });
  }

  function editVideo(originalPath, filename, clipData) {
    return new Promise((resolve) => {
      ffmpeg(originalPath)
        .on("error", function (err) {
          console.log("an error happened: " + err.message);
        })
        .on("progress", function (info) {
          console.log("Editing progress " + info.percent + "%");
        })
        .on("end", function () {
          console.log("Edition finished.");
          resolve();
        })

        .videoFilters([
          {
            filter: "drawtext",
            options: {
              text: `${clipData.title}`,
              fontcolor: "white",
              fontsize: 45,
              x: "(main_w/2-text_w/2)",
              y: "(main_h-text_h*2)",
              shadowcolor: "black",
              box: "1",
              boxcolor: "black@0.7",
              boxborderw: 10,
              shadowx: 0,
              shadowy: 0,
            },
          },
          {
            filter: "drawtext",
            options: {
              text: `${clipData.broadcaster.display_name}`,
              fontcolor: "white",
              fontsize: 40,
              x: "(main_w-text_w-10)",
              y: "(10)",
              shadowcolor: "black",
              box: "1",
              boxcolor: "black@0.7",
              boxborderw: 10,
              shadowx: 0,
              shadowy: 0,
            },
          },
        ])
        .save(`edited_videos/${filename}.mp4`);
    });
  }
  function mergeVideos() {
    return new Promise((resolve) => {
      const proc = ffmpeg().on("end", function () {
        console.log("Merge finished.");
        resolve();
      });
      const directoryPath = path.join(__dirname, "edited_videos");
      console.log("Merge started.");
      fs.readdir(directoryPath, function (err, files) {
        if (err) {
          return console.log("Unable to scan directory: " + err);
        }
        files.forEach(function (file) {
          proc.input("edited_videos/" + file);
        });
        proc.mergeToFile("output/merged.mp4");
      });
    });
  }
})();
