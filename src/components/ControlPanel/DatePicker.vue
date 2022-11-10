<template>
    <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="date"
        persistent
        width="290px"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="date"
                label="Выберите дату"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
        </template>
        <v-date-picker v-model="date" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="modal = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="updateDate(date)"> OK </v-btn>
        </v-date-picker>
    </v-dialog>
</template>

<script>
// TODO: refactor this copy/pasted code !!!
import Bus from "@/Bus.js";
export default {
    data() {
        return {
            date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .substr(0, 10),
            modal: false,
        };
    },
    methods: {
        updateDate(date) {
            this.$refs.dialog.save(date);

            Bus.$emit("update-date", date);
        },
    },
};
</script>

<style>
</style>