<template>
  <div class="search">
    <v-container>
      <div class="d-flex flex-column mb-6">
        <v-card-actions class="justify-center">
          <v-btn
            class="ma-1"
            width="50%"
            color="accent"
            elevation="24"
            outlined
          > Search </v-btn>
        </v-card-actions>

        <v-container class="mt-1">
          <v-row class="justify-center">
            <template v-for="n in 200">
              <v-sheet
                :key="n"
                class="ma-4"
                outlined
                width="250"
                height="250"
              >
                <v-sheet
                  class="pa-3 primary text-right"
                  dark
                  rounded="t-xl"
                  height="50"
                >
                  <v-btn
                    class="ml-2"
                    icon
                  >
                    <v-icon>mdi-check-bold</v-icon>
                  </v-btn>
                </v-sheet>
                <v-img src="https://clips-media-assets2.twitch.tv/41865006814-offset-11888-preview-480x272.jpg">

                </v-img>
                Clip {{ n }}
              </v-sheet>
            </template>
          </v-row>
        </v-container>
      </div>
    </v-container>

    <div>
      <v-bottom-navigation
        fixed
        min-width="300px"
        background-color="primary"
        style=" 
        border-radius: 20px;
        left: 50%;
        width: 20%;
        transform: translate(-50%, 0%);
        "
      >
        <v-btn
          style="width: 100%; height:100%;"
          color="primary"
        >
          <span>ADD SELECTED CLIPS</span>
          <v-icon>mdi-table-plus </v-icon>
        </v-btn>
        <v-btn
          style="width: 100%; height:100%;"
          color="primary"
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
</style>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Search extends Vue {}
</script>