<template>
  <div class="search">
    <v-container>
      <div class="d-flex flex-column mb-6">
        <v-card-actions class="justify-center">
          <v-btn class="ma-1" width="50%" color="accent" outlined>
            Search
          </v-btn>
        </v-card-actions>

        <v-container class="mt-5">
          <v-row class="justify-center">
            <template v-for="n in 100">
              <Clip :key="n" />
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
        <v-btn style="width: 100%; height: 100%" color="accent">
          <span>ADD SELECTED CLIPS</span>
          <v-icon>mdi-table-plus </v-icon>
        </v-btn>
        <v-btn style="width: 100%; height: 100%" color="accent">
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
  margin-left: 300px; /*half the width*/
}
</style>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Clip from "@/components/Clip.vue";

@Component({
  components: {
    Clip,
  },
})
export default class Search extends Vue {
  checkbox = true;
}
</script>