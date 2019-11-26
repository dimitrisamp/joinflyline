import dataclasses
import datetime
import enum
from typing import List


class FlightStatus(enum.IntEnum):
    not_checked = 0
    invalid = -1
    timeout = -2
    checked = 1


@dataclasses.dataclass
class Trip:
    city_from: str
    city_to: str
    fly_from: str
    fly_to: str
    price: float
    trip_id: str
    dt_departure: datetime.datetime
    dt_return: datetime.datetime
    local_departure: datetime.datetime
    local_return_departure: datetime.datetime
    airlines: List[str]
    booking_token: str
    status: FlightStatus = FlightStatus.not_checked
