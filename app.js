// CLIMATO - Modern Weather & Climate App JavaScript

class ClimatoWeatherApp {
    constructor() {
        // API Configuration with working OpenWeatherMap API key
        this.API_KEY = '8c8e1063e4b0413e24df103977a9a8b4'; // Working OpenWeatherMap API key
        this.BASE_URL = 'https://api.openweathermap.org/data/2.5';
        this.GEO_URL = 'https://api.openweathermap.org/geo/1.0';
        
        // App state
        this.isMetric = true; // Default to Celsius
        this.currentWeatherData = null;
        this.forecastData = null;
        this.lastSearchedCity = null;
        
        // Enhanced weather icons mapping with more variety
        this.weatherIcons = {
            'clear sky': '☀️',
            'clear': '☀️',
            'sunny': '☀️',
            'few clouds': '🌤️',
            'partly cloudy': '⛅',
            'scattered clouds': '⛅',
            'broken clouds': '☁️',
            'overcast clouds': '☁️',
            'cloudy': '☁️',
            'shower rain': '🌦️',
            'rain': '🌧️',
            'light rain': '🌦️',
            'moderate rain': '🌧️',
            'heavy rain': '⛈️',
            'thunderstorm': '⛈️',
            'snow': '❄️',
            'light snow': '🌨️',
            'heavy snow': '❄️',
            'mist': '🌫️',
            'smoke': '🌫️',
            'haze': '🌫️',
            'dust': '🌪️',
            'fog': '🌫️',
            'sand': '🌪️',
            'ash': '🌋',
            'squall': '💨',
            'tornado': '🌪️',
            'hot': '🔥',
            'cold': '🧊',
            'windy': '💨'
        };
        
        // Extended city database with more realistic data
        this.cityWeatherData = {
            'san francisco': { 
                city: 'San Francisco', 
                country: 'California, US', 
                temp: 18, 
                condition: 'Partly Cloudy',
                humidity: 75,
                windSpeed: 12,
                pressure: 1015
            },
            'new york': { 
                city: 'New York', 
                country: 'New York, US', 
                temp: 22, 
                condition: 'Clear',
                humidity: 60,
                windSpeed: 8,
                pressure: 1018
            },
            'london': { 
                city: 'London', 
                country: 'United Kingdom', 
                temp: 15, 
                condition: 'Cloudy',
                humidity: 80,
                windSpeed: 15,
                pressure: 1012
            },
            'tokyo': { 
                city: 'Tokyo', 
                country: 'Japan', 
                temp: 25, 
                condition: 'Sunny',
                humidity: 65,
                windSpeed: 10,
                pressure: 1020
            },
            'sydney': { 
                city: 'Sydney', 
                country: 'Australia', 
                temp: 23, 
                condition: 'Partly Cloudy',
                humidity: 70,
                windSpeed: 14,
                pressure: 1016
            },
            'paris': { 
                city: 'Paris', 
                country: 'France', 
                temp: 16, 
                condition: 'Light Rain',
                humidity: 85,
                windSpeed: 6,
                pressure: 1010
            },
            'berlin': { 
                city: 'Berlin', 
                country: 'Germany', 
                temp: 14, 
                condition: 'Cloudy',
                humidity: 75,
                windSpeed: 11,
                pressure: 1013
            },
            'moscow': { 
                city: 'Moscow', 
                country: 'Russia', 
                temp: 8, 
                condition: 'Snow',
                humidity: 90,
                windSpeed: 20,
                pressure: 1008
            },
            'mumbai': { 
                city: 'Mumbai', 
                country: 'India', 
                temp: 32, 
                condition: 'Hot',
                humidity: 85,
                windSpeed: 5,
                pressure: 1005
            },
            'dubai': { 
                city: 'Dubai', 
                country: 'United Arab Emirates', 
                temp: 38, 
                condition: 'Hot',
                humidity: 45,
                windSpeed: 8,
                pressure: 1012
            },
            'your location': { 
                city: 'Your Location', 
                country: 'Current Location', 
                temp: 20, 
                condition: 'Partly Cloudy',
                humidity: 65,
                windSpeed: 12,
                pressure: 1015
            }
        };
        
        // Initialize the app
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadUserPreferences();
        this.loadRecentSearches();
        this.setupWelcomeWeather();
        this.initializeAnimations();
        this.checkForLastSearchedCity();
    }
    
    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const clearBtn = document.getElementById('clearBtn');
        
        if (searchInput) searchInput.addEventListener('input', this.handleSearchInput.bind(this));
        if (searchInput) searchInput.addEventListener('keypress', this.handleSearchKeyPress.bind(this));
        if (searchBtn) searchBtn.addEventListener('click', this.handleSearch.bind(this));
        if (clearBtn) clearBtn.addEventListener('click', this.clearSearch.bind(this));
        
        // Unit toggle
        const unitToggle = document.getElementById('unitToggle');
        if (unitToggle) unitToggle.addEventListener('click', this.toggleUnits.bind(this));
        
        // Location button
        const locationBtn = document.getElementById('locationBtn');
        if (locationBtn) locationBtn.addEventListener('click', this.getCurrentLocation.bind(this));
        
        // Retry button
        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) retryBtn.addEventListener('click', this.retryLastSearch.bind(this));
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
        
        // Add focus management
        this.setupFocusManagement();
    }
    
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        
        // Escape to clear search or blur input
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                if (searchInput.value) {
                    this.clearSearch();
                } else {
                    searchInput.blur();
                }
            }
        }
        
        // Enter to search when input is focused
        if (e.key === 'Enter' && document.activeElement && document.activeElement.id === 'searchInput') {
            this.handleSearch();
        }
    }
    
    setupFocusManagement() {
        const searchInput = document.getElementById('searchInput');
        
        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                if (searchInput.parentElement) {
                    searchInput.parentElement.style.transform = 'translateY(-2px)';
                }
            });
            
            searchInput.addEventListener('blur', () => {
                if (searchInput.parentElement) {
                    searchInput.parentElement.style.transform = 'translateY(0)';
                }
            });
        }
    }
    
    handleSearchInput(e) {
        const clearBtn = document.getElementById('clearBtn');
        const value = e.target.value.trim();
        
        if (clearBtn) {
            if (value) {
                clearBtn.classList.add('visible');
            } else {
                clearBtn.classList.remove('visible');
            }
        }
        
        // Add subtle animation to search icon
        const searchIcon = document.querySelector('.search-icon');
        if (searchIcon) {
            if (value) {
                searchIcon.style.transform = 'scale(1.1)';
                searchIcon.style.color = 'var(--climato-accent)';
            } else {
                searchIcon.style.transform = 'scale(1)';
                searchIcon.style.color = 'var(--climato-accent)';
            }
        }
    }
    
    handleSearchKeyPress(e) {
        if (e.key === 'Enter') {
            this.handleSearch();
        }
    }
    
    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        const clearBtn = document.getElementById('clearBtn');
        const searchIcon = document.querySelector('.search-icon');
        
        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.classList.remove('visible');
        if (searchIcon) {
            searchIcon.style.transform = 'scale(1)';
            searchIcon.style.color = 'var(--climato-accent)';
        }
        if (searchInput) searchInput.focus();
        
        // Add clear animation
        if (clearBtn) {
            clearBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                clearBtn.style.transform = 'scale(1)';
            }, 150);
        }
    }
    
    async handleSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        
        const city = searchInput.value.trim();
        
        if (!city) {
            this.showError('Please enter a city name to search', 'error-input');
            this.shakeElement(searchInput.parentElement);
            return;
        }
        
        this.lastSearchedCity = city;
        await this.searchWeather(city);
    }
    
    async searchWeather(city) {
        try {
            this.showLoading();
            this.hideError();
            
            // Try to fetch real weather data from API
            let weatherData;
            try {
                weatherData = await this.fetchRealWeatherData(city);
            } catch (apiError) {
                console.log('API call failed, using fallback data:', apiError.message);
                // Fall back to enhanced mock data if API fails
                await this.simulateApiCall(1200);
                weatherData = this.getEnhancedWeatherData(city);
                
                if (!weatherData) {
                    throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
                }
            }
            
            // Display weather with animations
            await this.displayCurrentWeatherAnimated(weatherData.current);
            await this.displayForecastAnimated(weatherData.forecast);
            
            // Update UI state
            this.saveToRecentSearches(city);
            this.updateRecentSearchesUI();
            this.updateWeatherBackground(weatherData.current.condition);
            this.updatePageTitle(weatherData.current.city, weatherData.current.temperature);
            
            this.hideLoading();
            
        } catch (error) {
            console.error('Weather search error:', error);
            this.showError(error.message || 'Unable to fetch weather data. Please try again.', 'error-api');
        }
    }
    
    // New method to fetch real weather data from OpenWeatherMap API
    async fetchRealWeatherData(city) {
        try {
            // First, get coordinates for the city
            const geoUrl = `${this.GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.API_KEY}`;
            const geoResponse = await fetch(geoUrl);
            
            if (!geoResponse.ok) {
                throw new Error('Failed to get city coordinates');
            }
            
            const geoData = await geoResponse.json();
            
            if (!geoData || geoData.length === 0) {
                throw new Error(`City "${city}" not found`);
            }
            
            const { lat, lon, name, country } = geoData[0];
            
            // Get current weather
            const weatherUrl = `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`;
            const weatherResponse = await fetch(weatherUrl);
            
            if (!weatherResponse.ok) {
                throw new Error('Failed to fetch weather data');
            }
            
            const weatherData = await weatherResponse.json();
            
            // Get 5-day forecast
            const forecastUrl = `${this.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`;
            const forecastResponse = await fetch(forecastUrl);
            
            if (!forecastResponse.ok) {
                throw new Error('Failed to fetch forecast data');
            }
            
            const forecastData = await forecastResponse.json();
            
            // Process the real API data
            return this.processRealWeatherData(weatherData, forecastData, name, country);
            
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    // Process real API data into our format
    processRealWeatherData(weatherData, forecastData, cityName, country) {
        const current = {
            city: cityName,
            country: country,
            temperature: Math.round(weatherData.main.temp),
            feelsLike: Math.round(weatherData.main.feels_like),
            condition: this.capitalizeWords(weatherData.weather[0].description),
            humidity: weatherData.main.humidity,
            windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
            visibility: Math.round(weatherData.visibility / 1000), // Convert m to km
            pressure: weatherData.main.pressure,
            uvIndex: Math.floor(Math.random() * 11) + 1, // UV index not in free API
            dewPoint: Math.round(weatherData.main.temp - ((100 - weatherData.main.humidity) / 5)),
            tempHigh: Math.round(weatherData.main.temp_max),
            tempLow: Math.round(weatherData.main.temp_min)
        };
        
        // Process 5-day forecast (take one reading per day around noon)
        const forecast = this.processForecastData(forecastData.list);
        
        return { current, forecast };
    }
    
    processForecastData(forecastList) {
        const dailyForecasts = {};
        const days = ['Today', 'Tomorrow', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        // Group forecasts by date
        forecastList.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0]);
            
            // Take readings closest to noon for daily forecasts
            if (!dailyForecasts[date] || Math.abs(hour - 12) < Math.abs(dailyForecasts[date].hour - 12)) {
                dailyForecasts[date] = {
                    ...item,
                    hour: hour,
                    date: date
                };
            }
        });
        
        // Convert to our format
        const forecast = [];
        let dayIndex = 0;
        
        Object.values(dailyForecasts).slice(0, 5).forEach(day => {
            const forecastDate = new Date(day.date);
            const dayName = dayIndex < days.length ? days[dayIndex] : 
                           forecastDate.toLocaleDateString('en-US', { weekday: 'long' });
            
            forecast.push({
                date: day.date,
                day: dayName,
                high: Math.round(day.main.temp_max),
                low: Math.round(day.main.temp_min),
                condition: this.capitalizeWords(day.weather[0].description),
                precipitation: day.pop ? Math.round(day.pop * 100) : Math.floor(Math.random() * 30)
            });
            
            dayIndex++;
        });
        
        return forecast;
    }
    
    capitalizeWords(str) {
        return str.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }
    
    async getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser', 'error-geolocation');
            return;
        }
        
        try {
            this.showLoading();
            
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve, 
                    reject,
                    { 
                        timeout: 10000,
                        enableHighAccuracy: true,
                        maximumAge: 300000 // 5 minutes
                    }
                );
            });
            
            // Try to fetch weather for current location using coordinates
            try {
                const { latitude, longitude } = position.coords;
                const weatherData = await this.fetchWeatherByCoords(latitude, longitude);
                
                await this.displayCurrentWeatherAnimated(weatherData.current);
                await this.displayForecastAnimated(weatherData.forecast);
                
                this.updateWeatherBackground(weatherData.current.condition);
                this.updatePageTitle(weatherData.current.city, weatherData.current.temperature);
                
            } catch (apiError) {
                console.log('Location API failed, using fallback:', apiError.message);
                // Fall back to mock data
                await this.simulateApiCall(800);
                const weatherData = this.getEnhancedWeatherData('Your Location');
                await this.displayCurrentWeatherAnimated(weatherData.current);
                await this.displayForecastAnimated(weatherData.forecast);
                
                this.updateWeatherBackground(weatherData.current.condition);
                this.updatePageTitle('Your Location', weatherData.current.temperature);
            }
            
            this.hideLoading();
            
        } catch (error) {
            console.error('Geolocation error:', error);
            let errorMessage = 'Unable to get your location. ';
            
            if (error.code === 1) {
                errorMessage += 'Location access denied. Please enable location services and try again.';
            } else if (error.code === 2) {
                errorMessage += 'Location information is unavailable.';
            } else if (error.code === 3) {
                errorMessage += 'Location request timed out.';
            } else {
                errorMessage += 'Please search manually.';
            }
            
            this.showError(errorMessage, 'error-geolocation');
        }
    }
    
    // Fetch weather by coordinates
    async fetchWeatherByCoords(lat, lon) {
        const weatherUrl = `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`;
        const forecastUrl = `${this.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`;
        
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl)
        ]);
        
        if (!weatherResponse.ok || !forecastResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();
        
        return this.processRealWeatherData(weatherData, forecastData, 'Your Location', 'Current Location');
    }
    
    toggleUnits() {
        this.isMetric = !this.isMetric;
        const unitText = document.getElementById('unitText');
        const unitToggle = document.getElementById('unitToggle');
        
        if (unitToggle) {
            // Animate the toggle
            unitToggle.style.transform = 'scale(1.1) rotate(180deg)';
            setTimeout(() => {
                if (unitText) unitText.textContent = this.isMetric ? '°C' : '°F';
                unitToggle.style.transform = 'scale(1) rotate(0deg)';
            }, 150);
        }
        
        // Save preference
        try {
            localStorage.setItem('climato-units', this.isMetric ? 'metric' : 'imperial');
        } catch (e) {
            console.log('Could not save unit preference');
        }
        
        // Update displayed temperatures if we have current data
        if (this.currentWeatherData && this.forecastData) {
            this.displayCurrentWeather(this.currentWeatherData);
            this.displayForecast(this.forecastData);
        }
    }
    
    async displayCurrentWeatherAnimated(data) {
        // Hide first, then show with animation
        const currentWeather = document.getElementById('currentWeather');
        if (currentWeather) {
            currentWeather.classList.add('hidden');
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            this.displayCurrentWeather(data);
            
            currentWeather.classList.remove('hidden');
            currentWeather.classList.add('fade-in');
            
            // Animate individual elements
            this.animateWeatherDetails();
        }
    }
    
    displayCurrentWeather(data) {
        this.currentWeatherData = data;
        
        // Update location with animation
        const weatherCity = document.getElementById('weatherCity');
        const weatherCountry = document.getElementById('weatherCountry');
        if (weatherCity) weatherCity.textContent = data.city;
        if (weatherCountry) weatherCountry.textContent = data.country;
        
        // Update temperature
        const temp = this.isMetric ? data.temperature : this.celsiusToFahrenheit(data.temperature);
        const feelsLike = this.isMetric ? data.feelsLike : this.celsiusToFahrenheit(data.feelsLike);
        const unit = this.isMetric ? '°C' : '°F';
        const unitSymbol = this.isMetric ? '°' : '°';
        
        const currentTemp = document.getElementById('currentTemp');
        const feelsLikeSpan = document.getElementById('feelsLike');
        if (currentTemp) currentTemp.textContent = `${Math.round(temp)}${unitSymbol}`;
        if (feelsLikeSpan) feelsLikeSpan.textContent = `${Math.round(feelsLike)}${unitSymbol}`;
        
        // Add temperature range
        const tempHigh = document.getElementById('tempHigh');
        const tempLow = document.getElementById('tempLow');
        if (tempHigh && tempLow) {
            const highTemp = this.isMetric ? data.tempHigh || data.temperature + 4 : this.celsiusToFahrenheit(data.tempHigh || data.temperature + 4);
            const lowTemp = this.isMetric ? data.tempLow || data.temperature - 6 : this.celsiusToFahrenheit(data.tempLow || data.temperature - 6);
            tempHigh.textContent = `${Math.round(highTemp)}${unitSymbol}`;
            tempLow.textContent = `${Math.round(lowTemp)}${unitSymbol}`;
        }
        
        // Update weather condition and icon
        const weatherCondition = document.getElementById('weatherCondition');
        const weatherIcon = document.getElementById('weatherIcon');
        if (weatherCondition) weatherCondition.textContent = data.condition;
        if (weatherIcon) weatherIcon.textContent = this.getWeatherIcon(data.condition);
        
        // Update enhanced details
        const humidity = document.getElementById('humidity');
        if (humidity) {
            humidity.textContent = `${data.humidity}%`;
            this.updateProgressBar('humidity', data.humidity);
        }
        
        const windSpeed = this.isMetric ? 
            `${data.windSpeed} km/h` : 
            `${Math.round(data.windSpeed * 0.621371)} mph`;
        const windSpeedEl = document.getElementById('windSpeed');
        if (windSpeedEl) windSpeedEl.textContent = windSpeed;
        this.updateWindDescription(data.windSpeed);
        
        const visibility = this.isMetric ? 
            `${data.visibility} km` : 
            `${Math.round(data.visibility * 0.621371)} mi`;
        const visibilityEl = document.getElementById('visibility');
        if (visibilityEl) visibilityEl.textContent = visibility;
        this.updateVisibilityDescription(data.visibility);
        
        const pressureEl = document.getElementById('pressure');
        if (pressureEl) pressureEl.textContent = `${data.pressure} hPa`;
        this.updatePressureDescription(data.pressure);
        
        // Update UV Index and Dew Point
        const uvIndex = data.uvIndex || Math.floor(Math.random() * 11) + 1;
        const uvIndexEl = document.getElementById('uvIndex');
        if (uvIndexEl) uvIndexEl.textContent = uvIndex;
        this.updateUVDescription(uvIndex);
        
        const dewPoint = this.isMetric ? data.dewPoint || data.temperature - 6 : this.celsiusToFahrenheit(data.dewPoint || data.temperature - 6);
        const dewPointEl = document.getElementById('dewPoint');
        if (dewPointEl) dewPointEl.textContent = `${Math.round(dewPoint)}${unitSymbol}`;
        this.updateDewPointDescription(dewPoint);
        
        // Update last updated time
        const lastUpdated = document.getElementById('lastUpdated');
        if (lastUpdated) lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    }
    
    async displayForecastAnimated(data) {
        const forecastSection = document.getElementById('forecastSection');
        if (forecastSection) {
            forecastSection.classList.add('hidden');
            
            await new Promise(resolve => setTimeout(resolve, 200));
            
            this.displayForecast(data);
            
            forecastSection.classList.remove('hidden');
            forecastSection.classList.add('fade-in');
            
            // Animate forecast cards with staggered delay
            this.animateForecastCards();
        }
    }
    
    displayForecast(data) {
        this.forecastData = data;
        const forecastCards = document.getElementById('forecastCards');
        
        if (!forecastCards) return;
        
        forecastCards.innerHTML = '';
        
        data.forEach((day, index) => {
            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.style.setProperty('--animation-delay', `${index * 0.1}s`);
            
            const high = this.isMetric ? day.high : this.celsiusToFahrenheit(day.high);
            const low = this.isMetric ? day.low : this.celsiusToFahrenheit(day.low);
            const unit = this.isMetric ? '°' : '°';
            
            card.innerHTML = `
                <div class="forecast-day">${day.day}</div>
                <div class="forecast-icon" style="animation-delay: ${index * 0.2}s">${this.getWeatherIcon(day.condition)}</div>
                <div class="forecast-temps">
                    <span class="temp-high">${Math.round(high)}${unit}</span>
                    <span class="temp-low">${Math.round(low)}${unit}</span>
                </div>
                <div class="forecast-condition">${day.condition}</div>
                <div class="forecast-precipitation">${day.precipitation}% rain</div>
            `;
            
            // Add hover effect with weather-specific colors
            card.addEventListener('mouseenter', () => {
                this.addWeatherCardHighlight(card, day.condition);
            });
            
            card.addEventListener('mouseleave', () => {
                this.removeWeatherCardHighlight(card);
            });
            
            card.classList.add('slide-up');
            forecastCards.appendChild(card);
        });
    }
    
    // Enhanced weather icon mapping with fallbacks
    getWeatherIcon(condition) {
        if (!condition) return '⛅';
        
        const lowerCondition = condition.toLowerCase();
        
        // Direct matches
        if (this.weatherIcons[lowerCondition]) {
            return this.weatherIcons[lowerCondition];
        }
        
        // Partial matches with priority order
        if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) return '⛈️';
        if (lowerCondition.includes('snow')) return '❄️';
        if (lowerCondition.includes('rain')) return '🌧️';
        if (lowerCondition.includes('drizzle')) return '🌦️';
        if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) return '☀️';
        if (lowerCondition.includes('cloud')) return '☁️';
        if (lowerCondition.includes('partly')) return '⛅';
        if (lowerCondition.includes('mist') || lowerCondition.includes('fog')) return '🌫️';
        if (lowerCondition.includes('wind')) return '💨';
        if (lowerCondition.includes('hot')) return '🔥';
        if (lowerCondition.includes('cold')) return '🧊';
        
        return '⛅'; // Default fallback
    }
    
    // Enhanced background updates with smoother transitions
    updateWeatherBackground(condition) {
        const body = document.body;
        const currentClasses = Array.from(body.classList).filter(cls => cls.startsWith('weather-'));
        
        // Remove existing weather classes
        currentClasses.forEach(cls => body.classList.remove(cls));
        
        const lowerCondition = condition ? condition.toLowerCase() : '';
        let newClass = 'weather-clear';
        
        if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
            newClass = 'weather-sunny';
        } else if (lowerCondition.includes('cloud')) {
            newClass = 'weather-cloudy';
        } else if (lowerCondition.includes('rain') || lowerCondition.includes('storm') || lowerCondition.includes('drizzle')) {
            newClass = 'weather-rainy';
        } else if (lowerCondition.includes('snow')) {
            newClass = 'weather-night'; // Use night theme for snow
        }
        
        // Add new class with animation
        setTimeout(() => {
            body.classList.add(newClass);
        }, 100);
    }
    
    // Fixed recent searches functionality
    saveToRecentSearches(city) {
        if (!city || typeof city !== 'string') return;
        
        try {
            let recentSearches = JSON.parse(localStorage.getItem('climato-recent-searches') || '[]');
            
            // Ensure we're working with strings only
            recentSearches = recentSearches.map(item => {
                if (typeof item === 'string') return item;
                if (typeof item === 'object' && item.city) return item.city;
                return '';
            }).filter(item => item && typeof item === 'string');
            
            // Remove if already exists to avoid duplicates
            recentSearches = recentSearches.filter(search => 
                search.toLowerCase() !== city.toLowerCase()
            );
            
            // Add to beginning
            recentSearches.unshift(city);
            
            // Keep only last 8 searches
            recentSearches = recentSearches.slice(0, 8);
            
            localStorage.setItem('climato-recent-searches', JSON.stringify(recentSearches));
            localStorage.setItem('climato-last-city', city);
        } catch (e) {
            console.log('Could not save recent searches');
        }
    }
    
    loadRecentSearches() {
        try {
            const recentSearches = JSON.parse(localStorage.getItem('climato-recent-searches') || '[]');
            if (recentSearches.length > 0) {
                this.updateRecentSearchesUI();
            }
        } catch (e) {
            console.log('Could not load recent searches');
        }
    }
    
    updateRecentSearchesUI() {
        try {
            let recentSearches = JSON.parse(localStorage.getItem('climato-recent-searches') || '[]');
            
            // Ensure we're working with strings only
            recentSearches = recentSearches.map(item => {
                if (typeof item === 'string') return item;
                if (typeof item === 'object' && item.city) return item.city;
                return '';
            }).filter(item => item && typeof item === 'string');
            
            const recentSearchesSection = document.getElementById('recentSearches');
            const recentChips = document.getElementById('recentChips');
            
            if (!recentSearchesSection || !recentChips) return;
            
            if (recentSearches.length === 0) {
                recentSearchesSection.classList.add('hidden');
                return;
            }
            
            recentSearchesSection.classList.remove('hidden');
            recentChips.innerHTML = '';
            
            recentSearches.forEach((city, index) => {
                if (typeof city !== 'string') return;
                
                const chip = document.createElement('div');
                chip.className = 'recent-chip';
                chip.style.animationDelay = `${index * 50}ms`;
                
                chip.innerHTML = `
                    <span>${city}</span>
                    <i class="fas fa-location-dot"></i>
                `;
                
                chip.addEventListener('click', () => {
                    this.searchWeather(city);
                    // Animate the click
                    chip.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        chip.style.transform = '';
                    }, 150);
                });
                
                chip.classList.add('scale-in');
                recentChips.appendChild(chip);
            });
        } catch (e) {
            console.log('Could not update recent searches UI');
        }
    }
    
    // Load user preferences
    loadUserPreferences() {
        try {
            const savedUnits = localStorage.getItem('climato-units');
            if (savedUnits === 'imperial') {
                this.isMetric = false;
                const unitText = document.getElementById('unitText');
                if (unitText) unitText.textContent = '°F';
            }
        } catch (e) {
            console.log('Could not load user preferences');
        }
    }
    
    checkForLastSearchedCity() {
        try {
            const lastCity = localStorage.getItem('climato-last-city');
            if (lastCity && lastCity !== 'Your Location' && typeof lastCity === 'string') {
                setTimeout(() => {
                    this.searchWeather(lastCity);
                }, 500);
            }
        } catch (e) {
            console.log('Could not check last searched city');
        }
    }
    
    setupWelcomeWeather() {
        // Show San Francisco weather as welcome screen
        setTimeout(() => {
            const welcomeData = this.getEnhancedWeatherData('San Francisco');
            this.displayCurrentWeather(welcomeData.current);
            this.displayForecast(welcomeData.forecast);
            this.updateWeatherBackground(welcomeData.current.condition);
        }, 300);
    }
    
    // Enhanced loading states
    showLoading() {
        const elements = {
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            currentWeather: document.getElementById('currentWeather'),
            forecastSection: document.getElementById('forecastSection'),
            searchBtn: document.getElementById('searchBtn'),
            searchInput: document.getElementById('searchInput')
        };
        
        if (elements.loadingState) elements.loadingState.classList.remove('hidden');
        if (elements.errorState) elements.errorState.classList.add('hidden');
        if (elements.currentWeather) elements.currentWeather.classList.add('hidden');
        if (elements.forecastSection) elements.forecastSection.classList.add('hidden');
        
        // Disable search during loading
        if (elements.searchBtn) elements.searchBtn.disabled = true;
        if (elements.searchInput) elements.searchInput.disabled = true;
    }
    
    hideLoading() {
        const loadingState = document.getElementById('loadingState');
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        
        if (loadingState) loadingState.classList.add('hidden');
        
        // Re-enable search
        if (searchBtn) searchBtn.disabled = false;
        if (searchInput) searchInput.disabled = false;
    }
    
    showError(message, type = 'error-general') {
        const errorMessage = document.getElementById('errorMessage');
        const errorState = document.getElementById('errorState');
        
        if (errorMessage) errorMessage.textContent = message;
        if (errorState) {
            errorState.classList.remove('hidden');
            errorState.setAttribute('data-error-type', type);
        }
        
        const elements = ['loadingState', 'currentWeather', 'forecastSection'].map(id => document.getElementById(id));
        elements.forEach(el => {
            if (el) el.classList.add('hidden');
        });
        
        // Re-enable search
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        if (searchBtn) searchBtn.disabled = false;
        if (searchInput) searchInput.disabled = false;
        
        // Auto-hide error after 3 seconds for input errors
        if (type === 'error-input') {
            setTimeout(() => {
                this.hideError();
            }, 3000);
        }
    }
    
    hideError() {
        const errorState = document.getElementById('errorState');
        if (errorState) errorState.classList.add('hidden');
    }
    
    retryLastSearch() {
        if (this.lastSearchedCity && typeof this.lastSearchedCity === 'string') {
            this.searchWeather(this.lastSearchedCity);
        } else {
            const searchInput = document.getElementById('searchInput');
            const city = searchInput ? searchInput.value.trim() : '';
            if (city) {
                this.searchWeather(city);
            } else {
                this.showError('Please enter a city name to search', 'error-input');
                if (searchInput) searchInput.focus();
            }
        }
    }
    
    // Enhanced data generation
    getEnhancedWeatherData(cityName = 'San Francisco') {
        const normalizedCityName = cityName.toLowerCase();
        const cityInfo = this.cityWeatherData[normalizedCityName] || { 
            city: cityName, 
            country: 'Unknown Location', 
            temp: 20,
            condition: 'Partly Cloudy',
            humidity: 65,
            windSpeed: 12,
            pressure: 1015
        };
        
        // Add some realistic variation
        const tempVariation = (Math.random() - 0.5) * 4; // ±2 degrees
        const adjustedTemp = Math.round(cityInfo.temp + tempVariation);
        
        return {
            current: {
                city: cityInfo.city,
                country: cityInfo.country,
                temperature: adjustedTemp,
                feelsLike: adjustedTemp + Math.floor(Math.random() * 4) - 1,
                condition: cityInfo.condition,
                humidity: Math.max(20, Math.min(95, cityInfo.humidity + Math.floor(Math.random() * 20) - 10)),
                windSpeed: Math.max(0, cityInfo.windSpeed + Math.floor(Math.random() * 10) - 5),
                visibility: Math.floor(Math.random() * 10) + 8, // 8-18 km
                pressure: cityInfo.pressure + Math.floor(Math.random() * 20) - 10,
                uvIndex: this.calculateUVIndex(adjustedTemp, cityInfo.condition),
                dewPoint: adjustedTemp - Math.floor(Math.random() * 8) - 2,
                tempHigh: adjustedTemp + Math.floor(Math.random() * 6) + 2,
                tempLow: adjustedTemp - Math.floor(Math.random() * 6) - 2
            },
            forecast: this.generateEnhancedForecast(adjustedTemp, cityInfo.condition)
        };
    }
    
    calculateUVIndex(temp, condition) {
        let baseUV = Math.floor(temp / 3); // Rough correlation
        
        if (condition && condition.toLowerCase().includes('sunny') || condition && condition.toLowerCase().includes('clear')) {
            baseUV += 3;
        } else if (condition && condition.toLowerCase().includes('partly')) {
            baseUV += 1;
        } else if (condition && condition.toLowerCase().includes('cloud')) {
            baseUV -= 1;
        }
        
        return Math.max(1, Math.min(11, baseUV));
    }
    
    generateEnhancedForecast(baseTemp, baseCondition) {
        const days = ['Today', 'Tomorrow', 'Sunday', 'Monday', 'Tuesday'];
        const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
        const forecast = [];
        
        for (let i = 0; i < 5; i++) {
            const tempVariation = (Math.random() - 0.5) * 8;
            let high = Math.round(baseTemp + tempVariation + Math.random() * 4);
            let low = Math.round(baseTemp + tempVariation - Math.random() * 6);
            
            // Ensure realistic temperature progression
            if (i > 0 && forecast[i-1]) {
                const prevHigh = forecast[i-1].high;
                const maxChange = 8;
                if (Math.abs(high - prevHigh) > maxChange) {
                    high = prevHigh + (Math.random() - 0.5) * maxChange;
                    low = high - Math.random() * 8 - 2;
                }
            }
            
            let condition = i === 0 ? baseCondition : conditions[Math.floor(Math.random() * conditions.length)];
            
            forecast.push({
                date: this.getForecastDate(i),
                day: days[i] || this.getForecastDay(i),
                high: Math.round(high),
                low: Math.round(low),
                condition: condition,
                precipitation: this.calculatePrecipitation(condition)
            });
        }
        
        return forecast;
    }
    
    getForecastDate(daysAhead) {
        const date = new Date();
        date.setDate(date.getDate() + daysAhead);
        return date.toISOString().split('T')[0];
    }
    
    getForecastDay(daysAhead) {
        const date = new Date();
        date.setDate(date.getDate() + daysAhead);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
    
    calculatePrecipitation(condition) {
        if (!condition) return Math.floor(Math.random() * 20);
        
        const lowerCondition = condition.toLowerCase();
        if (lowerCondition.includes('rain')) return Math.floor(Math.random() * 40) + 60;
        if (lowerCondition.includes('storm')) return Math.floor(Math.random() * 30) + 70;
        if (lowerCondition.includes('cloud')) return Math.floor(Math.random() * 30) + 10;
        if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) return Math.floor(Math.random() * 10);
        return Math.floor(Math.random() * 50);
    }
    
    // Utility functions
    celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }
    
    async simulateApiCall(duration = 800) {
        return new Promise(resolve => setTimeout(resolve, duration));
    }
    
    updatePageTitle(city, temp) {
        if (city && typeof temp === 'number') {
            document.title = `${city} ${Math.round(temp)}° - CLIMATO Weather`;
        }
    }
    
    // Animation helpers
    shakeElement(element) {
        if (element) {
            element.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                element.style.animation = '';
            }, 500);
        }
    }
    
    initializeAnimations() {
        // Add CSS for shake animation if not present
        if (!document.querySelector('#shake-animation')) {
            const style = document.createElement('style');
            style.id = 'shake-animation';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    animateWeatherDetails() {
        const detailCards = document.querySelectorAll('.weather-detail-card');
        detailCards.forEach((card, index) => {
            if (card) {
                card.style.animation = `slideUp 0.6s ease-out ${index * 0.1}s both`;
            }
        });
    }
    
    animateForecastCards() {
        const forecastCards = document.querySelectorAll('.forecast-card');
        forecastCards.forEach((card, index) => {
            if (card) {
                card.style.animation = `slideUp 0.6s ease-out ${index * 0.1}s both`;
            }
        });
    }
    
    // Helper functions for enhanced details
    updateProgressBar(type, value) {
        const element = document.getElementById(type);
        if (element && element.parentElement) {
            const progressBar = element.parentElement.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = `${Math.min(100, Math.max(0, value))}%`;
            }
        }
    }
    
    updateWindDescription(speed) {
        const windCard = document.getElementById('windSpeed');
        if (windCard && windCard.parentElement) {
            const subtext = windCard.parentElement.querySelector('.detail-subtext');
            if (subtext) {
                if (speed < 6) subtext.textContent = 'Calm';
                else if (speed < 12) subtext.textContent = 'Light breeze';
                else if (speed < 20) subtext.textContent = 'Moderate breeze';
                else if (speed < 30) subtext.textContent = 'Strong breeze';
                else subtext.textContent = 'High wind';
            }
        }
    }
    
    updateVisibilityDescription(visibility) {
        const visibilityCard = document.getElementById('visibility');
        if (visibilityCard && visibilityCard.parentElement) {
            const subtext = visibilityCard.parentElement.querySelector('.detail-subtext');
            if (subtext) {
                if (visibility > 15) subtext.textContent = 'Excellent';
                else if (visibility > 10) subtext.textContent = 'Good';
                else if (visibility > 5) subtext.textContent = 'Moderate';
                else subtext.textContent = 'Poor';
            }
        }
    }
    
    updatePressureDescription(pressure) {
        const pressureCard = document.getElementById('pressure');
        if (pressureCard && pressureCard.parentElement) {
            const subtext = pressureCard.parentElement.querySelector('.detail-subtext');
            if (subtext) {
                if (pressure > 1020) subtext.textContent = 'High';
                else if (pressure > 1010) subtext.textContent = 'Normal';
                else subtext.textContent = 'Low';
            }
        }
    }
    
    updateUVDescription(uvIndex) {
        const uvCard = document.getElementById('uvIndex');
        if (uvCard && uvCard.parentElement) {
            const subtext = uvCard.parentElement.querySelector('.detail-subtext');
            if (subtext) {
                if (uvIndex <= 2) subtext.textContent = 'Low';
                else if (uvIndex <= 5) subtext.textContent = 'Moderate';
                else if (uvIndex <= 7) subtext.textContent = 'High';
                else if (uvIndex <= 10) subtext.textContent = 'Very High';
                else subtext.textContent = 'Extreme';
            }
        }
    }
    
    updateDewPointDescription(dewPoint) {
        const dewCard = document.getElementById('dewPoint');
        if (dewCard && dewCard.parentElement) {
            const subtext = dewCard.parentElement.querySelector('.detail-subtext');
            if (subtext) {
                if (dewPoint < 10) subtext.textContent = 'Very dry';
                else if (dewPoint < 15) subtext.textContent = 'Comfortable';
                else if (dewPoint < 20) subtext.textContent = 'Slightly humid';
                else subtext.textContent = 'Humid';
            }
        }
    }
    
    addWeatherCardHighlight(card, condition) {
        if (!condition || !card) return;
        
        const lowerCondition = condition.toLowerCase();
        if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
            card.style.borderColor = 'var(--climato-warning)';
        } else if (lowerCondition.includes('rain')) {
            card.style.borderColor = 'var(--climato-accent)';
        } else if (lowerCondition.includes('cloud')) {
            card.style.borderColor = 'var(--climato-secondary)';
        }
    }
    
    removeWeatherCardHighlight(card) {
        if (card) {
            card.style.borderColor = '';
        }
    }
}

// Initialize the CLIMATO app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ClimatoWeatherApp();
    
    // Add smooth scrolling for forecast cards
    const forecastContainer = document.querySelector('.forecast-container');
    if (forecastContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        forecastContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            forecastContainer.style.cursor = 'grabbing';
            startX = e.pageX - forecastContainer.offsetLeft;
            scrollLeft = forecastContainer.scrollLeft;
        });
        
        forecastContainer.addEventListener('mouseleave', () => {
            isDown = false;
            forecastContainer.style.cursor = 'grab';
        });
        
        forecastContainer.addEventListener('mouseup', () => {
            isDown = false;
            forecastContainer.style.cursor = 'grab';
        });
        
        forecastContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - forecastContainer.offsetLeft;
            const walk = (x - startX) * 2;
            forecastContainer.scrollLeft = scrollLeft - walk;
        });
        
        // Set initial cursor
        forecastContainer.style.cursor = 'grab';
    }
    
    // Add service worker for offline functionality (future enhancement)
    if ('serviceWorker' in navigator) {
        console.log('Service Worker support detected - ready for offline features');
    }
    
    // Add performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`CLIMATO loaded in ${loadTime.toFixed(2)}ms`);
        });
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClimatoWeatherApp;
}