from playwright.sync_api import Page, expect

def test_app(page: Page):
    page.goto("http://localhost:5173")
    expect(page.get_by_role("heading", name="Signup")).to_be_visible()
    expect(page.get_by_role("heading", name="Login")).to_be_visible()
    page.screenshot(path="/home/jules/verification/verification.png")
