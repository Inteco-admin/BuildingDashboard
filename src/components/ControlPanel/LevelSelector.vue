<template>
    <div class="level-selector">
        <div class="level-selector__title">Доступные уровни:</div>
        <div class="level-selector__content">
            <v-btn
                v-for="item in items"
                :key="item"
                @click="selectLevel(item)"
                class="mt-1 ml-1"
            >
                {{ item }}
            </v-btn>
        </div>
    </div>
</template>

<script>
import Bus from "@/Bus.js";
export default {
    data() {
        return {
            items: [],
        };
    },
    mounted() {
        Bus.$on("level-list ready", (filteredLevels) => {
            this.items = filteredLevels;
        });
    },
    methods: {
        selectLevel(item) {
            Bus.$emit("level selected", item);
        },
    },
};
</script>

<style scoped>
.level-selector__content {
    display: flex;
    justify-content: center;
    flex-wrap: wrap !important;
}
button {
    flex: 0 0 30% !important;
}
</style>