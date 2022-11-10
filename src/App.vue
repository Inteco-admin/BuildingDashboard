<template>
  <v-app>
    <v-app-bar app color="blue-grey" dark> Model viewer </v-app-bar>

    <v-main>
      <v-container fluid class="fill-height">
        <v-row class="fill-height ma-0">
          <v-col class="pa-0 col">
            <viewer />
          </v-col>
          <v-col class="pt-0 pb-0 pr-0 col-3">
            <control-panel />
          </v-col>
        </v-row>
        <my-snackbar />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ControlPanel from "./components/ControlPanel/ControlPanel.vue";
import MySnackbar from "./components/UI/MySnackbar.vue";
import Viewer from "./components/Viewer/Viewer.vue";

export default {
  name: "App",

  components: {
    Viewer,
    MySnackbar,
    ControlPanel,
  },

  data: () => ({
    //
  }),
};
</script>
