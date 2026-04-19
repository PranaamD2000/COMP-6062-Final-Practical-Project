const app = Vue.createApp({
  data() {
    return {
      user: {
        name: "",
        age: "",
        picture: ""
      },

      weather: {
        temperature: "",
        wind: "",
      },

      definition: {
        word: "",
        phonetic: "",
        meaning: ""
      },

      city: "London",
      province: "Ontario",
      country: "Canada",

      word: ""
    };
  },created(){
    this.getUser();
     this.getWeather();
  },
  methods: {

     getUser() {
       fetch("https://randomuser.me/api/").then(res => {
        if(res.ok) {
          return res.json();
        } else {
          console.log("An error occurred while fetching user data.");
        }
       }).then(data => {
         this.user.name = data.results[0].name.first + " " + data.results[0].name.last;
         this.user.age = data.results[0].dob.age;
         this.user.picture = data.results[0].picture.medium;
       }).catch(error => {
         console.error("Total Failure");
       });
    },

    getWeather() {
      const url = `https://nominatim.openstreetmap.org/search?addressdetails=1&q=${this.city}+${this.province}+${this.country}&format=jsonv2&limit=1`;
       fetch(url).then(res => {
        if(res.ok) {
          return res.json();
        } else {
          console.log("An error occurred while fetching weather data.");
        }
       }).then(data => {
         const url1 = `https://api.open-meteo.com/v1/forecast?latitude=${data[0].lat}&longitude=${data[0].lon}&hourly=temperature_2m,weather_code,wind_speed_10m`;
         fetch(url1).then(res1 => {
          if(res1.ok) {
            return res1.json();
          } else {
            console.log("An error occurred while fetching weather data.");
          }
         }).then(data1 => {
           this.weather.temperature = data1.hourly.temperature_2m[0];
           this.weather.wind = data1.hourly.wind_speed_10m[0];
           let code = data1.hourly.weather_code[0];

             if(code === 0){
               this.weather.description = "Clear";
             } else if(code <= 3){
               this.weather.description = "Cloudy";
             } else if(code <= 50){
               this.weather.description = "Rain";
             } else {
               this.weather.description = "Unknown";
             }
         }).catch(error => {
           console.error("Total Failure");
         });
        }).catch(error => { 
          console.error("Total Failure");
        });},


      getDefinition() {
          fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${this.word}`).then(res => {
            if(res.ok) {
              return res.json();
            } else {
              console.log("An error occurred while fetching definition data.");
            }
          }).then(data => {
            if (data[0]) {
              this.definition.word = data[0].word;
              this.definition.phonetic = data[0].phonetic || "";
              this.definition.meaning = data[0].meanings[0].definitions[0].definition;
            }
            }).catch(error => {
              console.error("Total Failure");
            });
            } 
        }
});

app.mount("#app");