<template>
  <div>
    <Navbar />
    <div class="row" style="padding-top: 2%">
      <div class="offset-lg-1"></div>
      <div class="col-lg-3">
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-slider
                max="40"
                min="10"
                label="List Items: "
                v-model="size"
                thumb-label="always"
              ></v-slider>
              <v-select
                :items="algorithm_type"
                filled
                label="Select Algorithm"
                dense
                v-model="sort_name"
              ></v-select>
              <v-btn @click="sort" depressed color="error" :disabled="loading">
                Sort
              </v-btn>
              &nbsp;
              <v-btn @click="reset" depressed :disabled="loading">
                Reset
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div class="col-lg-8 text-center">
        <v-card outlined elevation="10" style="height: 800px">
          <div>
            <span v-for="(item, key) of items" :key="key">
              <div
                class="bar bar-unsorted"
                :style="{ height: `${barHeight * item}px` }"
              >
                {{ item }}
              </div>
            </span>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/navbar";

export default {
  components: {
    Navbar,
  },

  data() {
    return {
      size: 20,
      items: [],
      algorithm_type: ["MergeSort", "QuickSort", "HeapSort", "BubbleSort"],
      sort_name: "BubbleSort",
      loading: false,
      tempArray: [],

      barHeight: 1.5,
    };
  },

  methods: {
    async do_sort_bubble() {
      this.transitions = [];

      this.tempArray = [...this.items];

      for (let i = 0; i < this.tempArray.length; i++) {
        for (let j = 0; j < this.tempArray.length - 1; j++) {
          if (this.tempArray[j] > this.tempArray[j + 1]) {
            let rows = [this.tempArray[j], this.tempArray[j + 1]];
            this.tempArray.splice(j, 2, rows[1], rows[0]);
            this.transitions.push([j, j + 1]);
          }
        }
      }

      return Promise.resolve();
    },

    async colorArrays() {
      for (let i = 0; i < this.transitions.length; i++) {
        
        setTimeout(() => {
          let bar = document.getElementsByClassName("bar");
          let [first, second] = this.transitions[i];
          let firstBar = bar[first];
          let secondBar = bar[second];

          firstBar.style.height = this.tempArray[first] * this.barHeight + "px";
          secondBar.style.height =
            this.tempArray[second] * this.barHeight + "px";

          firstBar.className = "bar bar-sorted";
          secondBar.className = "bar bar-sorted";

          firstBar.innerHTML = this.tempArray[first];
          secondBar.innerHTML = this.tempArray[second];

        }, 100 * i);
      }
    },

    async clearBars(type) {
      let className;
      if (type == "SORT") {
        className = "bar bar-sorted";
      } else {
        className = "bar bar-unsorted";
      }

      let bars = document.getElementsByClassName("bar");
      for (let i = 0; i < bars.length; i++) {
        bars[i].className = className;
      }
    },

    random(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    createList() {
      this.items = new Array(this.size)
        .fill(null)
        .map(() => this.random(100, 500));
    },

    async sort() {
      this.loading = true;

      switch (this.sort_name) {
        case "BubbleSort":
          await this.do_sort_bubble();
          this.colorArrays();
          break;

        default:
          break;
      }

      this.loading = false;
    },

    reset() {
      this.clearBars();
      this.items = [];
      this.tempArray = [];
      this.transitions = [];
      this.createList("UNSORT");
    },
  },

  created() {
    this.createList();
  },

  watch: {
    size: function () {
      this.reset();
    },
  },
};
</script>

<style scoped>
.bar {
  width: 30px;
  border-left: 1px solid black;
  border-bottom: 1px solid black;
  border-top: 1px solid black;
  display: inline-block;
  box-shadow: -1px 0px 43px -9px rgba(0, 0, 0, 0.75);
}

.bar-unsorted {
  background: rgb(131, 58, 180);
  background: linear-gradient(
    195deg,
    rgba(131, 58, 180, 1) 0%,
    rgba(253, 29, 29, 1) 50%,
    rgba(252, 176, 69, 1) 100%
  );
}

.bar-sorted {
  background: rgb(149, 180, 58);
  background: linear-gradient(
    195deg,
    rgba(149, 180, 58, 1) 0%,
    rgba(45, 253, 29, 1) 13%,
    rgba(252, 176, 69, 1) 100%
  );
}
</style>
