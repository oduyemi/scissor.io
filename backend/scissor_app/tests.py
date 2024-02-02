import unittest
from unittest.mock import MagicMock
from datetime import datetime, timedelta
from . import routes, starter
from fastapi.testclient import TestClient
from scissor_app.starter import starter
from scissor_app.dependencies import get_db



#    U  N  I  T       T  E  S  T

class TestRateLimiter(unittest.TestCase):

    def test_rate_limiter(self):
        request = MagicMock()
        
        @starter.rate_limiter(max_requests=2, time_frame=60)
        def test_function():
            return "Success"

        response = test_function(request)
        self.assertEqual(response, "Success")

        response = test_function(request)
        self.assertEqual(response, "Success")

        with self.assertRaises(starter.HTTPException) as context:
            test_function(request)
        self.assertEqual(context.exception.status_code, 429)


class TestGenerateShortURL(unittest.TestCase):

    def test_generate_short_url(self):
        short_url = starter.generate_short_url(length=6)
        self.assertEqual(len(short_url), 6)

        valid_characters = set(string.ascii_letters + string.digits)
        self.assertTrue(set(short_url).issubset(valid_characters))


class TestGenerateQRCode(unittest.TestCase):

    def test_generate_qr_code(self):
        data = "test_data"

        starter.generate_qr_code_image = MagicMock(return_value=("path/to/image.png", "base64_image_data"))

        response = starter.generate_qr_code(data)

        self.assertIsInstance(response, starter.StreamingResponse)
        self.assertEqual(response.media_type, "image/png")

class TestSendEmailAsync(unittest.TestCase):

    def test_send_email_async(self):
        smtp_mock = MagicMock()
        smtp_mock.login = MagicMock(return_value=None)
        smtp_mock.send_message = MagicMock(return_value=None)

        with unittest.mock.patch('aiosmtplib.SMTP', return_value=smtp_mock):
            asyncio.run(starter.send_email_async("to@example.com", "Subject", "Body"))

        smtp_mock.login.assert_called_once()
        smtp_mock.send_message.assert_called_once()





#    I  N  T  E  G  R  A  T  I  O  N      T  E  S  T


class TestIntegration(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(starter)

    def test_endpoints(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Welcome to scissor.io", response.json())

    def test_database_interaction(self):
        with TestClient(starter) as client:
            url_to_shorten = "https://github.com/oduyemi"
            response = client.post("/shorten-url", json={"original_url": url_to_shorten})
            self.assertEqual(response.status_code, 200)
            self.assertIn("original_url", response.json())
            self.assertIn("shortened_url", response.json())


    def test_rate_limiting_integration(self):
        with TestClient(starter) as client:
            for _ in range(10):
                response = client.get("/check-url/some-url")
            self.assertEqual(response.status_code, 429)  # Expect rate limit exceeded


    def test_email_sending_integration(self):
        with TestClient(starter) as client:
            response = client.post("/send-message", json={"name": "John", "email": "john@example.com", "message": "Hello"})
            self.assertEqual(response.status_code, 200)