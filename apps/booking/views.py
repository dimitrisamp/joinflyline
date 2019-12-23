from rest_framework.exceptions import ValidationError

from apps.account.actions import create_subscriber
from apps.auth.models import User
from django.http import JsonResponse
from django.views import View
from django.conf import settings
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework_proxy.views import ProxyView

from apps.booking.actions import save_booking
from apps.booking.exceptions import ClientException


class CheckFlightsView(ProxyView):
    permission_classes = [AllowAny]
    source = "v2/booking/check_flights"


class LocationQueryView(ProxyView):
    permission_classes = [AllowAny]
    source = "locations/query"


class FlightSearchView(ProxyView):
    permission_classes = [AllowAny]
    source = "v2/search"


class CheckPromoView(View):
    def get(self, request):
        promocode = request.GET.get("promocode")
        if promocode.lower() == "abcdef":  # TODO: make promocode available in database
            return JsonResponse({"discount": 10})
        else:
            return JsonResponse({"discount": 0})


class SaveBookingView(APIView):
    permission_classes = [AllowAny]

    def is_test_request(self, data):
        fp = data["passengers"][0]
        return (fp["name"].lower(), fp["surname"].lower()) == ("test", "test")

    def post(self, request):
        data = request.data
        if not self.request.user.is_authenticated:
            user_by_email = User.objects.filter(email=data["payment"]["email"]).first()
            user_by_phone = User.objects.filter(phone_number=data["payment"]["phone"])
            if user_by_email or user_by_phone:
                raise ValidationError(
                    "Account exists, login required", code="user-exists-login-required"
                )
            else:
                upgrade_to_plan = data.pop("upgrade_to_plan", None)
                if upgrade_to_plan:
                    if upgrade_to_plan not in settings.PLAN_DEFINITIONS:
                        raise ValidationError(
                            f"Cannot upgrade to plan: {upgrade_to_plan}",
                            code="bad-plan"
                        )
                search_form = data.pop("searchForm", {})
                user = create_subscriber(
                    email=data["payment"]["email"],
                    password=None,
                    first_name=data["passengers"][0]["name"],
                    last_name=data["passengers"][0]["surname"],
                    market=search_form.get("placeFrom"),
                    card_number=data["payment"]["card_number"],
                    expiry=data["payment"]["expiry"],
                    cvc=data["payment"]["credit_card_cvv"],
                    phone_number=data["payment"]["phone"],
                    plan=upgrade_to_plan,
                )

        else:
            user = request.user
        try:
            save_booking(user, data, zooz=True, test=self.is_test_request(data))
        except ClientException as e:
            return JsonResponse(e.args, status=400)
        return JsonResponse({})


