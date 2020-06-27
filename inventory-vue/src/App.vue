<template>
  <div id="app" class="container">
    <div class="row-6 pt-4 pb-3">
      <div class="col">
        <h3 id="title">Inventory - 3/13/2019</h3>
      </div>
    </div>
    <div class="row border-top border-bottom pt-2" id="linksBar">
      <div class="col p-1 d-flex justify-content-around">
        <router-link to="/" v-bind:class="{current : currentPage == 'home'}">
          <h5 @click="setCurrentPage('home')">Enter Product</h5>
        </router-link>
        <router-link to="/Analysis" v-bind:class="{current : currentPage == 'analysis'}">
          <h5 @click="setCurrentPage('analysis')">Anaylyze</h5>
        </router-link>
        <router-link to="/Output" v-bind:class="{current : currentPage == 'output'}">
          <h5 @click="setCurrentPage('output')">Print</h5>
        </router-link>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",

  data: function() {
    return {
      currentPage: "home"
    };
  },

  methods: {
    setCurrentPage: function(_currentPage) {
      this.currentPage = _currentPage;
    }
  }
};
</script>

<style scoped>
a:link {
  color: rgb(46, 41, 41);
}

a:visited {
  color: rgb(143, 143, 143);
}

a:hover {
  color: rgb(102, 100, 101);
  text-decoration: none;
}

a:active {
  color: rgb(46, 44, 46);
}

a.current {
  text-decoration: underline;
  color: rgb(46, 44, 46);
}

#linksBar {
  background-color: rgb(245, 245, 245);
}
</style>
