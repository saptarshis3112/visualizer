<template>
  <div>
    <div class="row" style="padding-top: 2%">
      <div class="offset-lg-1"></div>
      <div class="col-lg-3">
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-slider
                max="100"
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
              <v-btn @click="reset" depressed> Reset </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div class="col-lg-8 text-center">
        <v-progress-linear
          v-model="progress"
          color="red"
          height="10"
        ></v-progress-linear>
        <v-card outlined elevation="10" style="height: 800px">
          <div class="my-8">
            <span v-for="(item, key) of items" :key="key">
              <div
                :class="item.barClass"
                :style="{
                  height: `${barHeight * item.num}px`,
                  width: `${barWidth}px`,
                }"
              ></div>
            </span>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  
  data() {
    return {
      size: 50,
      barWidth: 20,
      currentTempIndex: 0,
      barHeight: 1.5,
      progress: 0,

      algorithm_type: ["MergeSort", "QuickSort", "HeapSort", "BubbleSort"],
      sort_name: "BubbleSort",
      
      items: [],
      transitions: [],
      ranges: [],

      loading: false,
    };
  },

  methods: {
    async do_sort_bubble(list) {
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list.length - 1; j++) {
          if (list[j] > list[j + 1]) {
            let temp = list[j + 1];
            list[j + 1] = list[j];
            list[j] = temp;
            this.ranges.push([j, j + 1]);
            this.transitions.push([...list]);
          }
        }
      }

      this.ranges.push([-1, -1]);
      this.transitions.push([...list]);
    },

    partition(items, start, end) {
      let i = start - 1,
        pivot = items[end];

      for (let j = start; j < end; j++) {
        if (items[j] <= pivot) {
          i++;
          // swap i & j
          let temp = items[i];
          items[i] = items[j];
          items[j] = temp;
        }
      }

      // swap end with i+1
      let temp = items[i + 1];
      items[i + 1] = items[end];
      items[end] = temp;

      this.ranges.push([start, end]);
      this.transitions.push([...items]);

      return i + 1;
    },

    async do_sort_quick(list, start, end) {
      if (start < end) {
        let pi = await this.partition(list, start, end);
        await this.do_sort_quick(list, start, pi - 1);
        await this.do_sort_quick(list, pi + 1, end);
      }
    },

    clearBars(type) {
      let className = type == "SORT" ? "bar bar-sorted" : "bar bar-unsorted";

      this.items = this.items.map((item) => {
        return {
          ...item,
          barClass: className,
        };
      });
    },

    random(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    createList() {
      this.items = new Array(this.size).fill(null).map(() => {
        return {
          num: this.random(100, 500),
          barClass: "bar bar-unsorted",
        };
      });
    },

    async sort() {
      this.progress = 0;
      this.loading = true;

      let list = this.items.map((item) => item.num);

      switch (this.sort_name) {
        case "BubbleSort":
          await this.do_sort_bubble(list);
          break;

        case "QuickSort":
          await this.do_sort_quick(list, 0, list.length - 1);
          break;

        default:
          break;
      }

      for (let i = 0; i < this.transitions.length; i++) {
        setTimeout(() => {
          this.currentTempIndex = i;

          let start = this.ranges[i][0],
            end = this.ranges[i][1];
          this.items = [...this.transitions[i]].map((item, index) => {
            if (index >= start && index < end) {
              return { num: item, barClass: "bar bar-sorting" };
            } else {
              return { num: item, barClass: "bar bar-unsorted" };
            }
          });

          if (i == this.transitions.length - 1) {
            this.loading = false;
            this.clearBars("SORT");
          }
        }, i * 500);
      }
    },

    reset() {
      this.loading = false;
      this.ranges = [];
      this.transitions = [];
      this.items = [];
      this.clearBars("UNSORT");
      this.createList();
      this.progress = 0;
    },
  },

  created() {
    this.createList();
  },

  watch: {

    size: function (val) {
      switch (true) {
        case val <= 100 && val >= 70:
          this.barWidth = 10;
          break;

        case val < 70 && val >= 50:
          this.barWidth = 15;
          break;

        case val < 50 && val >= 30:
          this.barWidth = 20;
          break;

        case val < 30 && val >= 20:
          this.barWidth = 25;
          break;

        case val < 20 && val >= 10:
          this.barWidth = 30;
          break;

        default:
          this.barWidth = 10;
          break;
      }

      this.reset();
    },

    currentTempIndex: function () {
      this.progress = parseInt(
        100 * (this.currentTempIndex / (this.transitions.length - 1))
      );
    },
  },
};
</script>

<style scoped>
.bar {
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

.bar-sorting {
  background: rgb(58, 118, 180);
  background: linear-gradient(
    195deg,
    rgba(58, 118, 180, 1) 0%,
    rgba(29, 56, 253, 1) 14%,
    rgba(255, 0, 155, 1) 100%
  );
}
</style>
