<template>
  <Home/>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Home from  "@/views/Home.vue";

@Component({
  components: {
     Home
  },
})
export default class Main extends Vue {
 
}
</script>