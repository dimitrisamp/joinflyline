from django_enumfield import enum


class CompanionInviteStatus(enum.Enum):
    created = 0
    email_sent = 1
    active = 2
