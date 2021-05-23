<template>
  <div>
    <div class="row" style="padding-top: 3%">
      <div class="offset-lg-1"></div>
      <div class="col-lg-3">
        <v-container fluid>
          <v-row>
            <v-col cols="12">

              <v-row>
                <v-col>
                  <v-btn depressed dark block @click="reset">
                    Reset
                  </v-btn>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-switch
                    v-model="toggleAddNodeWhere"
                    flat
                    :label="`Add Node to ${addNodeWhere}`"
                  ></v-switch>
                  <v-slider
                    max="99"
                    min="10"
                    label="New Node: "
                    v-model="insertValue"
                    thumb-label="always"
                  ></v-slider>

                  <v-btn
                    @click="insert"
                    depressed
                    color="error"
                    :disabled="loading"
                  >
                    Insert
                  </v-btn>
                  &nbsp;
                  <v-btn
                    @click="randomList"
                    depressed
                    color="error"
                    :disabled="loading"
                  >
                    Insert Random
                  </v-btn>
                </v-col>
              </v-row>

              <v-row class="pt-10">
                <v-col cols="12">
                  <v-slider
                    max="99"
                    min="10"
                    label="Search: "
                    v-model="searchValue"
                    thumb-label="always"
                  ></v-slider>

                  <v-btn color="error" depressed @click="search">Search</v-btn>
                </v-col>
              </v-row>

              <v-row class="pt-10">
                <v-col cols="12">
                  <v-btn color="error" depressed @click="reverse"
                    >Reverse</v-btn
                  >
                </v-col>
              </v-row>
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
          <div class="my-8" style="left: 10rem; position: absolute; top: 40%">
            <v-avatar
              color="red"
              v-for="(item, index) of items"
              :key="index"
              :class="item.current ? 'list-node-search ml-2' : 'list-node ml-2'"
            >
              <span class="white--text headline" @click.prevent="deleteNode">
                {{ item.value }}
              </span>
            </v-avatar>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { LinkedList } from "./linked_list";

export default {
  data() {
    return {
      linkedList: null,
      loading: false,

      items: [],
      state: [],
      transitions: [],

      insertValue: 50,
      toggleAddNodeWhere: true,
      addNodeWhere: "Front",

      currentIndex: 0,
      progress: 0,
      currentSize: 0,
      maxSize: 17,

      searchValue: 50,
    };
  },

  created() {
    this.linkedList = new LinkedList();
  },

  methods: {
    random() {
      return Math.floor(Math.random() * (99 - 10)) + 10;
    },

    async insert() {
      if (this.currentSize <= this.maxSize) {
        let result;
        switch (this.addNodeWhere) {
          case "Front":
            result = await this.linkedList.addFront(this.insertValue);
            this.items = result.value;
            this.currentSize = result.size;
            break;
          case "Back":
            result = await this.linkedList.addLast(this.insertValue);
            this.items = result.value;
            this.currentSize = result.size;
            break;
        }
      }
    },

    async search() {
      this.transitions = await this.linkedList.searchNode(this.searchValue);
      for (let i = 0; i < this.transitions.length; i++) {
        setTimeout(() => {
          this.items = this.transitions[i];
        }, i * 400);
      }
    },

    async reverse() {
      let reverse = await this.linkedList.reverse();
      this.items = reverse.value;
    },

    async reset() {
      let freeNodes = await this.linkedList.freeList();
      this.items = freeNodes.value;
    },

    async randomList() {
      if (this.currentSize <= this.maxSize) {
        let result;
        switch (this.addNodeWhere) {
          case "Front":
            result = await this.linkedList.addFront(this.random());
            this.items = result.value;
            this.currentSize = result.size;
            break;
          case "Back":
            result = await this.linkedList.addLast(this.random());
            this.items = result.value;
            this.currentSize = result.size;
            break;
        }
      }
    },

    deleteNode(e) {
      let result = this.linkedList.deleteNode(e.target.innerText);
      console.log(result);
      this.items = result.value;
      this.currentSize = result.size;
    },
  },

  watch: {
    currentIndex: function (value) {
      this.progress = parseInt(100 * (value / (this.maxSize - 1)));
    },

    toggleAddNodeWhere: function (value) {
      this.addNodeWhere = value ? "Front" : "Back";
    },
  },
};
</script>

<style scoped>
.list-node-head {
  cursor: pointer;
  background-color: #b71c1c !important;
}

.list-node-head:hover {
  background-color: #607d8b !important;
  transition: 500ms;
}

.list-node-search {
  background-color: #b2ff59 !important;
}

.list-node {
  cursor: pointer;
}

.list-node:hover {
  background-color: #607d8b !important;
  transition: 500ms;
}
</style>
