import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { ServiceBuilder } from "selenium-webdriver/chrome.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ quiet: true });

// Test credentials
const TEST_EMAIL = "ramishka@gmail.com";
const TEST_PASSWORD = "111111";

describe("Authentication Tests", function () {
  // Increase timeout for browser operations
  this.timeout(60000);

  let driver;

  beforeEach(async function () {
    console.log("Setting up Chrome browser...");

    // Set up Chrome options
  const options = new chrome.Options();
    options.addArguments("--headless=new");
    options.addArguments("--window-size=1280,900");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--disable-gpu");
  // Ensure isolated user data per test run (fix session not created in CI)
  const userDataDir = join(__dirname, '..', `.tmp-chrome-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  options.addArguments(`--user-data-dir=${userDataDir}`);


    // Set up ChromeDriver service with cross-platform path
    const basePath = join(__dirname, "..", "node_modules", "chromedriver", "lib", "chromedriver");
    const chromeDriverPath = process.platform === 'win32'
      ? join(basePath, 'chromedriver.exe')
      : join(basePath, 'chromedriver');
    console.log("Using ChromeDriver at:", chromeDriverPath);

    const service = new ServiceBuilder(chromeDriverPath);

    try {
      driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .setChromeService(service)
        .build();
      console.log("Chrome browser started successfully");
    } catch (error) {
      console.error("Failed to start Chrome:", error.message);
      throw error;
    }
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it("should login successfully and redirect to dashboard", async function () {
    console.log("Running login test...");

    // 1) Open login page
    await driver.get("http://localhost:5173");

    // 2) Locate inputs by their accessible attributes/placeholder
    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"][placeholder="email"]')),
      10000
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

    // 3) Wait for redirect to /dashboard
    await driver.wait(
      async () => {
        const url = await driver.getCurrentUrl();
        return url.includes("/dashboard");
      },
      15000,
      "Did not navigate to /dashboard in time"
    );

    // 4) Basic UI sanity: wait for some dashboard element to be present
    await driver.wait(
      until.elementLocated(
        By.css(
          'div[class*="MetricsSection"], h3, [data-testid="dashboard-root"]'
        )
      ),
      10000
    );

    console.log("✓ Login successful and redirected to /dashboard");
  });
});
