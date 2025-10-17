import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { ServiceBuilder } from "selenium-webdriver/chrome.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ quiet: true });

// Config
const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:5173";

// Test credentials (must exist and have permission to create machines)
const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

describe("Machines - Create Machine E2E", function () {
  this.timeout(90000);
  let driver;

  before(async function () {
    const options = new chrome.Options();
    // options.addArguments("--headless=new"); // Uncomment for CI use
    options.addArguments("--window-size=1280,900");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--disable-gpu");

    // Create a guaranteed unique temporary Chrome user data directory
    const userDataDir = fs.mkdtempSync(join(os.tmpdir(), "chrome-profile-"));
    options.addArguments(`--user-data-dir=${userDataDir}`);

    // Explicit chromedriver path (local dependency, cross-platform)
    const basePath = join(
      __dirname,
      "..",
      "node_modules",
      "chromedriver",
      "lib",
      "chromedriver"
    );
    const chromeDriverPath =
      process.platform === "win32"
        ? join(basePath, "chromedriver.exe")
        : join(basePath, "chromedriver");
    const service = new ServiceBuilder(chromeDriverPath);

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .setChromeService(service)
      .build();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  async function login() {
    await driver.get(APP_BASE_URL);

    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"][placeholder="email"]')),
      15000
    );
    const pwdInput = await driver.findElement(
      By.css('input[type="password"][placeholder="password"]')
    );
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));

    await emailInput.clear();
    await emailInput.sendKeys(TEST_EMAIL);
    await pwdInput.clear();
    await pwdInput.sendKeys(TEST_PASSWORD);
    await submitBtn.click();

    await driver.wait(
      async () => (await driver.getCurrentUrl()).includes("/dashboard"),
      20000,
      "Did not navigate to /dashboard after login"
    );
  }

  it("should create a new machine and show it in the list", async function () {
    // 1) Login first
    await login();

    // 2) Navigate to machines page
    await driver.get(`${APP_BASE_URL}/dashboard/machines`);

    // 3) Click the Create button (supports both toolbar 'new' and empty-state 'Create Machine')
    const createButtonXpath =
      "//button[normalize-space(.)='new' or contains(normalize-space(.), 'Create Machine')]";
    const createButton = await driver.wait(
      until.elementLocated(By.xpath(createButtonXpath)),
      15000
    );
    await driver.wait(until.elementIsVisible(createButton), 10000);
    await createButton.click();

    // 4) Fill the modal form
    const uniqueTitle = `AutoTest Machine ${Date.now()}`;
    const titleInput = await driver.wait(
      until.elementLocated(
        By.css('input[type="text"][placeholder="Enter machine title..."]')
      ),
      15000
    );
    await driver.wait(until.elementIsVisible(titleInput), 10000);
    await titleInput.clear();
    await titleInput.sendKeys(uniqueTitle);

    // Choose a division
    const divisionDropdownBtn = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//label[normalize-space(.)='Division']/following::button[@aria-haspopup='listbox'][1]"
        )
      ),
      10000
    );
    await driver.wait(until.elementIsVisible(divisionDropdownBtn), 10000);
    await divisionDropdownBtn.click();

    await driver.wait(
      until.elementLocated(By.css('div[role="listbox"]')),
      10000
    );

    const optionButtons = await driver.findElements(
      By.css('div[role="listbox"] button[role="option"]')
    );

    if (!optionButtons || optionButtons.length === 0) {
      throw new Error(
        "No divisions available to select. Please seed at least one division for this test."
      );
    }

    await optionButtons[0].click();

    // 5) Submit
    const submitCreateBtn = await driver.findElement(
      By.xpath("//button[normalize-space(.)='Create Machine']")
    );
    await submitCreateBtn.click();

    // 6) Wait for modal close and confirm the new machine appears
    try {
      await driver.wait(until.stalenessOf(titleInput), 10000);
    } catch (_) {
      // If it didn't stale, continue; list may have updated in background
    }

    const newMachineLocator = By.xpath(
      `//*[contains(normalize-space(.), "${uniqueTitle}")]`
    );
    await driver.wait(until.elementLocated(newMachineLocator), 20000);
    const newMachineEl = await driver.findElement(newMachineLocator);
    await driver.wait(until.elementIsVisible(newMachineEl), 10000);

    console.log(`✓ Machine "${uniqueTitle}" created successfully`);
  });
});
