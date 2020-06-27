<template>
  <div>
    <div class="row pt-4 d-flex justify-content-center">
      <div class="col-md-6">
        <div class="row">
          <div class="col">
            <h5>Inventory Report - Artist</h5>
            <p>
              <b-form-select v-model="selected" :options="artistOptions"></b-form-select>
            </p>
            <p class="font-weight-lighter">output: Product Id - Title - Price - Consign</p>
            <button
              type="button"
              class="btn btn-secondary btn-lg btn-block"
              @click="printPdf"
            >Artist Report</button>
          </div>
        </div><br/><hr>
        <h5>Inventory Report - Gallery</h5>
        <p>
          <b-form-radio-group label="Sort by:">
            <b-form-radio v-model="sortType" value="price">Sort by Price</b-form-radio>
            <b-form-radio v-model="sortType" value="artists.lastName">Sort By Artist's Name</b-form-radio>
          </b-form-radio-group>
        </p>
        <p class="font-weight-lighter">output: Artist - Product Id - Title - Price</p>
        <button
          type="button"
          class="btn btn-secondary btn-lg btn-block"
          @click="galleryPdf"
        >Gallery Report</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const host = "---";

export default {
  name: "Output",

  data: function() {
    return {
      selected: null, // select artist form input
      artistOptions: [],
      sortType: "price"
    };
  },

  methods: {
    /*
     *  Create/display Artist summary pdf
     */
    printPdf: async function() {
      let _id = this.artistOptions.find(({ value }) => value == this.selected)
        .id;

      try {
        await axios.post(host + "/artistpdf", {
          artistId: _id
        });

        window.open(host + "/");
      } catch (err) {
        alert(err);
        console.error(err);
      }
    },

    /*
     * Create/display gallery summary pdf
     */
    galleryPdf: async function() {
      try {
        await axios.post(host + "/allWork", {
          orderBy: this.sortType
        });

        window.open(host + "/");
      } catch (err) {
        alert(err);
        console.error(err);
      }
    }
  },

  mounted: async function() {
    /*
     *  Set up artist's selctor box
     */ 
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
};
</script>