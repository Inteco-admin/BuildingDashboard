<template>
    <div class="control-panel">
        <v-card class="fill-height pa-2">
            <control-panel-form />
        </v-card>
        <v-card class="fill-height mt-2 pa-2">
            <level-selector />
        </v-card>
        <v-card class="mt-2 pa-2">
            <viewer-controls />
        </v-card>

    </div>
</template>

<script>
import ControlPanelForm from "./ControlPanelForm";
import LevelSelector from "./LevelSelector.vue";
import ViewerControls from "./ViewerControls.vue";
export default {
    components: {
        ControlPanelForm,
        LevelSelector,
        ViewerControls,
    },
};
</script>

<style>
.cube {
    width: 30px;
    height: 30px;
}

.cube.red {
    background-color: red;
}
</style>
