from rest_framework import serializers
from .models import User
from utils.hashers import verify_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'master_key_hash']
        extra_kwargs = {
            'master_key_hash': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            master_key_hash=validated_data['master_key_hash']
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    master_key_hash = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        master_key_hash = data.get('master_key_hash')

        if email and master_key_hash:
            try:
                user = User.objects.get(email=email)
                # For login, we compare the hashed values directly since both are hashed
                if user.master_key_hash == master_key_hash:
                    data['user'] = user
                else:
                    raise serializers.ValidationError('Invalid credentials')
            except User.DoesNotExist:
                raise serializers.ValidationError('Invalid credentials')
        else:
            raise serializers.ValidationError('Must include "email" and "master_key_hash".')

        return data
