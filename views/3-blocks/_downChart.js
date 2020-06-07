const ctx = document.getElementById('downChart').getContext('2d')
const timeReportsSequence = datalayer.serviceView.downChart.timeReportsSequence

let getRoundedDate = (minutes, d=new Date()) => {
  let ms = 1000 * 60 * minutes; 
  let roundedDate = new Date(Math.round(d.getTime() / ms) * ms);
  return roundedDate
}

let maxTimeValue
if(timeReportsSequence.length === 0) {
  maxTimeValue = Math.max.apply(Math, timeReportsSequence.map(function(object) { return Date.parse(object.time); }))
 } else {
  maxTimeValue = getRoundedDate(1)
  }
  console.log(getRoundedDate(1))
  console.log(maxTimeValue)


// deze waardes zouden eigenlijk in een config file moeten zitten
const sequenceLength = 72;
const lastNumHours = 12;
const timeBlockLengthInMinutes = 10;
const msPerMinute = 60000;

// add missing dates to sequence
for (let i = 0; i < sequenceLength; i++) {
  let sequenceDate = new Date(maxTimeValue - (i * msPerMinute * timeBlockLengthInMinutes)).toISOString();
  let conditinal = timeReportsSequence.some(e => e.time === sequenceDate)
  if(!conditinal){
    timeReportsSequence.push({count:0,time:sequenceDate})
  }  
}

// add 10 minutes to all times in sequence
timeReportsSequence.forEach(date => {
  date.time = new Date(Date.parse(date.time) + (timeBlockLengthInMinutes * msPerMinute))
})

// sort sequence
timeReportsSequence.sort(function compare(b, a) {
  var dateA = new Date(a.time);
  var dateB = new Date(b.time);
  return dateA - dateB;
});


// quence to localtime en split to arrays
const localesOptions = {
  hour: '2-digit', 
  minute: '2-digit',
};  

const locales = {
    languageCode: datalayer.language.code,
    countryCode: datalayer.country.code,
}

let timeLabels = [];
let sequenceOfReports = [];
timeReportsSequence.forEach(date => {
  let count = date.count;
  sequenceOfReports.push(count)
  let time = new Date(date.time).toLocaleTimeString(`${locales.languageCode}-${locales.countryCode}`, localesOptions)
  timeLabels.push(time)
})


const data = {
  labels: timeLabels,
  datasets: [{
    data: sequenceOfReports,
    backgroundColor: null,
    borderColor: null,
    pointRadius: 0,
    borderWidth: 3
  }]
}

const tooltipLabel = datalayer.serviceView.downChart.tooltipLabel

const options = {

  defaultFontFamily: Chart.defaults.global.defaultFontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Helvetica Neue", Arial, sans-serif',

  responsive: true,
  aspectRatio: null,

  tooltips: {
    mode: 'nearest',
    intersect: false,
    callbacks: {
          label: function(tooltipItems, data) { 
              return tooltipItems.yLabel + ' ' + tooltipLabel;
          }
      }
  },

  legend: {
    display: false
  },

  scales: {
    xAxes: [{
      display: true,
      gridLines: {
        display: false
      },
      ticks: {
        reverse:true,
        lineHeight: 2.5,
      },
    }],
    yAxes: [{
      display: true,
      gridLines: {
        display: false
      },
      ticks: {
        suggestedMin: 0,
        suggestedMax: 50 //avgOfnumberOfReports*4
      }
    }]
  }
}

const chart = new Chart(ctx, {
  type: 'line',
  data: data,
  options: options,
  plugins: [{
    id: 'defineDownChartValues',

    afterLayout: function (chart) {
      
      const currentStatus = datalayer.service.status;
      
      (function setAspectRatio () {
        const windowWidthInEm = window.innerWidth / parseFloat(getComputedStyle(document.querySelector('body'))['font-size'])
        const aspectRatioNum = 0.725 + (windowWidthInEm * (1 / 55))

        chart.aspectRatio = Math.min(2.25, Math.max(1, aspectRatioNum.toFixed(2)))
      })()

      function getBorderColor (status) {
        if (status < 0.5) {
          return 'rgba(0, 181, 63, 1)'
        } else if (status >= 0.5 && status <= 0.7) {
          return 'rgba(255, 102, 0, 1)'
        } else if (status >= 0.7) {
          return 'rgba(242,68,68, 1)'
        }
      }

      function setborderColor (chart, status) {
        chart.data.datasets[0].borderColor = getBorderColor(status)
      }

      setborderColor(chart, currentStatus)

      function getGradientColor (status) {
        if (status < 0.5) {
          return ['rgba(0, 181, 63, 0.01)', 'rgba(0, 181, 63, 0.6)']
        } else if (status >= 0.5 && status <= 0.7) {
          return ['rgba(255, 102, 0, 0.01)', 'rgba(255, 102, 0, 0.6)']
        } else if (status >= 0.7) {
          return ['rgba(242,68,68, 0.01)', 'rgba(242,68,68, 0.6)']
        }
      }

      function setGradient (chart, status) {
        const scales = chart.scales
        const color = chart.ctx.createLinearGradient(0, scales['x-axis-0'].top, 0, 0)
        const chartColors = getGradientColor(status)

        color.addColorStop(0, chartColors[0])
        color.addColorStop(1, chartColors[1])

        chart.data.datasets[0].backgroundColor = color
      }

      setGradient(chart, currentStatus)
    }
  }]
})
