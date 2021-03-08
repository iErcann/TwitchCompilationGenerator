<template>
  <v-card class="ma-3" width="269" style="border-radius: 10px 10px 30px 30px">
    <v-img
      src="https://clips-media-assets2.twitch.tv/AT-cm%7C1070286972-preview-480x272.jpg"
    />

    <v-card-title class="white--text title">
      <v-avatar size="50">
        <img
          alt="user"
          src="https://cdn.pixabay.com/photo/2020/06/24/19/12/cabbage-5337431_1280.jpg"
        />
      </v-avatar>
      <a
        class="ml-3 ma-0 pa-0 body-1"
        style="font-weight: bold; cursor: pointer; text-decoration: none"
        href="https://www.twitch.tv/blacoiso/videos"
      >
        {{ trim(title, 37) }}
        <v-icon large color="accent" small> mdi-arrow-up-bold </v-icon>
      </a>
    </v-card-title>
    <v-card-text class="text-center body-1 ma-0 pa-0">
      pewdiepie - CS:GO
      <p>157923 views - 3 weeks ago</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Clip extends Vue {
  title =
    "Jordan Peterson: “There was plenty of motivation to take me out. It just didn't work  | British GQ";
  private trim(str: string, length: number): string {
    let trimmedStr = str.substring(0, length);
    if (str.length > length) trimmedStr += "...";
    return trimmedStr;
  }
}
</script>

<style scoped>
.title {
  flex-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 29ch;
}
</style>
