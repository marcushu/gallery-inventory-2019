<template>
  <div>
    <div class="row pt-4">
      <div class="col-md-6">
        <div class="row pt-4">
          <div class="col d-flex justify-content-center">
            <div class="card" style="max-width: 40rem;">
              <div class="card-header">
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio1"
                    value="2d"
                    v-model="medium"
                  />
                  <label class="form-check-label" for="inlineRadio1">canvas/paper</label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio2"
                    value="scupture"
                    v-model="medium"
                  />
                  <label class="form-check-label" for="inlineRadio2">sculpture</label>
                </div>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    <div class="input-group mb-3">
                      <input
                        type="text"
                        class="form-control"
                        aria-label="Recipient's username"
                        aria-describedby="button-addon2"
                        v-model="newArtist"
                      />
                      <div class="input-group-append">
                        <button
                          class="btn btn-outline-secondary"
                          type="button"
                          id="button-addon2"
                          @click="addNewArtist"
                        >New Artist</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-md-4">
                    <label for="productIdInput">Product Id#</label>
                    <input
                      type="text"
                      class="form-control"
                      id="productIdInput"
                      v-model="form.prodId"
                    />
                  </div>
                  <div class="form-group col-md-8">
                    <label for="descriptionInput">Title</label>
                    <input
                      type="text"
                      class="form-control"
                      id="descriptionInput"
                      v-model="form.title"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-md-6">
                    <label for="priceInput">Price</label>
                    <input type="text" class="form-control" id="priceInput" v-model="form.price" />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="artistInput">Artist</label>
                    <b-form-select
                      id="artistInput"
                      v-model="form.artist"
                      :options="artistOptions"
                      @change="artistSelected($event)"
                    ></b-form-select>
                  </div>
                </div>
                <!-- sculpture dimension -->
                <div class="row" v-if="isSculpture">
                  <div class="form-group col-md">
                    <label for="sculptWtInput">Weight</label>
                    <input
                      type="text"
                      class="form-control"
                      id="sculptWtInput"
                      v-model="form.sculptWeight"
                    />
                  </div>
                  <div class="form-group col-md">
                    <label for="sculptHeightInput">Height</label>
                    <input
                      type="text"
                      class="form-control"
                      id="sculptHeightInput"
                      v-model="form.sculptHeight"
                    />
                  </div>
                </div>
                <!-- end -->
                <div class="row border-bottom pb-3">
                  <div class="col">
                    <div class>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value
                          id="consignCheck"
                          v-model="form.consign"
                        />
                        <label class="form-check-label" for="consignCheck">Consign</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row pt-4">
                  <div class="col text-right">
                    <button type="button" class="btn btn-outline-dark" @click="addNewEntry">Submit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 pt-4 text-center">
        <!-- Output x most recent entries -->
        <p class="font-weight-lighter font-italic">Only most recent 10 entries displayed.</p>
        <ul style="list-style-type:none;">
          <div v-for="work in recentEntries" :key="work.id">
            <li>
              <div class="d-flex justify-content-between">
                <p>
                  <span v-if="work.consign">
                    <span class="badge badge-info">C</span>
                  </span>
                  {{work.prodId}} ---{{work.title}}--- {{work.price}}
                </p>
                <p>
                  <button
                    type="button"
                    class="close"
                    aria-label="Close"
                    @click="deleteEntry(work.id)"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </p>
              </div>
            </li>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");

const host = "---";

export default {
  name: "Dataentry",

  computed: {
    isSculpture: function() {
      return this.medium == "scupture";
    }
  },

  data: function() {
    return {
      //for the 'select' form input
      artistOptions: [],

      form: {
        prodId: "",
        artist: "",
        title: "",
        price: "",
        consign: 0,
        sculptHeight: 0,
        sculptWeight: 0
      },
      //input field for adding a new artist
      newArtist: "",

      medium: "2d", // default to '2d'

      currentArtistId: "",

      recentEntries: [] //for display
    };
  },

  methods: {
    artistSelected: function(artistsLastName) {
      // Add a prefix for this artists product id to the text field.
      this.form.prodId = this.form.artist.substring(0, 3).toLowerCase();
      // get/save the id for the selected artist
      this.currentArtistId = this.artistOptions.find(
        ({ value }) => value == artistsLastName
      ).id;
    },

    /*
     *  Add a new inventory item to db
     */
    addNewEntry: async function() {
      let _artworkEntry = {
        prodId: this.form.prodId,
        prodTitle: this.form.title,
        prodPrice: this.form.price,
        consign: this.form.consign,
        sculptHeight: this.form.sculptHeigh,
        width: this.form.sculptWeight,
        artistId: this.currentArtistId
      };

      try {
        await axios.post(host + "/newEntry", _artworkEntry);

        // clear form
        this.form.prodId = this.form.artist.substring(0, 3).toLowerCase();
        this.form.title = "";
        this.form.price = "";
        this.form.consign = 0;
        this.form.sculptHeight = 0;
        this.form.sculptWeight = 0;

        this.recentEntries.length = 0;
        this.loadRecentEntries();
      } catch (err) {
        console.error(err);
        alert("Problem adding new entry: ");
      }
    },

    /*
     *  Delete an entry.
     */
    deleteEntry: async function(toDelete) {
      try {
        await axios.post(host + "/deleteEntry", {
          idToDelete: toDelete
        });

        this.recentEntries.length = 0; // MOVE THIS
        this.loadRecentEntries();
        this.$forceUpdate();
      } catch (err) {
        console.error(err);
        alert("Problem deleting entry");
      }
    },

    /*
     *  Post a new artist to db.
     */
    addNewArtist: async function() {
      let _newArtist = {
        firstName: this.newArtist.split(" ")[0],
        lastName: this.newArtist.split(" ")[1]
      };

      try {
        await axios.post(host + "/newArtist", _newArtist);

        this.newArtist = "";
        // reload the array
        this.artistOptions.length = 0;
        this.loadArtistsSelector();
      } catch (err) {
        alert('Problem posting');
        console.error(err);
      }
    },

    /*
     *  Load the artist selection array
     */
    loadArtistsSelector: async function() {
      try {
        let allArtist = await axios.get(host + "/artists");

        allArtist.data.forEach(_artist => {
          this.artistOptions.push({
            value: _artist.lastName,
            text: _artist.firstName + " " + _artist.lastName,
            id: _artist.id
          });
        });
      } catch (err) {
        console.error(err);
      }
    },

    /*
     *  Retrieve the most recent x# of entries (mainly for editing purposes).
     */
    loadRecentEntries: async function() {
      try {
        let allEntries = await axios.get(host + "/artwork");

        allEntries.data.forEach(_artWork => {
          this.recentEntries.push({
            id: _artWork.id,
            createdAt: _artWork.created_at,
            prodId: _artWork.prodId,
            title: _artWork.title,
            price: `$${_artWork.price}.00`,
            consign: _artWork.consign
          });
        });
      } catch (err) {
        console.error(err);
      }
    }
  },

  mounted: function() {
    this.loadArtistsSelector();
    this.loadRecentEntries();
  }
};
</script>