from django.urls import path
from .views import SignupView, OTPVerificationView, ForgotPasswordView, ResetPasswordView, LoginView, CheckAuthView ,PastDisasterList

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('verify-otp/', OTPVerificationView.as_view(), name='verify_otp'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('login/', LoginView.as_view(), name='login'),
    path('api/check-auth', CheckAuthView.as_view(), name='check-auth'),
    path('api/past-disasters/', PastDisasterList.as_view(), name='past-disasters'),
]