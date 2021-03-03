<template>
  <Search/>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Search from  "@/components/Search.vue";
@Component({
  components: {
    Search,
  },
})
export default class Main extends Vue {
 
}
</script>