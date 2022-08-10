const weather = {
  DOM: {
    select: document.getElementById('cities_select'),
    button: document.getElementById('find-out_button'),
    title: {
      city: document.getElementById('city'),
      date: document.getElementById('date'),
      img: document.getElementById('img')
    },
    temperature: {
      current: document.getElementById('current-temp'),
      feels_like: document.getElementById('feels-like-temp'),
      min_temp: document.getElementById('min-temp'),
      max_temp: document.getElementById('max-temp')
    },
    other: {
      wind: document.getElementById('wind'),
      pressure: document.getElementById('pressure'),
      humidity: document.getElementById('humidity')
    }
  },
  apikey: '87b01ade56160da6989a7a97fc76dbe0',

  selectedCity: function() {
    return this.DOM.select.querySelectorAll('option')[this.DOM.select.selectedIndex].value; 
  },

  fetchCoordinates: function() {
    const city = this.selectedCity();
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?` + 
      `q=${city}` +
      `&limit=5` +
      `&appid=${this.apikey}`
    ).then(response => response.json())
    .then(data => {
      const geoposition = {
        "lat": data[0].lat,
        "lon": data[0].lon
      }

      return geoposition;
    }).then(geoposition => this.fetchWeather(geoposition));
  },

  fetchWeather: function(geo) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?` +
      `lat=${geo.lat}` +
      `&lon=${geo.lon}` + 
      `&units=metric` +
      `&appid=${this.apikey}`
    ).then(response => response.json())
    .then(data => {
      const indicators = {
        city:         data.name,
        current:      data.weather[0].main,
        current_temp: Math.floor(data.main.temp),
        feels_like:   Math.floor(data.main.feels_like),
        temp_min:     Math.floor(data.main.temp_min),
        temp_max:     Math.floor(data.main.temp_max),
        wind:         data.wind.speed,
        pressure:     data.main.pressure,
        humidity:     data.main.humidity,
      }

      return indicators;
    }).then(indicators => this.showWeather(indicators));
  },

  getDate: function() {
    const options = { weekday: 'long'};
    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    const data = new Date();
    const date = {
      day: data.getDate(),
      weekDay: new Intl.DateTimeFormat('ru-RU', options).format(data),
      month: data.getMonth(),
      hours: data.getHours(),
      minutes: data.getMinutes()
    };

    return `${date.hours}:${date.minutes} - ${date.day} ${months[date.month]}, ${date.weekDay}`;
  },

  changeBackground: function() {
    const cities = {
      Belgorod: '/img/cities/belgorod.jpg',
      Kyiv: '/img/cities/kyiv.jpg',
      London: '/img/cities/london.jpg',
      Moscow: '/img/cities/moscow.jpg',
      Paris: '/img/cities/paris.jpg',
      Tokyo: '/img/cities/tokyo.jpg',
      Toronto: '/img/cities/toronto.jpg'
    };

    const city = this.selectedCity();
    
    if (city === 'Belgorod') this.DOM.title.img.src = '/img/weather/cotton.jpg';

    for (const key in cities) {
      if (city === key) {
        const link = `${cities[key]}`;
        document.body.style.backgroundImage = `url(${link})`;
      }
    };
  },

  changeIcon: function(condition) {
    const conditions = {
      Clear: '/img/weather/clear.jpg',
      Clouds: '/img/weather/clouds.jpg',
      Rain: '/img/weather/rain.jpg',
      Snow: '/img/weather/snow.jpg',
      Default: '/img/weather/default.jpg'
    };

    this.DOM.title.img.src = conditions.Default;

    for (const key in conditions) {
      if (condition === key) {
        this.DOM.title.img.src = conditions[key];
      }
    };
  },

  showWeather: function(indicators) {
    this.DOM.title.city.innerHTML =             `Погода в ${indicators.city} сейчас`;
    this.DOM.title.date.innerHTML =             this.getDate();
    this.DOM.title.img.src.innerHTML =          '/img/weather/clouds.jpg';
    this.DOM.temperature.current.innerHTML =    `+${indicators.current_temp}°`;
    this.DOM.temperature.feels_like.innerHTML = `+${indicators.feels_like}°`;
    this.DOM.temperature.min_temp.innerHTML =   `+${indicators.temp_min}°`;
    this.DOM.temperature.max_temp.innerHTML =   `+${indicators.temp_max}°`;
    this.DOM.other.wind.innerHTML =             `${indicators.wind} км/ч`;
    this.DOM.other.pressure.innerHTML =         `${indicators.pressure} мм р.с.`;
    this.DOM.other.humidity.innerHTML =         `${indicators.humidity}%`;
    this.changeIcon(indicators.current);
    this.changeBackground();
  }
}

weather.DOM.button.addEventListener('click', () => weather.fetchCoordinates());