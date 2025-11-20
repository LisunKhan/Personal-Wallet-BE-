from playwright.sync_api import Page, expect

def test_app(page: Page):
    # Test the signup page
    page.goto("http://localhost:5173/signup")
    expect(page.get_by_role("heading", name="Create Your Account")).to_be_visible()

    # Test the login page
    page.goto("http://localhost:5173/login")
    expect(page.get_by_role("heading", name="Welcome Back!")).to_be_visible()

    page.screenshot(path="/home/jules/verification/verification.png")
