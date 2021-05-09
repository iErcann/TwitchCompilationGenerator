<template>
  <Home/>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Search from  "@/views/Search.vue";
import Home from  "@/views/Home.vue";

@Component({
  components: {
    Search, Home
  },
})
export default class Main extends Vue {
 
}
</script>