<template>
  <div>
    <div class="row pb-2">
      <div class="col d-flex justify-content-between">
        <b-form-select v-model="selected" :options="artistOptions" @change="selectArtist($event)"></b-form-select>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        Number of pieces:
        <b>{{numberOfPieces}}</b>
      </div>
      <div class="col-6">
        Total value:
        <b>${{totoalValue}}</b>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        Average Price:
        <b>${{averagePrice}}</b>
      </div>
      <div class="col-6">
        High:
        <b>${{highestPrice}}</b> Low:
        <b>${{lowestPrice}}</b>
      </div>
    </div>
    <div class="row">
      <div class="col font-weight-lighter">&#963; = {{standardDeviation}}</div>
    </div>
    <!-- chart -->
    <div class="row">
      <div class="col">
        <chart-artist-hist v-if="dataLoaded" :cData="barChartData"></chart-artist-hist>
      </div>
    </div>
  </div>
</template>

<script>
import ChartArtistHist from "./ChartArtistHist.js";

let host = "---";

const axios = require("axios");

export default {
  name: "ArtistHist",

  components: {
    ChartArtistHist
  },

  data: function() {
    return {
      dataLoaded: false,

      selected: null, // select artist form input
      artistOptions: [],

      // Stats for individual artist
      numberOfPieces: 0,
      averagePrice: 0,
      totoalValue: 0,
      highestPrice: 0,
      lowestPrice: 0,
      standardDeviation: 0,

      // Data and config for the chart componenet.
      barChartData: {
        labels: [],
        datasets: [
          {
            label: "$",
            backgroundColor: "#660033",
            data: []
          }
        ]
      }
    };
  },

  methods: {
    selectArtist: function(_lName) {
      let _id = this.artistOptions.find(({ value }) => value == _lName).id;

      this.createArtistsChart(_id);
    },
    /*
     *  Retrieve price data and load chart
     */
    createArtistsChart: async function(_id) {
      let _data = this.barChartData.datasets[0].data;
      this.dataLoaded = false;

      try {
        _data.length = 0;
        this.barChartData.labels.length = 0;

        let _priceArray = await axios.post(host + "/prices", {
          artistId: _id
        });

        _priceArray.data.forEach(_price => {
          _data.push(_price.price);
          this.barChartData.labels.push(""); //empty
        });
        
        this.barChartData.datasets[0].data = this.standardCurve(_data);
        //stats
        this.numberOfPieces = _data.length;
        this.highestPrice = Math.max(..._data);
        this.lowestPrice = Math.min(..._data);
        this.totoalValue = _data.reduce((acc, curr) => acc + curr);
        this.averagePrice = (this.totoalValue / this.numberOfPieces).toFixed(2);
        this.standardDeviation = this.stdDev(_data);

        this.dataLoaded = true;
      } catch (err) {
        console.error(err);
      }
    },

    /*
     *  Arrange array values into a standard curve
     */
    standardCurve: function(_array) {
      _array.sort((a, b) => a - b);

      let left = [];
      let right = [];
      for (var i = 0; i < _array.length; i += 2) {
        left.unshift(_array[i]);
        right.push(_array[i + 1]);
      }

      return [...right, ...left].filter(x => typeof x === "number"); // typeof handles odd sized arrays
    },

    /*
     * Calculate standard deviation
     */
    stdDev: function(_array) {
      let _average = _array.reduce((acc, cur) => acc + cur) / _array.length;

      return Math.sqrt(
        _array
          .map(x => Math.pow(x - _average, 2))
          .reduce((acc, cur) => acc + cur) / _array.length
      ).toFixed(2);
    },

    /*
     *  Load the artist selection array
     */
    loadArtistsSelector: async function() {
      try {
        let _allArtists = await axios.get(host + "/artists");

        _allArtists.data.forEach(_artist => {
          this.artistOptions.push({
            value: _artist.lastName,
            text: _artist.firstName + " " + _artist.lastName,
            id: _artist.id
          });
        });

        this.artistOptions.unshift({
          value: null,
          text: "Please select an artist"
        });
      } catch (err) {
        console.error(err);
      }
    }
  },

  mounted: function() {
    this.loadArtistsSelector();
  }
};
</script>