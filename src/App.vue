<template>
  <div id="app">
    <div>
        <transition name="fade" mode="out-in">
          <div v-if="select == 1" key="1">
            <h2>Скан web-ресурса</h2>
            <div>
              <h3 v-if="!safeBrow" class="text-g">Безопасен</h3>
              <h3 v-else class="text-w">Опасен</h3>
            </div>
            <a class="analysis" @click="selectCheck" href="#">Провести полный анализ?</a>
            <h1>{{ safeBrow }}</h1>
          </div>
          <div v-if="select == 2" key="2" class="cssload-thecube">
            <div class="spinner">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
            </div>
          </div>
          <div v-if="select == 3" key="3" class="graf">
            <Doughnut :chart-data="this.datacoll" :height="400" :options="this.options"></Doughnut>
            <p> {{ this.warning }} из {{ this.sum }} источников считают этот сайт опасным</p>
          </div>
        </transition>
    </div>


    <!--<input type="text">-->
    <!--<button @click="show == true">Отправить</button>-->
  </div>
</template>

<script>

import axios from "axios";
import Doughnut from './DoughnutChart.js';

export default {
  name: 'app',
  data () {
    return {
      select: 1,
      safeBrow: false,
      scanUrl: '',
      scanUrlFull: '',
      clean: 0,
      unrated: 0,
      warning: 0,
      sum: null,
      datacoll: '',
      options: {
        responsive: true,
        maintainAspectRatio: true,
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        legend: {
          labels: {
            boxWidth: 20
          }
        },
        title: {
          display: true,
          text: 'Результаты сканирования VirusTotal'
        }
      }

    }
  },
  methods: {
    clearUrl(scan) {
      let non = scan.indexOf('/', scan.indexOf('/') + 2) + 1;
      let str = scan.substring(0, non);
      return str;
    },
    getUrlGoogle(safe) {
      console.log(safe)
      axios.post('ovapi.ovd.su/api/post-url-scan-google', {
        url: safe,
        crossDomain: true,
      })
        .then(response => {
          console.log(response);
          let data = (response.data[0]);
          console.log(data);
          if (data == "clean") {
            this.safeBrow = false;
            console.log('Ok, безопасен');
          } else {
            this.safeBrow = true;
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    getUrl(url) {
        axios.post('ovapi.ovd.su/api/post-url-scan', {
          url: url,
          apikey: '5ca8277fafc89da750fe37e6aa5640f8de23226b9c35592f74f876be6c020366',
          crossDomain: true,
        })
          .then(response => {
            let data = JSON.parse(response.data);
            if (data.response_code == 1) {
              axios.post('ovapi.ovd.su/api/post-url-report', {
                url: url,
                apikey: '5ca8277fafc89da750fe37e6aa5640f8de23226b9c35592f74f876be6c020366',
                crossDomain: true,
              })
                .then(response => {
                  this.sum = response.data.clean + response.data.warning + response.data.unrated;
                  this.warning = response.data.warning;
                  this.select = 3;
                  console.log(' Супер');
                  this.datacoll = {
                    labels: ["Безопасная", "Опасная", "Нет результатов"],
                    datasets: [{
                      data: [response.data.clean, response.data.warning, response.data.unrated],
                      backgroundColor: [
                        'rgba(66, 184, 131, 0.8)',
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(71, 74, 81, 0.8)',
                      ],
                      borderWidth: 0,
                    }]
                  };
                })
                .catch(error => {
                  console.log(error);
                })
            }
          })
          .catch(function (error) {
            console.log(error);
          })

    },
    selectCheck() {
      this.select = 2;
      this.getUrl(this.scanUrl);

    }
  },
  created() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      this.scanUrl = tabs[0].url;
      this.getUrlGoogle(this.clearUrl(tabs[0].url));
    });
  },
  components: {
    Doughnut
  }
}


</script>

<style>
#app {
  font-family: 'Roboto', sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  min-width: 280px;
  max-width: 300px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}

.graf {
  padding: 0 20px;
}

h1, h2 {
  font-weight: normal;
}

a{
  text-decoration: none;
}

.text-g {
  color: white;
  background: rgb(66, 184, 131);
  padding: 5px 5px;
  border-radius: 5px;
  margin: 20px 30px;
}

.text-w {
  color: white;
  background: rgb(255, 49, 57);
  padding: 5px 5px;
  border-radius: 5px;
  margin: 20px 30px;
}

.analysis {
  color: gray;
  display: inline-block;
  border: 1px solid gray;
  padding: 8px 20px;
  border-radius: 5px;
  margin: 0px 30px 20px;
  transition: .3s;
}

.analysis:hover {
  background: gray;
  color: white;
}

.spinner {
  margin: 100px auto;
  width: 50px;
  height: 40px;
  text-align: center;
  font-size: 10px;
}

.spinner > div {
  background-color: #42b883;
  height: 100%;
  width: 6px;
  display: inline-block;

  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes sk-stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0.4) }
  20% { -webkit-transform: scaleY(1.0) }
}

@keyframes sk-stretchdelay {
  0%, 40%, 100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }  20% {
       transform: scaleY(1.0);
       -webkit-transform: scaleY(1.0);
     }
}


</style>
