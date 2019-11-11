export const AIRLINE_ICONS = {
    "DL": "delta",
    "AS": "alaska",
    "NK": "spirit",
    "B6": "jetblue",
    "F9": "frontier",
    "G4": "allegiant",
    "UA": "united",
    "AA": "american",
    "WN": "southwest",
    "SY": "suncountry",
    "4O": 'interjet',
    "AC": 'air canada',
    "AF": 'Air France',
    "AM": 'Aeroméxico',
    "DI": 'Norwegian Air UK',
    "EK": 'Emirates Airlines',
    "F8": 'Flair Airlines',
    "HU": 'Hainan Airlines',
    "KL": 'KLM',
    "LH": 'Lufthansa',
    "LX": 'Swiss International Air Lines',
    "TS": 'Air Transat',
    "WS": 'WestJet',
    "9C": 'Spring Airlines',
    "AK": 'Air Bridge Carriers',
    "AY": 'Finnair',
    "BA": 'British Airways',
    "BT": 'Air Baltic',
    "CA": 'Air China',
    "CX": 'Cathay Pacific',
    "CZ": 'China Southern Airlines',
    "D7": 'AirAsia X',
    "D8": 'Norwegian Air International',
    "DP": 'First Choice Airways',
    "FR": 'Ryanair',
    "GK": 'Jetstar Japan',
    "GS": 'Tianjin Airlines',
    "HA": 'Hawaiian Airlines',
    "HO": 'Juneyao Airlines',
    "HX": 'Hong Kong Airlines',
    "IB": 'Iberia Airlines',
    "ID": 'Batic Air',
    "MF": 'Xiamen Airlines',
    "MH": 'Malaysia Airlines',
    "MM": 'SAM Colombia',
    "MU": 'China Eastern Airlines',
    "N4": 'Nordwind Airlines',
    "OK": 'Czech Airlines',
    "PC": 'Pegasus Airlines',
    "PR": 'Philippine Airlines',
    "QR": 'Qatar Airways',
    "QZ": 'Indonesia AirAsia',
    "S7": 'S7 Airlines',
    "SK": 'Scandinavian Airlines',
    "SL": 'Thai Lion Mentari',
    "SN": 'Brussels Airlines',
    "SU": 'Aeroflot Russian Airlines',
    "TK": 'Turkish Airlines',
    "TP": 'TAP Portugal',
    "U2": 'easyJet',
    "UX": 'Air Europa',
    "VA": 'Virgin Australia Airlines',
    "VY": 'Vueling Airlines',
    "W6": 'Wizz Air',
    "W9": 'Wizz Air UK',
    "XJ": 'Thai AirAsia X',
    "XW": 'NokScoot',
};

export const seatTypes = {
    'M': 'Economy',
    'W': 'Premium Economy',
    'C': 'Business',
    'F': 'First Class'
};

export const destinationTypes = {
    "round": "Round Trip",
    "oneway": "Oneway"
};

export function proceedToBooking(flight) {
    let form = document.createElement("form");
    form.style.visibility = 'hidden';
    form.method = 'POST';
    form.action = '/retail/';
    let input = document.createElement('input');
    input.name = 'retail_info';
    input.value = JSON.stringify(flight);
    form.appendChild(input);
    let token = document.createElement('input');
    token.name = 'csrfmiddlewaretoken';
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
    const days_part = days ? `${days}d ` : '';
    const hours_part = hours ? `${hours}h ` : '';
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
    if (AIRLINE_ICONS.hasOwnProperty(name)) {
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
    const subroutes = routes.filter((r) => r.return === returnValue);
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
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
