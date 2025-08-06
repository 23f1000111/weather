const cityApp = new Vue({
    el: '#app',
    data: {
        cityData: null,
        loading: true,
        error: null,
        cityName: ''
    },
    mounted() {
        // Get city name from localStorage
        this.cityName = localStorage.getItem('searchCity') || 'Unknown City';
        document.getElementById('city-title').textContent = `Weather for ${this.cityName}`;
        
        this.fetchCityWeather();
    },
    methods: {
        fetchCityWeather() {
            this.loading = true;
            this.error = null;
            this.cityData = null;

            if (!this.cityName || this.cityName === 'Unknown City') {
                this.error = 'No city specified. Please go back and search for a city.';
                this.loading = false;
                return;
            }

            const encodedCity = encodeURIComponent(this.cityName);
            
            fetch(`https://api.weatherapi.com/v1/forecast.json?q=${encodedCity}&days=7&key=${window.API_CONFIG.WEATHER_API_KEY}`)
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 400) {
                            throw new Error(`City "${this.cityName}" not found. Please check the spelling and try again.`);
                        }
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('City weather data:', data);
                    
                    // Ensure all necessary properties exist before displaying
                    // This prevents errors if API response structure changes
                    if (!data.current) data.current = {};
                    if (!data.current.condition) data.current.condition = { text: 'Unknown', icon: '' };
                    if (!data.forecast) data.forecast = { forecastday: [] };
                    if (!data.forecast.forecastday || data.forecast.forecastday.length === 0) {
                        // Create placeholder data for 7 days if missing
                        data.forecast.forecastday = Array(7).fill().map((_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() + i);
                            return {
                                date: date.toISOString().split('T')[0],
                                day: {
                                    maxtemp_c: '--',
                                    mintemp_c: '--',
                                    avghumidity: '--',
                                    daily_chance_of_rain: '--',
                                    maxwind_kph: '--',
                                    condition: { text: 'No data', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' }
                                },
                                astro: {
                                    sunrise: '--',
                                    sunset: '--',
                                    moon_phase: '--',
                                    moon_illumination: '--'
                                },
                                hour: []
                            };
                        });
                    } else {
                        // Make sure each forecast day has the necessary properties
                        data.forecast.forecastday.forEach(day => {
                            if (!day.day) day.day = {};
                            if (!day.day.condition) day.day.condition = { text: 'Unknown', icon: '' };
                            if (!day.astro) day.astro = {};
                            if (!day.hour) day.hour = [];
                        });
                    }
                    
                    this.cityData = data;
                })
                .catch(error => {
                    console.error('Error fetching city weather:', error);
                    this.error = error.message;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        formatDateTime(dateTimeString) {
            return new Date(dateTimeString).toLocaleString();
        },
        formatHourTime(timeString) {
            // Convert "2025-08-06 01:00" to "1 AM"
            const date = new Date(timeString);
            return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
        },
        formatDate(dateString) {
            // Convert "2025-08-06" to "Wednesday, Aug 6"
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        },
        getDayName(dateString) {
            // Get just the day name, e.g., "Wednesday"
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        }
    }
});