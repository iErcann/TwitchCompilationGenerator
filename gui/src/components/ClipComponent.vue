<template>
  <v-card
    class="ma-3"
    width="300"
    style="border-radius: 10px 10px 30px 30px"
    :color="selected?'accent':'primary'"
  >
    <v-img
      id="clickable"
      :src="clipData.thumbnails.medium"
      @click="selected=!selected"
    />

    <v-card-title class="title">
      <v-avatar size="50">
        <img
          alt="user"
          :src="clipData.broadcaster.logo"
        />
      </v-avatar>
      <a
        class="ml-3 ma-0 pa-0 body-1 white--text title"
        :href="clipData.url"
        target="_blank"
      >
        {{ trim(clipData.title, 45) }}
        <!--         <v-icon
          large
          small
        > mdi-arrow-up-bold </v-icon>
 -->
      </a>
    </v-card-title>
    <v-card-text class="text-center body-1 ma-0 pa-0">
      {{clipData.broadcaster.name}} - {{clipData.game}}
      <p>{{clipData.views}} views - {{getRelativeTime(new Date(clipData.created_at))}}</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ClipData } from "../../../core/types";

@Component
export default class ClipComponent extends Vue {
  @Prop() readonly clipData!: ClipData;
  private selected: boolean = false;
  private trim(str: string, length: number): string {
    let trimmedStr = str.substring(0, length);
    if (str.length > length) trimmedStr += "...";
    return trimmedStr;
  }
  getRelativeTime(date: Date): string {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = <any>new Date() - <any>date;

    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + " seconds ago";
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + " minutes ago";
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + " hours ago";
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + " days ago";
    } else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + " months ago";
    } else {
      return +Math.round(elapsed / msPerYear) + " years ago";
    }
  }
}
</script>

<style scoped>
.title {
  flex-wrap: nowrap;
  white-space: pre-wrap;
  word-break: break-word;

  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
}
#clickable {
  cursor: pointer;
}
</style>
