<template>
  <v-container class="mt-5">
    <draggable
      :list="selectedClips"
      id="draggable"
      class="list-group dragArea"
      v-bind="dragOptions"
      @start="drag=true"
      @end="drag=false"
    >
      <transition-group
        type="transition"
        name="flip-list"
      >
        <template v-for="(clipData, i) in selectedClips">
          <ClipComponent
            :searchPhase=false
            class="list-group-item"
            :clipData="clipData"
            ref="clipComponent"
            :key="i"
            v-on:removed="selectedClips.splice(i, 1)"
          />
        </template>
      </transition-group>
    </draggable>

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
          @click="$router.push({path: '/search' })"

        >
          <span>SEARCH NEW CLIPS</span>
          <v-icon>mdi-arrow-left </v-icon>
        </v-btn>
        <v-btn
          style="width: 100%; height: 100%"
          color="accent"
          v-on:click="startRender"
        >
          <span> RENDER </span>
          <v-icon> mdi-arrow-right-bold-box-outline</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </div>

  </v-container>
</template>

<script lang="ts">
import draggable from "vuedraggable";
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
    draggable,
  },
})
export default class Edition extends Vue {
  @Prop() selectedClips!: Array<ClipData>;
  mounted() {
    console.log(this.selectedClips);
  }
  startRender() {
    alert("Launched");
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

  get dragOptions() {
    return {
      animation: 0,
      group: "description",
      disabled: false,
      ghostClass: "ghost",
    };
  }
}
</script>

<style>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
#draggable span {
  justify-content: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>