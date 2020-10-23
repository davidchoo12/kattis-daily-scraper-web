var A; // for viewing data in devtools
var chart;
function runChart(dataUrl, chartTitle) {
Chart.defaults.global.defaultColor = '#f8f8f8';
Chart.defaults.global.defaultFontColor = '#f8f8f8';
const nusCanvas = document.querySelector('#chart').getContext('2d');
fetch('https://cors-anywhere.herokuapp.com/' + dataUrl)
.then(res => res.text())
.then(csv => {
  let data = {};
  let lines = csv.split('\r\n');
  let headers = lines[0].split(',');
  lines.shift();
  let rands = [];
  let datasets = [];
  for (const [i, header] of headers.entries()) {
    console.log(i, header);
    data[header] = lines.map(l => l.split(',')[i]);
    let rand;
    if (header != 'time') {
      do {
        rand = Math.random();
        console.log(i, rand);
      } while (!rands.every(e => Math.abs(e - rand) > (0.5 / (headers.length - 1))) && rands.length > 0);
      // change this value for distinctness of colours ^ vs time (min = 0, max = 1, infinite loop)
      rands.push(rand);
      datasets.push({
        label: header,
        backgroundColor: `hsl(${360 * rand}, 100%, 95%)`,
        borderColor: `hsl(${360 * rand}, 100%, 70%)`,
        data: data[header].map((e, i) => ({x: moment(data.time[i]), y: parseFloat(e)})),
        fill: false
      });
    }
  }
  console.log(datasets);
  A = data;
  chart = new Chart(nusCanvas, {
    type: 'line',
    data: {
      labels: data.Time,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: chartTitle
      },
      legend: {
        display: true,
        fullWidth: true,
        position: 'bottom',
        labels: {
          boxWidth: 10
        }
      },
      scales: {
        xAxes: [
          {
            type: 'time',
            time: {
              format: 'YYYY-MM-DDTHH:mm:ss.SSSSZ',
              tooltipFormat: 'll HH:mm',
              min: moment().subtract(1, 'M') // show data for past month
            },
            scaleLabel: {
              display: true,
              labelString: 'Date'
            },
            ticks: {
              maxRotation: 0
            },
            gridLines: {
              color: '#f8f8f8'
            }
          }
        ],
        yAxes: [
          {
            id: 'score',
            type: 'linear',
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Score'
            },
            gridLines: {
              color: '#f8f8f8'
            }
          }
        ]
      },
      pan: {
        enabled: true,
        mode: 'xy',
        speed: 10,
        threshold: 10
      },
      zoom: {
        enabled: true,
        mode: 'xy',
        limits: {
          max: 10,
          min: 5
        }
      }
    }
  })
});
}
