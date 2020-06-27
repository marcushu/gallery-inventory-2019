<template>
  <div>
    <div class="row pt-3">
      <div class="col border-bottom">
        <b-form-group>
          <b-form-radio-group v-model="singleArtistSelected" :options="displayOptions"></b-form-radio-group>
        </b-form-group>
      </div>
    </div>
    <div class="row pt-4 d-flex justify-content-center">
      <div class="col-8" v-if="singleArtistSelected">
        <artist-hist></artist-hist>
      </div>
      <div class="col-10" v-if="!singleArtistSelected">
        <gallery-totals></gallery-totals>
      </div>
    </div>
  </div>
</template>

<script>
import ArtistHist from "../components/ArtistHist.vue"
import GalleryTotals from '../components/GalleryTotals.vue'

export default {
  name: "Analysis",

  components: {
    ArtistHist,
    GalleryTotals
  },

  data: function() {
    return {
      // Select individual-artist/gallery-total radio button js
      singleArtistSelected: false,
      
      displayOptions: [
        { text: "Gallery Total", value: false },
        { text: "Individual artist", value: true }
      ]       
    };
  }
  
};
</script>