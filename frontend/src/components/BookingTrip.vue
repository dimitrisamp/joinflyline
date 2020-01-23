<template>
  <div class="result-item mb-2 w-100">
    <div
      class="result-block result-toggler w-100 d-block d-md-flex justify-content-start p-2 pt-3 pb-3"
      @click="toggleCollapsed"
    >
      <div
        class="price-block d-flex align-items-center justify-content-center pl-3 pr-3"
      >
        <div>
          <h5>$ {{ flight.price }}</h5>
          <p class="small">{{ formatPassengerCountByCategory() }}</p>
        </div>
      </div>
      <div
        v-if="flight.roundtrip"
        class="flight-info-block d-flex flex-column w-100"
      >
        <div class="departure-row d-flex justify-content-start">
          <div class="airline-logo-holder d-flex">
            <div
              v-for="(route, i) in departureFlights"
              :key="`departure-${i}`"
              class="img-airline"
            >
              <div class="airline">
                <img
                  :src="airlineIcon(route.airline.code)"
                  :alt="route.airline.code"
                  style="width:25px; margin-right: 4px; margin-top: 4px;"
                />
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-around w-100">
            <div class="">
              <label class="mb-0">
                <strong>
                  {{ formatTime(flight.local_departure) }} -
                  {{ formatTime(flight.local_arrival) }}
                </strong>
              </label>
              <br />
              <span class="small">
                {{ flight.cityFrom }}
                <i class="fa fa-long-arrow-right mr-1 ml-1" />
                {{ flight.cityTo }}
              </span>
            </div>
            <div class="">
              <label class="mb-0">
                <strong>{{ formatDate(flight.local_departure) }}</strong>
              </label>
              <br />
              <span class="small">{{
                secs2hm(flight.duration.departure)
              }}</span>
            </div>
            <div></div>
          </div>
        </div>
        <div
          class="flight-divider d-flex justify-content-start text-left mt-2 mb-2"
        >
          <span
            style="width: 50px; border-bottom: 1px solid silver; height: 12px;"
          />
          <p class="small mb-0 ml-3">
            Stays about {{ flight.nightsInDest }} days in {{ flight.cityTo }}
          </p>
        </div>

        <div class="arrival-row d-flex justify-content-start">
          <div class="airline-logo-holder d-flex">
            <div
              v-for="(route, i) in returnFlights"
              :key="`return-flight-${i}`"
              class="img-airline"
            >
              <div class="airline">
                <img
                  :src="airlineIcon(route.airline.code)"
                  :alt="route.airline"
                  style="width:25px; margin-right: 4px; margin-top: 4px;"
                />
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-around w-100">
            <div class="">
              <label class="mb-0"
                ><strong>
                  {{
                    formatTime(
                      getSpecificRoute(flight.flights, true, false)
                        .local_departure
                    )
                  }}
                  -
                  {{
                    formatTime(
                      getSpecificRoute(flight.flights, true, true).local_arrival
                    )
                  }}
                </strong></label
              >
              <br />
              <span class="small">
                {{ flight.cityTo }}
                <i class="fa fa-long-arrow-right mr-1 ml-1" />
                {{ flight.cityFrom }}
              </span>
            </div>
            <div class="">
              <label class="mb-0">
                <strong>
                  {{
                    formatDate(
                      flight.flights[flight.flights.length - 1].local_departure
                    )
                  }}
                </strong>
              </label>
              <br />
              <span class="small">{{ secs2hm(flight.duration.return) }}</span>
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <div
        v-if="!flight.roundtrip"
        class="flight-info-block d-flex flex-column w-100"
      >
        <div class="departure-row d-flex justify-content-start">
          <div class="airline-logo-holder d-flex">
            <div
              v-for="airline in flight.airlines"
              class="img-airline"
              :key="airline.code"
            >
              <div class="airline">
                <img
                  :src="airlineIcon(airline.code)"
                  :alt="airline"
                  style="width:25px; margin-right: 4px;"
                />
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-around w-100">
            <div class="">
              <label class="mb-0">
                <strong>
                  {{ formatTime(flight.local_departure) }} -
                  {{ formatTime(flight.local_arrival) }}
                </strong>
              </label>
              <br />
              <span class="small">
                {{ flight.cityFrom }}
                <i class="fa fa-long-arrow-right mr-1 ml-1" />
                {{ flight.cityTo }}
              </span>
            </div>
            <div class="">
              <label class="mb-0">
                <strong>{{ formatDate(flight.local_departure) }}</strong>
              </label>
              <br />
              <span class="small">{{ timeInterval(flight) }}</span>
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <div
        class="arrow-indicator p-2 pt-3 pr-md-5 d-flex align-items-center justify-content-center"
      >
        <img
          :src="
            !collapsed
              ? require('@/assets/images/icons/up-arrow.png')
              : require('@/assets/images/icons/down-arrow.png')
          "
          alt="Pull down"
          height="15"
        />
      </div>
    </div>

    <div v-if="!collapsed" class="result-details container-fluid">
      <hr class="m-0" />

      <div class="route-box row">
        <div class="col-12 col-md-6 departure-block border-right pt-4 pb-4">
          <h6 class="mb-3">
            DEPARTURE
            <span class="small ml-2">Duration:</span>
            <span class="small">{{ secs2hm(flight.duration.departure) }}</span>
          </h6>
          <p class="mb-2 dark-text">
            <strong class="">
              <i class="fa fa-calendar mr-2" />
              {{ formatDate(flight.local_departure) }}
            </strong>
          </p>
          <div
            v-for="(route, routeIndex) in departureFlights"
            :key="`route-${routeIndex}`"
          >
            <div class="d-flex align-items-center position-relative">
              <i class="fa fa-plane mr-2 w-10 rotated-plane-icon" />
              <div class="card w-100 cursor-pointer">
                <div class="card-body p-0">
                  <div class="d-flex justify-content-between pl-2">
                    <div class="mr-auto">
                      <div class="airlines-labels">
                        <label class="mb-0">
                          <span class="dark-text list-f">{{
                            formatTime(route.local_departure)
                          }}</span>
                          <span class="s-arrow"
                            >{{ route.cityFrom }} {{ route.flyFrom }}</span
                          >
                        </label>
                        <br />
                        <label class="mb-0">
                          <span class="dark-text list-f">{{
                            formatTime(route.local_arrival)
                          }}</span>
                          <span>{{ route.cityTo }} {{ route.flyTo }}</span>
                        </label>
                      </div>
                    </div>
                    <div class="d-flex">
                      <img
                        :src="airlineIcon(route.airline.code)"
                        alt="Airline"
                        class="align-self-center"
                        height="32px"
                      />
                    </div>
                    <div class="col-1 text-right d-flex">
                      <img
                        :src="require('@/assets/images/arrow.png')"
                        style="width: 10px; height: 5px;"
                        class="align-self-center"
                        alt="arrow"
                      />
                    </div>
                  </div>
                </div>
                <div class="card-footer collapse">
                  <span class="small mb-4">FLIGHT INFO</span>
                  <div class="d-inline-flex justify-content-between w-100">
                    <label>Flight No.</label>
                    <label class="text-grey">{{ route.flight_no }} </label>
                  </div>
                  <div class="d-inline-flex justify-content-between w-100">
                    <label>Seats Remaining</label>
                    <label class="text-grey">{{
                      flight.availability.seats
                    }}</label>
                  </div>
                </div>
              </div>
              <span class="position-absolute duration-indicator small">{{
                timeInterval(route)
              }}</span>
            </div>
            <div v-if="route.layover" class="d-flex pt-3 pl-4 pb-3">
              <i class="fa fa-clock-o mr-2" />
              <p class="small mb-0">{{ secs2hm(route.layover) }} layover</p>
            </div>
          </div>
          <div v-if="flight.roundtrip" class="d-flex pt-3 pl-4 pb-3">
            <i class="fa fa-bed mr-2" />
            <p class="small mb-0">
              {{ flight.nightsInDest }} nights in {{ flight.cityTo }}
            </p>
          </div>
        </div>
        <!-----------Return Flights ------------------------>
        <div v-if="flight.roundtrip" class="col-12 col-md-6 return-block pt-4">
          <h6 class="mb-3">
            RETURN
            <span class="small ml-2">Duration:</span>
            <span class="small">{{ secs2hm(flight.duration.return) }}</span>
          </h6>
          <p class="mb-2 dark-text">
            <strong class="">
              <i class="fa fa-calendar mr-2" />
              {{ formatDate(flight.return_departure) }}
            </strong>
          </p>
          <div
            v-for="(route, routeIndex) in returnFlights"
            :key="`route-${routeIndex}`"
          >
            <div class="d-flex align-items-center position-relative">
              <i class="fa fa-plane mr-2 w-10 rotated-plane-icon" />
              <div
                class="card w-100 cursor-pointer"
                data-toggle="collapse"
                data-target="#airplane3"
              >
                <div class="card-body p-0">
                  <div class="d-flex justify-content-between pl-2">
                    <div class="mr-auto">
                      <div class="airlines-labels">
                        <label class="mb-0">
                          <span class="dark-text list-f">{{
                            formatTime(route.local_departure)
                          }}</span>
                          <span class="s-arrow">
                            {{ route.cityFrom }} {{ route.flyFrom }}
                            <i class="fa fa-long-arrow-right" />
                          </span>
                        </label>
                        <br />
                        <label class="mb-0">
                          <span class="dark-text list-f">{{
                            formatTime(route.local_arrival)
                          }}</span>
                          <span>{{ route.cityTo }} {{ route.flyTo }}</span>
                        </label>
                      </div>
                    </div>
                    <div class="d-flex">
                      <img
                        :src="airlineIcon(route.airline.code)"
                        alt="Airline"
                        class="align-self-center"
                        height="32px"
                      />
                    </div>
                    <div class="col-1 text-right d-flex">
                      <img
                        :src="require('@/assets/images/arrow.png')"
                        style="width: 10px; height: 5px;"
                        class="align-self-center"
                        alt="arrow"
                      />
                    </div>
                  </div>
                </div>
                <div class="card-footer collapse" id="airplane3">
                  <span class="small mb-4">FLIGHT INFO</span>
                  <div class="d-inline-flex justify-content-between w-100">
                    <label>Flight No.</label>
                    <label class="text-grey">{{ route.flight_no }} </label>
                  </div>
                  <div class="d-inline-flex justify-content-between w-100">
                    <label>Seats Remaining</label>
                    <label class="text-grey"
                      >{{ flight.availability.seats }}
                    </label>
                  </div>
                </div>
              </div>
              <span class="position-absolute duration-indicator small">{{
                timeInterval(route)
              }}</span>
            </div>
            <div v-if="route.layover" class="d-flex pt-3 pl-4 pb-3">
              <i class="fa fa-clock-o mr-2" />
              <p class="small mb-0">{{ secs2hm(route.layover) }} layover</p>
            </div>
          </div>
        </div>
        <!-------------End Return flights------------------->
      </div>
    </div>
  </div>
</template>

<script>
import {
  airlineIcon,
  formatDate,
  formatTime,
  getRetailUrl,
  getSpecificRoute,
  secs2hm,
  timeInterval
} from "../utils/utils";

export default {
  delimiters: ["{{", "}}"],
  props: ["flight"],
  data() {
    return {
      collapsed: true
    };
  },
  computed: {
    returnFlights() {
      return this.flight.flights.filter(o => o.return === 1);
    },
    departureFlights() {
      return this.flight.flights.filter(o => o.return === 0);
    }
  },
  methods: {
    formatPassengerCountByCategory() {
      const passengers = this.flight.passengers;
      const valAdults = passengers.filter(o => o.category === "adults").length;
      const valChildren = passengers.filter(o => o.category === "children")
        .length;
      const valInfants = passengers.filter(o => o.category === "infants")
        .length;
      const adultsText =
        valAdults === 0 ? "" : `${valAdults} Adult${valAdults > 1 ? "s" : ""}`;
      const childrenText =
        valChildren === 0
          ? ""
          : `${valChildren} Child${valChildren > 1 ? "ren" : ""}`;
      const infantsText =
        valInfants === 0
          ? ""
          : `${valInfants} Infant${valInfants > 1 ? "s" : ""}`;
      return [adultsText, childrenText, infantsText]
        .filter(v => v.length > 0)
        .join(", ");
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    airlineIcon,
    formatDate,
    formatTime,
    getRetailUrl,
    getSpecificRoute,
    secs2hm,
    timeInterval
  }
};
</script>
