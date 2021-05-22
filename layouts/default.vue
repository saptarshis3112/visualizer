<template>
  <v-app dark>
    <Navbar />
    <nuxt />
  </v-app>
</template>

<script>
import Navbar from "../components/navbar";
export default {
  components: {
    Navbar,
  },
};
</script>
