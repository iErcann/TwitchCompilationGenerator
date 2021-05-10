<template>

  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="ma-1"
          width="50%"
          color="accent"
          outlined
          v-bind="attrs"
          v-on="on"
        >
          New search

        </v-btn>
      </template>

      <v-card>
        <v-card-title>
          Search form
        </v-card-title>

        <v-card-text>
          <v-form>
            Leave blank for all channels
            <v-text-field
              label="Channel name"
              solo
              color="secondary"
              v-model="channelName"
            />
            Leave blank for all games
            <v-text-field
              label="Game name"
              solo
              color="secondary"
              v-model="game"
            />

            Leave blank for all languages
            <v-text-field
              label="Language (Example: fr/en/tr)"
              solo
              color="secondary"
              v-model="language"
            />

            <v-select
              :items="['day', 'week', 'month', 'all']"
              label="Period"
              color="secondary"
              v-model="period"
            />
            <v-slider
              v-model="clipCount"
              label="Clip count"
              thumb-label
              persistent-hint
              min="0"
              max="100"
              color="secondary"
            ></v-slider>

            <v-checkbox
              label="Trending"
              color="secondary"
              v-model="trending"
            />
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="searchClips"
          >
            SEARCH
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ClipData, IAutomaticCompilationConfig, NetworkMessage } from "../../../core/types";
import ws from "../services/websocket";

@Component
export default class SearchComponent extends Vue {
  private clipCount: number = 10;
  private period: string = "";
  private channelName: string = "";
  private trending: boolean = false;
  private language: string = "";
  private game: string = "";

  private clips: Array<ClipData> = [];
  private dialog = false;
  searchClips() {
    this.dialog = false;
    const config: IAutomaticCompilationConfig = {
      clipCount: this.clipCount,
      period: this.period,
      log: false,
      channelName: this.channelName,
      trending: this.trending,
      game: this.game,
      language: this.language,
      editing: false,
    };

    let request : NetworkMessage= {
      header: "clipSearch",
      data: config,
    };
    ws.send(JSON.stringify(request));
  }
}
</script>