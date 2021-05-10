<template>
  <div class="edit">
    <v-container>
      <div class="d-flex flex-column mb-6">
        <v-container class="mt-5">

          <v-row class="justify-center">
            <template v-for="(clipData, i) in selectedClips">
              <ClipComponent
                :clipData="clipData"
                :key="i"
                ref="clipComponent"
              />
            </template>
          </v-row>
          <v-btn v-on:click="startRender">
            Render
          </v-btn>
        </v-container>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ClipComponent from "@/components/ClipComponent.vue";
import {
  ClipData,
  IManualCompilationConfig,
  NetworkMessage,
} from "../../../core/types";
import ws from "../services/websocket";

@Component({
  components: {
    ClipComponent,
  },
})
export default class Edition extends Vue {
  @Prop() selectedClips!: Array<ClipData>;
  mounted() {
    console.log(this.selectedClips);
  } 
  startRender() {
    alert("Launched")
    const manualCompilationConfig: IManualCompilationConfig = {
      log: false,
      editing: false,
      clipsList: [],
    };
    for (let i = 0; i < this.selectedClips.length; i++) {
      manualCompilationConfig.clipsList.push(this.selectedClips[i].url);
    }

    let request: NetworkMessage = {
      header: "render",
      data: manualCompilationConfig,
    };
    ws.send(JSON.stringify(request));
  }
}
</script>