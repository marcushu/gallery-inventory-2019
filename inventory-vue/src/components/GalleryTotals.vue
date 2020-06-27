<template>
  <div>
    <div class="row">
      <div class="col-md-4">
        <p>
          Total Value:
          <b>${{totalValue}}.00</b>
        </p>
        <p>
          Highest:
          <b>${{highest}}.00</b>
        </p>
        <p>
          Lowest:
          <b>${{lowest}}.00</b>
        </p>
        <p>
          Average:
          <b>${{average}}.00</b>
        </p>
        <p>
          Total Artworks in Gallery:
          <b>{{numberOfItems}}</b>
        </p>
      </div>
      <div class="col-md-8">
        <div class="row">
          <div class="col">
            <b-form-group>
              <b-form-radio-group
                v-model="graphDollarsPerArtist"
                :options="displayOptions"
                @change="changePie"
              ></b-form-radio-group>
            </b-form-group>
          </div>
        </div>
        <chart-total-pie v-if="dataForPieLoaded" :pieData="pieData"></chart-total-pie>
      </div>
    </div>
  </div>
</template>

<script>
import ChartTotalPie from "./ChartTotalPie.js";

const axios = require("axios");

let host = "---";

export default {
  name: "GelleryTotals",

  components: {
    ChartTotalPie
  },

  data: function() {
    return {
      dataForPieLoaded: false,

      // stats
      totalValue: 0,
      numberOfItems: 0,
      highest: 0,
      lowest: 0,
      average: 0,

      // Radio button js
      graphDollarsPerArtist: true,
      displayOptions: [
        { text: "Total $/Artist", value: true },
        { text: "Total #works/Artist", value: false }
      ],

      // To be passed int the pie chart component.
      pieData: {
        labels: [], 
        datasets: [
          {
            backgroundColor: [],
            data: [] 
          }
        ]
      }
    };
  },

  methods: {
    /*
     *  Responds to radio button onchange
     */
    changePie: function() {
      if (this.graphDollarsPerArtist == true) {
        this.createTotalsChart(host + "/allTotals");
      } else {
        this.createTotalsChart(host + "/totalNumPerArtist");
      }
    },

    /*
     *  Retrieve gallery total$/artist 0R total#/artist data (depending
     *  on the url paraeter) and load Pie chart
     */
    createTotalsChart: async function(_url) {
      this.dataForPieLoaded = false;

      let _data = this.pieData.datasets[0].data;
      let randRGBval = () => Math.floor(Math.random() * 255);

      // clear data arrays
      _data.length = 0;
      this.pieData.labels.length = 0;

      try {
        let _totals = await axios.get(_url);

        _totals.data.forEach(x => {
          _data.push(x.total);
          this.pieData.labels.push(x.artistId);
          let _color = `RGB(${randRGBval()}, ${randRGBval()}, ${randRGBval()})`;
          this.pieData.datasets[0].backgroundColor.push(_color);
        });

        this.dataForPieLoaded = true;
        return true; // promise
      } catch (err) {
        console.error(err);
      }
    },

    /*
     *  Return the total number of artworks
     */
    numberOfArtworks: async function() {
      try {
        let _artByArtist = await axios.get(host + "/totalNumPerArtist");
        
        // total up the artwork
        return _artByArtist.data
          .map(({ total }) => total)
          .reduce((acc, cur) => acc + cur);
      } catch (err) {
        console.error(err);
      }
    },

    /*
     *  Calculate some statistical data on total $
     */
    calculateStats: function() {
      let _data = this.pieData.datasets[0].data;

      this.totalValue = _data.reduce((acc, cur) => acc + cur);
      this.numberOfArtworks().then(val => {
        this.numberOfItems = val;
        this.average = (this.totalValue / this.numberOfItems).toFixed(2);
      });
      this.highest = Math.max(..._data);
      this.lowest = Math.min(..._data);
    }
  },

  mounted: function() {
    this.createTotalsChart(host + "/allTotals").then(() =>
      this.calculateStats()
    );
  }
};
</script>