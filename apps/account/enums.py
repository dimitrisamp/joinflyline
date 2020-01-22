from django_enumfield import enum


class CompanionInviteStatus(enum.Enum):
    created = 0
    email_sent = 1
    active = 2


class DWGKind(enum.Enum):
    unknown = -1
    domestic = 0
    international = 1
    private = 2
