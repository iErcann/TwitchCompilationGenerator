<template>
  <div class="search">
    <v-container>
      <div class="d-flex flex-column mb-6">
        <SearchComponent />
        <v-container class="mt-5">
          <v-row class="justify-center">
            <template v-for="(clipData, i) in clips">
              <ClipComponent
                :clipData="clipData"
                :key="i"
              />
            </template>
          </v-row>
        </v-container>
      </div>
    </v-container>

    <div>
      <v-bottom-navigation
        fixed
        outlined
        min-width="300px"
        background-color="accent"
        style="
          border-radius: 20px;
          left: 50%;
          width: 20%;
          transform: translate(-50%, 0%);
        "
      >
        <v-btn
          style="width: 100%; height: 100%"
          color="accent"
        >
          <span>ADD SELECTED CLIPS</span>
          <v-icon>mdi-table-plus </v-icon>
        </v-btn>
        <v-btn
          style="width: 100%; height: 100%"
          color="accent"
        >
          <span> EDIT </span>
          <v-icon> mdi-arrow-right-bold-box-outline</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </div>
  </div>
</template>
<style scoped>
.border {
  border-radius: 450px;
}

#fixedContainer {
  position: fixed;
  width: 600px;
  height: 200px;
  right: 50%;
  margin-left: 300px;
}
</style>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ws from "../services/websocket";
import ClipComponent from "@/components/ClipComponent.vue";
import SearchComponent from "@/components/SearchComponent.vue";

import {
  IAutomaticCompilationConfig,
  ICompilationConfig,
  ClipData,
  NetworkMessage,
} from "../../../core/types/index";

@Component({
  components: {
    ClipComponent,
    SearchComponent,
  },
})
export default class Search extends Vue {
  mounted() {
    ws.onmessage = (event) => {
      const response: NetworkMessage = JSON.parse(event.data);
      console.log(response);
      if (response.header === "clipSearchResult") {
        this.clips = response.data as Array<ClipData>;
      }
    };
  }
  private clips: Array<ClipData> = [];

  checkbox = true;
}
</script>