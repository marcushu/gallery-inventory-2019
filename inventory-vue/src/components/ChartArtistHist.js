import { Bar } from 'vue-chartjs';

export default {
  extends: Bar,

  props: {
    cData: {},
  },

  mounted: function () {
    this.renderChart(this.cData, {
      responsive: true,
      maintainAspectRatio: false
    });
  }

}