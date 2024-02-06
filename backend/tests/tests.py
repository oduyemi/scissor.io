import string
import asyncio
from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from aiosmtplib import SMTP
from fastapi import HTTPException

from scissor_app import starter


#   U N I T   T E S T S

def test_rate_limiter():
    request = MagicMock()

    @starter.rate_limiter(max_requests=2, time_frame=60)
    def test_function():
        return "Success"

    response = test_function(request)
    assert response == "Success"

    response = test_function(request)
    assert response == "Success"

    with pytest.raises(HTTPException) as context:
        test_function(request)
    assert context.value.status_code == 429


def test_generate_short_url():
    short_url = starter.generate_short_url(length=6)
    assert len(short_url) == 6

    valid_characters = set(string.ascii_letters + string.digits)
    assert set(short_url).issubset(valid_characters)


def test_generate_qr_code():
    data = "test_data"

    starter.generate_qr_code_image = MagicMock(return_value=("path/to/image.png", "base64_image_data"))

    response = starter.generate_qr_code(data)

    assert isinstance(response, starter.StreamingResponse)
    assert response.media_type == "image/png"


def test_send_email_async():
    smtp_mock = MagicMock()
    smtp_mock.login = MagicMock(return_value=None)
    smtp_mock.send_message = MagicMock(return_value=None)

    with unittest.mock.patch('aiosmtplib.SMTP', return_value=smtp_mock):
        asyncio.run(starter.send_email_async("to@example.com", "Subject", "Body"))

    smtp_mock.login.assert_called_once()
    smtp_mock.send_message.assert_called_once()


# INTEGRATION TESTS

def test_endpoints():
    client = TestClient(starter)
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome to scissor.io" in response.json()


def test_database_interaction():
    with TestClient(starter) as client:
        url_to_shorten = "https://github.com/oduyemi"
        response = client.post("/shorten-url", json={"original_url": url_to_shorten})
        assert response.status_code == 200
        assert "original_url" in response.json()
        assert "shortened_url" in response.json()


def test_rate_limiting_integration():
    with TestClient(starter) as client:
        for _ in range(10):
            response = client.get("/check-url/some-url")
        assert response.status_code == 429  # Expect rate limit exceeded


def test_email_sending_integration():
    with TestClient(starter) as client:
        response = client.post("/send-message", json={"name": "John", "email": "john@example.com", "message": "Hello"})
        assert response.status_code == 200
