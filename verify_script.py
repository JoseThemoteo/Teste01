from playwright.sync_api import sync_playwright

def run_cuj(page):
    # Navigate to app
    page.goto("http://localhost:5173")
    page.wait_for_timeout(1000)

    # 1. Schedule an appointment as Patient
    # Select date or nutritionist if needed
    page.wait_for_timeout(500)

    # Click on an available time slot (e.g. 08:00 or 09:00)
    page.get_by_role("button", name="08:00").first.click()
    page.wait_for_timeout(500)

    # Click confirm booking button
    page.get_by_role("button", name="Confirmar Agendamento").click()
    page.wait_for_timeout(1000)

    # Take screenshot of patient booking
    page.screenshot(path="/home/jules/verification/screenshots/patient_booking.png")

    # Switch to Nutritionist view
    page.get_by_role("button", name="Nutricionista").click()
    page.wait_for_timeout(1000)

    # Block a slot
    page.get_by_role("button", name="Bloquear").first.click()
    page.wait_for_timeout(1000)

    # Switch to DB Schema tab
    page.get_by_role("button", name="Banco de Dados & Tech").click()
    page.wait_for_timeout(1000)

    # Take final screenshot
    page.screenshot(path="/home/jules/verification/screenshots/verification.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
