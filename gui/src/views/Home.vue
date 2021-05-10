<template>
  <v-container fill-height>
    <v-row
      justify="center"
      align="center"
    >
      <v-card class=" text-center mb-12 pa-16">
        <v-card-text class="display-1">
          Choose your compilation type.
        </v-card-text>
        <v-container>
          <v-btn
            outlined
            x-large
          > Automatic </v-btn>
          <v-btn
            outlined
            x-large
            @click="$router.push({path: '/search'})"
          > Manual </v-btn>
        </v-container>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {}
</script>
