from rest_framework import serializers
from .models import User , PastDisaster

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

class OTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

class PastDisasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = PastDisaster
        fields = '__all__'  # Include all fields