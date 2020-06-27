import { Pie } from 'vue-chartjs';

export default {
  extends: Pie,

  props: {
    pieData: {}
  },

  data: function () {
    return {
      pieOptions: {
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 0,

        legend: {
          position: 'left'
        }
      }
    }
  },

  mounted: function () {
    this.renderChart(this.pieData, this.pieOptions);
  }

}