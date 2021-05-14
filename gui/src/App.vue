<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      dense
    >
      <div class="headline">
        TwitchCompilationGenerator
      </div>
      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/iErcann/TwitchCompilationGenerator"
        target="_blank"
        text
      >
        <span class="mr-2">Project</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="  align-center ">
      <router-view :selectedClips="selectedClips"></router-view>
    </v-main>

  </v-app>
</template>

 <script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Main from "@/views/Main.vue"; // @ is an alias to /src
import { ClipData } from "../../core/types";

@Component({
  components: {
    Main,
  },
})
export default class App extends Vue {
  private selectedClips: Array<ClipData> = [];
}
</script>