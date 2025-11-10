import pytest
from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)

def test_get_activities():
    response = client.get("/activities")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert "Chess Club" in data

def test_signup_success():
    response = client.post("/activities/Chess Club/signup?email=testuser@mergington.edu")
    assert response.status_code == 200
    data = response.json()
    assert "Signed up testuser@mergington.edu for Chess Club" in data["message"]
    assert "testuser@mergington.edu" in data["participants"]

def test_signup_duplicate():
    # First signup
    client.post("/activities/Programming Class/signup?email=duplicate@mergington.edu")
    # Duplicate signup
    response = client.post("/activities/Programming Class/signup?email=duplicate@mergington.edu")
    assert response.status_code == 400
    data = response.json()
    assert "already signed up" in data["detail"]

def test_signup_activity_not_found():
    response = client.post("/activities/Nonexistent/signup?email=someone@mergington.edu")
    assert response.status_code == 404
    data = response.json()
    assert "Activity not found" in data["detail"]

def test_signup_no_email():
    response = client.post("/activities/Chess Club/signup?email=")
    assert response.status_code == 400
    data = response.json()
    assert "Email is required" in data["detail"]
