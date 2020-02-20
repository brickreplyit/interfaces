<template>
  <div>
    <md-card
      class="md-primary"
      md-theme="green-card"
      v-for="(item, index) in work_list"
      :key="index"
    >
      <md-card-header>
        <div class="md-title">{{ item.workId }}</div>
      </md-card-header>

      <md-card-content>
        <p>{{item.pieces.type}} - {{item.pieces.length}}</p>
      </md-card-content>

      <md-card-actions>
        <md-button class="md-raised md-accent" v-on:click="produce(item)">PRODUCE</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<style>
.md-card {
  width: 32%;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
}
.md-app {
  max-height: 400px;
  border: 1px solid rgba(#000, 0.12);
}

.md-app-toolbar {
  height: 196px;
}
.md-drawer {
  width: 230px;
}
</style>

<script>
import { setInterval } from "timers";
export default {
  name: "Flexible",
  data() {
    return {
      error: {},
      work_list: [],
      timer: "",
      first: true,
      menuVisible: false
    };
  },
  created: function() {
    this.timer = setInterval(() => {
      if (!this.first) {
        this.$http.get("http://localhost:3030/work/ASS").then(
          result => {
            this.work_list = result.body;
          },
          error => {
            this.error = error;
          }
        );
      }
      this.first = false;
    }, 100);
  },
  mounted() {
    this.$http.get("http://localhost:3030/work/ASS").then(
      result => {
        this.work_list = result.body;
      },
      error => {
        this.error = error;
      }
    );
  },
  methods: {
    produce: function(item) {
      this.$http.post("http://localhost:3030/work", item, {
        headers: { "content-type": "application/json" }
      });
      //location.reload();
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>


<style>
</style>
