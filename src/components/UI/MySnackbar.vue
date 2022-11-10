<template>
    <div class="text-right">
        <v-snackbar
            :timeout="timeout"
            :value="true"
            color="blue-grey"
            absolute
            bottom
            left
            rounded="pill"
            v-model="snackbar"
        >
            {{ text }}

            <template v-slot:action="{ attrs }">
                <v-btn
                    color="white"
                    text
                    v-bind="attrs"
                    @click="snackbar = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import Bus from "@/Bus";
export default {
    data: () => ({
        snackbar: false,
        text: "My timeout is set to 2000.",
        timeout: 2000,
    }),
    mounted() {
        Bus.$on("message", (text) => {
            this.text = text;
            this.snackbar = true;
        });
    },
};
</script>