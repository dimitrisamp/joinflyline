import {airlineCodes} from "./airlineCodes.js";

export const seatTypes = {
  M: "Economy",
  W: "Premium Economy",
  C: "Business",
  F: "First Class"
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
  if (airlineCodes.hasOwnProperty(name)) {
    return `${staticUrlValue}images/airlines/${name}.png`;
  } else {
    return `${staticUrlValue}images/airlines/FlyLine_Icon.png`;
  }
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
    place.subdivision ? place.subdivision.name : ""
  } ${place.country.code}`;
}

export function placeToRequestValue(p) {
  return `${p.type}:${p.code}`
}

export function locationSearch(term, locationTypes) {
  const searchLocationTypes = {
    city: ["city"],
    airport: ["airport"],
    both: ["city", "airport"]
  }[locationTypes || 'both'];
  return new Promise(resolve => {
    let url = new URL("https://kiwicom-prod.apigee.net/locations/query");
    let searchParams = {
      term,
      locale: "en-US",
      location_types: "city"
    };
    let urlSearchParams = new URLSearchParams(searchParams);
    for (const lt of searchLocationTypes) {
      urlSearchParams.append('location_types', lt);
    }
    url.search = urlSearchParams;
    fetch(url, {
      method: "GET",
      headers: {
        apikey: "xklKtpJ5fxZnk4rsDepqOzLUaYYAO9dI"
      },
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(data => resolve(processLocationSearch(data)));
  });
}

export function debounce(fn, delay, ...rest) {
  let timeoutID = null;
  return function () {
    clearTimeout(timeoutID);
    let that = this;
    timeoutID = setTimeout(function () {
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
  const return_departure = roundtrip
    ? return_routes[0].local_departure
    : null;
  return {
    ...sr,
    roundtrip,
    return_departure
  };
}

export function getQuickLinksData(flights) {
  const data = flights.map(f => ({
    price: f.conversion.USD,
    duration: f.duration.total,
    quality: f.quality,
    date: new Date(f.local_departure)
  }));
  return {
    price: data.reduce((prev, curr) =>
      prev.price < curr.price ? prev : curr
    ),
    duration: data.reduce((prev, curr) =>
      prev.duration < curr.duration ? prev : curr
    ),
    quality: data.reduce((prev, curr) =>
      prev.quality < curr.quality ? prev : curr
    ),
    date: data.reduce((prev, curr) => (prev.date < curr.date ? prev : curr))
  };
}
