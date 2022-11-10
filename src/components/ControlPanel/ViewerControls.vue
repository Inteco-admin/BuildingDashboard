<template>
    <div class="viewer-controls">
        <div class="viewer-controls__title">Управление видимостью:</div>
        <div class="viewer-controls__btns mt-5">
            <v-btn color="secondary" @click="showAll"> Показать все </v-btn>
            <v-btn color="error" class="ml-2" @click="showProblems">
                Проблемы
            </v-btn>
        </div>
    </div>
</template>

<script>
import Bus from "@/Bus.js";
export default {
    methods: {
        showProblems() {
            Bus.$emit("showProblems");
        },
        showAll() {
            Bus.$emit("showAll");
        },
    },
};
</script>

<style>
.viewer-controls__btns {
    display: flex;

    justify-content: center;
}
</style>