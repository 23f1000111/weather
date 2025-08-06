const app = new Vue({
  el: "#app",
  data: {
    message: "Welcome to the Weather App",
    lucknowData: null,
    delhiData: null,
    kanpurData: null,
    loading: true,
    error: null,
    searchQuery: "",
    suggestions: [],
    showSuggestions: false,
    selectedIndex: -1,
    searchTimeout: null,
  },

  mounted() {
    console.log("Vue app mounted, fetching weather...");
    this.fetchCities();
  },

  methods: {
    onSearchInput() {
      // Clear previous timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      // Set a delay before searching to avoid too many API calls
      this.searchTimeout = setTimeout(() => {
        if (this.searchQuery.trim().length >= 2) {
          this.fetchSuggestions();
        } else {
          this.suggestions = [];
          this.showSuggestions = false;
        }
      }, 300); // 300ms delay
    },

    async fetchSuggestions() {
      try {
        const encodedQuery = encodeURIComponent(this.searchQuery.trim());
        const response = await fetch(
          `https://api.weatherapi.com/v1/search.json?q=${encodedQuery}&key=${window.API_CONFIG.WEATHER_API_KEY}`
        );

        if (response.ok) {
          const data = await response.json();
          this.suggestions = data.slice(0, 5); // Limit to 5 suggestions
          this.showSuggestions = this.suggestions.length > 0;
          this.selectedIndex = -1;
        } else {
          this.suggestions = [];
          this.showSuggestions = false;
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        this.suggestions = [];
        this.showSuggestions = false;
      }
    },

    hideSuggestions() {
      setTimeout(() => {
        this.showSuggestions = false;
        this.selectedIndex = -1;
      }, 200); // Small delay to allow click events to fire
    },

    handleKeydown(event) {
      if (!this.showSuggestions || this.suggestions.length === 0) {
        if (event.key === "Enter") {
          this.searchCity();
        }
        return;
      }

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          this.selectedIndex = Math.min(
            this.selectedIndex + 1,
            this.suggestions.length - 1
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
          break;
        case "Enter":
          event.preventDefault();
          if (this.selectedIndex >= 0) {
            this.selectSuggestion(this.suggestions[this.selectedIndex]);
          } else {
            this.searchCity();
          }
          break;
        case "Escape":
          this.hideSuggestions();
          break;
      }
    },

    selectSuggestion(suggestion) {
      this.searchQuery = suggestion.name;
      this.hideSuggestions();
      this.searchCityWithData(suggestion);
    },

    searchCity() {
      if (this.searchQuery && this.searchQuery.trim()) {
        localStorage.setItem("searchCity", this.searchQuery.trim());
        window.location.href = "city.html";
      }
    },

    searchCityWithData(cityData) {
      // Store both city name and additional data for better search results
      localStorage.setItem("searchCity", cityData.name);
      localStorage.setItem("searchCityData", JSON.stringify(cityData));
      window.location.href = "city.html";
    },

    showSuggestionsIfAvailable() {
      if (this.suggestions.length > 0) {
        this.showSuggestions = true;
      }
    },
    
    viewCityDetails(cityName) {
      localStorage.setItem("searchCity", cityName);
      window.location.href = "city.html";
    },

    fetchCities() {
      this.loading = true;
      this.error = null;

      Promise.all([
        this.weather_Lucknow(),
        this.weather_NewDelhi(),
        this.weather_Kanpur(),
      ]).finally(() => {
        this.loading = false;
      });
    },

    // ...existing code...
    weather_Lucknow() {
      return fetch(
        "        `https://api.weatherapi.com/v1/current.json?q=Lucknow&key=${window.API_CONFIG.WEATHER_API_KEY}`"
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Lucknow weather data:", data);
          this.lucknowData = data;
        })
        .catch((error) => {
          console.error("Error fetching Lucknow weather:", error);
          this.error = error.message;
        });
    },

    weather_NewDelhi() {
      return fetch(
        "        `https://api.weatherapi.com/v1/current.json?q=New%20Delhi&key=${window.API_CONFIG.WEATHER_API_KEY}`"
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Delhi weather data:", data);
          this.delhiData = data;
        })
        .catch((error) => {
          console.error("Error fetching Delhi weather:", error);
          this.error = error.message;
        });
    },

    weather_Kanpur() {
      return fetch(
        "        `https://api.weatherapi.com/v1/current.json?q=Kanpur&key=${window.API_CONFIG.WEATHER_API_KEY}`"
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Kanpur weather data:", data);
          this.kanpurData = data;
        })
        .catch((error) => {
          console.error("Error fetching Kanpur weather:", error);
          this.error = error.message;
        });
    },
  },
});
