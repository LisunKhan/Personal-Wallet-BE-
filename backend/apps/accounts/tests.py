from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import User
from utils.hashers import hash_password

class AccountsAPITests(APITestCase):

    def test_signup_and_login(self):
        """
        Ensure we can create a new user account and then log in.
        """
        # Signup
        signup_url = reverse('signup')
        master_key_hash = hash_password('password123')
        signup_data = {'email': 'test@example.com', 'master_key_hash': master_key_hash}
        response = self.client.post(signup_url, signup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().email, 'test@example.com')

        # Login
        login_url = reverse('login')
        login_data = {'email': 'test@example.com', 'master_key_hash': 'password123'}
        response = self.client.post(login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_invalid_credentials(self):
        """
        Ensure login fails with invalid credentials.
        """
        # Create a user first
        User.objects.create_user(email='test@example.com', password='password123')

        url = reverse('login')
        data = {'email': 'test@example.com', 'master_key_hash': 'wrong_password'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
