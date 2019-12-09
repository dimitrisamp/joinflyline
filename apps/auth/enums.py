from django_enumfield import enum


class Gender(enum.Enum):
    MALE = 0
    FEMALE = 1


class UserRole(enum.Enum):
    SUBSCRIBER = 0
    COMPANION = 1
