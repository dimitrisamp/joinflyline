import {
  airlineCodes,
  legacyAirlines,
  lowcostAirlines
} from "./airlineCodes.js";
import api from './vue/http.js';

export const seatTypes = {
  M: "Economy",
  W: "Premium Economy",
  C: "Business",
  F: "First Class"
};

export const maxStopsFilterOptions = {
  0: "No Stops",
  1: "One Stop",
  2: "Two Stops"
};

export const userRoles = {
  companion: 1,
  subscriber: 0,
};

export const destinationTypes = {
  round: "Round Trip",
  oneway: "Oneway"
};

export function proceedToBooking(flight) {
  let form = document.createElement("form");
  form.style.visibility = "hidden";
  form.method = "POST";
  form.action = "/retail/";
  let input = document.createElement("input");
  input.name = "retail_info";
  input.value = JSON.stringify(flight);
  form.appendChild(input);
  let token = document.createElement("input");
  token.name = "csrfmiddlewaretoken";
  token.value = csrfmiddlewaretoken;
  form.appendChild(token);
  document.body.appendChild(form);
  form.submit();
}

export function secs2hm(value) {
  const total_minutes = Math.floor(value / 60);
  const minutes = total_minutes % 60;
  const total_hours = Math.floor(total_minutes / 60);
  const hours = total_hours % 24;
  const days = Math.floor(total_hours / 24);
  const days_part = days ? `${days}d ` : "";
  const hours_part = hours ? `${hours}h ` : "";
  return `${days_part}${hours_part}${minutes}m`;
}

export function formatDate(value) {
  return moment.utc(value).format("D MMM");
}

export function formatDateTime(value) {
  return moment.utc(value).format("D MMM hh:mm A");
}

export function formatDateDeals(value) {
  return moment.utc(value).format("MM/DD");
}

export function formatDateFull(value) {
  return moment.utc(value).format("MM/DD/YYYY");
}

export function timeInterval(route) {
  const utc_departure = new Date(route.utc_departure);
  const utc_arrival = new Date(route.utc_arrival);
  const diff = utc_arrival.getTime() - utc_departure.getTime();
  return secs2hm(diff / 1000);
}

export function staticUrl(path) {
  return `${staticUrlValue}${path}`;
}

export function airlineIcon(name) {
  return `${staticUrlValue}images/airlines/${name}.png`;
  // if (airlineCodes.hasOwnProperty(name)) {
  //   return `${staticUrlValue}images/airlines/${name}.png`;
  // } else {
  //   return `${staticUrlValue}images/airlines/FlyLine_Icon.png`;
  // }
}

export function formatTime(value) {
  return moment.utc(value).format("hh:mm A");
}

export function getSpecificRoute(routes, _return, last) {
  const returnValue = _return ? 1 : 0;
  const subroutes = routes.filter(r => r.return === returnValue);
  if (subroutes) {
    if (last) {
      return subroutes[subroutes.length - 1];
    } else {
      return subroutes[0];
    }
  }
}

export function getRetailUrl(bookingToken) {
  return `retail/${bookingToken}`;
}

export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function processLocationSearch(data) {
  const cities = data.locations.filter(o => o.type === "city");
  let airports = data.locations.filter(o => o.type === "airport");
  let result = [];
  for (const city of cities) {
    result.push(city);
    const cityAirports = airports.filter(o => o.city.id === city.id);
    airports = airports.filter(o => o.city.id !== city.id);
    result.push(...cityAirports);
  }
  result.push(...airports);
  return result;
}

export function formatPlace(place) {
  if (!place) return null;
  if (place.type === "airport") {
    return `${place.name} (${place.code})`;
  }
  return `${place.name} ${
    place.subdivision
      ? place.subdivision.name
        ? place.subdivision.name
        : ""
      : ""
  } ${place.country.code}`;
}

export function placeToRequestValue(p) {
  return `${p.type}:${p.code}`;
}

export function locationSearch(term, locationTypes) {
  const searchLocationTypes = {
    city: ["city"],
    airport: ["airport"],
    both: ["city", "airport"]
  }[locationTypes || "both"];
  return new Promise(resolve => {
    let url = "/locations/query/";
    let searchParams = {
      term,
      locale: "en-US",
      location_types: searchLocationTypes,
    };
    api.get(url, {params: searchParams})
      .then(response => resolve(processLocationSearch(response.data)));
  });
}

export function debounce(fn, delay, ...rest) {
  let timeoutID = null;
  return function() {
    clearTimeout(timeoutID);
    let that = this;
    timeoutID = setTimeout(function() {
      fn.apply(that, rest);
    }, delay);
  };
}

export function calculateLayovers(routes) {
  for (let i = 0; i < routes.length - 1; i++) {
    let [prev, next] = [routes[i], routes[i + 1]];
    prev.layover =
      (new Date(next.utc_departure).getTime() -
        new Date(prev.utc_arrival).getTime()) /
      1000;
  }
}

export function getAirlines(flights) {
  let airlines = new Set();
  for (const flight of flights) {
    for (const airline of flight.airlines) {
      airlines.add(airline);
    }
  }
  return [...airlines].sort();
}

export function processFlight(sr) {
  const to_routes = sr.route.filter(r => r.return === 0);
  const return_routes = sr.route.filter(r => r.return === 1);
  calculateLayovers(to_routes);
  calculateLayovers(return_routes);
  const roundtrip = return_routes.length > 0;
  const return_departure = roundtrip ? return_routes[0].local_departure : null;
  return {
    ...sr,
    roundtrip,
    return_departure
  };
}

export function getQuickLinksData(flights) {
  if (flights.length === 0) {
    return {
      price: null,
      duration: null,
      quality: null,
      date: null
    };
  }
  const data = flights.map(f => ({
    price: f.conversion.USD,
    duration: Math.min(
      ...[f.duration.departure, f.duration.return].filter(v => {
        return typeof v === "number";
      })
    ),
    quality: f.quality,
    date: new Date(f.local_departure)
  }));
  return {
    price: data.reduce((prev, curr) => (prev.price < curr.price ? prev : curr)),
    duration: data.reduce((prev, curr) =>
      prev.duration < curr.duration ? prev : curr
    ),
    quality: data.reduce((prev, curr) =>
      prev.quality < curr.quality ? prev : curr
    ),
    date: data.reduce((prev, curr) => (prev.date < curr.date ? prev : curr))
  };
}

export function getSearchURL(form) {
  let formData = new FormData();
  formData.append("fly_from", placeToRequestValue(form.placeFrom));
  formData.append("fly_to", placeToRequestValue(form.placeTo));
  const dateFrom = form.departure_date_data.format("DD/MM/YYYY");
  formData.append("date_from", dateFrom);
  formData.append("date_to", dateFrom);
  formData.append("type", form.destinationTypeId);
  if (form.destinationTypeId === "round") {
    const dateTo = form.return_date_data.format("DD/MM/YYYY");
    formData.append("return_from", dateTo);
    formData.append("return_to", dateTo);
  }
  formData.append("adults", form.valAdults);
  formData.append("infants", form.valInfants);
  formData.append("children", form.valChildren);
  formData.append("selected_cabins", form.seatType);
  if (form.priceRange !== [0, 3000]) {
    const [price_from, price_to] = form.priceRange;
    formData.append("price_from", price_from);
    formData.append("price_to", price_to);
  }
  let selectedAirlines = form.airlines.filter(a => a.checked).map(a => a.code);
  let airlineFilter = form.airlinesFilter
    ? new Set(
        { legacy: legacyAirlines, lowcost: lowcostAirlines }[
          form.airlinesFilter
        ]
      )
    : new Set([]);
  if (airlineFilter.size > 0) {
    if (selectedAirlines.length > 0) {
      selectedAirlines = selectedAirlines.filter(o => airlineFilter.has(o));
    } else {
      selectedAirlines = [...airlineFilter];
    }
  }
  if (selectedAirlines.length !== 0) {
    formData.append("select_airlines", selectedAirlines.join(","));
  }
  if (form.maxStops !== null) {
    formData.append("max_stopovers", form.maxStops);
  }
  if (form.sort !== null) {
    formData.append("sort", form.sort);
  }
  //formData.append("limit", form.limit + form.limitIncrement);
  formData.append("curr", "USD");
  let url = new URL(
    "/api/search",
    window.location
  );
  url.search = new URLSearchParams(formData);
  return url;
}

export function showPopup() {
  $("#search-results-popup").modal();
}

export function pick(a) {
  if (a.length === 0) return null;
  return a[Math.floor(Math.random() * a.length)];
}

export function stripAirlines(name) {
  return name
    .split(" ")
    .filter(o => o.toLowerCase() !== "airlines")
    .join(" ");
}

/**
 * Manually remove boostrap modal overlay
 */
export function removeBModalOverlay() {
  document.body.classList.remove("modal-open");
  document.querySelector(".modal-backdrop").remove();
}

/**
 * Handles user info to localstorage
 */

export const userStorage = {
  keys: {
    token: "authToken",
    tokenExpiry: "authTokenExpiry"
  },

  /**
   * Stores user sesstion to localstorage
   * @param {string} token
   * @param {string} expiry
   */
  setSession(token, expiry) {
    localStorage.setItem(this.keys.token, token);
    localStorage.setItem(this.keys.tokenExpiry, expiry);
  },

  /**
   * @returns {(string|null)}
   */
  get token() {
    return localStorage.getItem(this.keys.token);
  },

  /**
   * @returns {string}
   */
  get tokenExpiry() {
    return localStorage.getItem(this.keys.tokenExpiry);
  },

  /**
   * @returns {boolean}
   */
  get isExpired() {
    return new Date() > this.tokenExpiry;
  },

  /**
   * @returns {boolean}
   */
  get isSessionValid() {
    return this.isExpired || this.token === null ? false : true;
  }
};

export function getAgeCategory(p, singular = false) {
  const birthDate = new Date(p.year, p.month, p.day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age < 3) {
    return singular ? "infant" : "infants";
  }
  if (age < 13) {
    return singular ? "child" : "children";
  }
  return singular ? "adult" : "adults";
}


export function cityThumbnail(city) {
  return `${staticUrlValue}images/cities/${city}.png`
}
