<template>
  <v-form ref="form">
    <v-select
      v-model="select"
      :items="items"
      label="Модель"
      required
    ></v-select>

    <date-picker />

    <div class="control-form__btns mt-5">
      <v-btn
        :loading="loading"
        :disabled="loading"
        color="secondary"
        @click="submit"
      >
        Загрузить
      </v-btn>

      <v-btn color="error" class="ml-2" @click="reset"> Reset Form </v-btn>
    </div>
  </v-form>
</template>

<script>
import GetModelList from "@/utls/modelList.js";
import Bus from "@/Bus.js";
import DatePicker from "./DatePicker.vue";
export default {
  components: { DatePicker },

  data: () => ({
    select: null,

    modelList: [],
    checkbox: false,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    loading: false,
  }),

  mounted() {
    const modelList = GetModelList();

    this.modelList = [...modelList];

    Bus.$on("reload model", () => {
      this.loading = true;
    });

    Bus.$on("colored", () => {
      this.loading = false;
    });
    Bus.$on("update-date", (newDate) => {
      this.date = newDate;
    });
  },

  methods: {
    submit() {
      if (this.select == null) {
        Bus.$emit("message", "Нужно выбрать модель!");
        return;
      }
      const requiredModel = this.modelList.filter(
        (x) => x.name === this.select
      )[0];

      Bus.$emit("reload model", {
        requiredModel: requiredModel,
        date: this.date,
      });
      console.log("loading model " + requiredModel);
    },
    reset() {
      this.$refs.form.reset();
      this.picker = new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10);
    },
  },

  computed: {
    items: function () {
      return this.modelList.map((x) => x.name);
    },
  },
};
</script>
<style scoped>
.control-form__btns {
  display: flex;

  justify-content: center;
}
</style>

