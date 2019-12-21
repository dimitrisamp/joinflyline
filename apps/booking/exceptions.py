class ClientException(Exception):
    pass


class StatusErrorException(ClientException):
    pass


class FlightsInvalidException(ClientException):
    pass


class FlightsNotCheckedYetException(ClientException):
    pass
