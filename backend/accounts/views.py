import random
from django.conf import settings
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer, OTPSerializer
from django.contrib.auth import authenticate, get_user_model
from rest_framework.authtoken.models import Token  # For Token Authentication (optional)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .models import PastDisaster
from .serializers import PastDisasterSerializer
from rest_framework.pagination import PageNumberPagination


User = get_user_model()

class CheckAuthView(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this endpoint

    def get(self, request):
        return Response({"isAuthenticated": True}, status=200)
    
class SignupView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        otp = random.randint(100000, 999999)

        # Debugging: Log email and generated OTP
        print(f"Signup request received for email: {email}")
        print(f"Generated OTP: {otp}")

        # Save OTP for the user
        request.session[email] = str(otp)
        request.session.save()

        # Debugging: Log session storage status
        print(f"Stored OTP in session for {email}: {request.session.get(email)}")

        try:
            # Send OTP email
            send_mail(
                "Your OTP Code",
                f"Your OTP code is {otp}",
                settings.DEFAULT_FROM_EMAIL,  # Use the default sender email from settings.py
                [email],
            )
            # Debugging: Log email success
            print(f"OTP email sent to: {email}")
        except Exception as e:
            # Debugging: Log email failure
            print(f"Failed to send OTP email to {email}. Error: {str(e)}")
            return Response({"error": "Failed to send OTP email. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "OTP sent to email"}, status=status.HTTP_200_OK)


class OTPVerificationView(APIView):
    def post(self, request):
        serializer = OTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']

            print(f"Session ID: {request.session.session_key}")
            print(f"Session Data: {request.session.items()}")  # Print all session data
            print(f"Stored OTP for {email}: {request.session.get(email)}")
            print(f"Provided OTP: {otp}")
            
            if request.session.get(email) == str(otp):
                User.objects.create_user(email=email, password=request.data['password'])
                return Response({"message": "Signup successful"}, status=status.HTTP_201_CREATED)
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)



class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = random.randint(100000, 999999)
        request.session[email] = str(otp)

        # Send OTP email for password reset
        send_mail(
            "Your Password Reset OTP",
            f"Your OTP code is {otp}",
            settings.DEFAULT_FROM_EMAIL,  # Use the default sender email from settings.py
            [email],
        )

        return Response({"message": "OTP sent to email"}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('password')

        if request.session.get(email) == otp:
            try:
                user = User.objects.get(email=email)
                user.set_password(new_password)
                user.save()
                return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Debugging: Log the received email (avoid logging passwords)
        print(f"Received login request for email: {email}")

        # Authenticate user using the email field (not username)
        user = authenticate(request, username=email, password=password)

        if user is not None:
            # Debugging: Log success
            print(f"Authentication successful for email: {email}")

            # Create or get an authentication token for the user
            token, created = Token.objects.get_or_create(user=user)  # This line is corrected

            # Debugging: Log token creation
            print(f"Token created: {created}, Token: {token.key}")

            return Response({
                "token": token.key,  # Send the token in the response
                "message": "Login successful"
            }, status=status.HTTP_200_OK)
        else:
            # Debugging: Log failure
            print(f"Authentication failed for email: {email}. Invalid email or password.")
            
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
        
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000

class PastDisasterList(generics.ListAPIView):
    queryset = PastDisaster.objects.all()
    serializer_class = PastDisasterSerializer
    pagination_class = StandardResultsSetPagination