import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { ServiceBuilder } from "selenium-webdriver/chrome.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ quiet: true });

const TEST_EMAIL = "ramishka@gmail.com";
const TEST_PASSWORD = "111111";

describe("Authentication Tests", function () {
  this.timeout(60000);
  let driver;

  before(async function () {
    console.log("Setting up Chrome browser...");

    const options = new chrome.Options();
    // options.addArguments("--headless=new"); // Uncomment for CI
    options.addArguments("--window-size=1280,900");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--disable-gpu");

    // no user-data-dir -> Chrome handles its own temp profile
    // you can leave it out entirely for reliability

    const basePath = join(__dirname, "..", "node_modules", "chromedriver", "lib", "chromedriver");
    const chromeDriverPath = process.platform === "win32"
      ? join(basePath, "chromedriver.exe")
      : join(basePath, "chromedriver");
    console.log("Using ChromeDriver at:", chromeDriverPath);

    const service = new ServiceBuilder(chromeDriverPath);

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .setChromeService(service)
      .build();
    console.log("Chrome browser started successfully");
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it("should login successfully and redirect to dashboard", async function () {
    console.log("Running login test...");

    await driver.get("http://localhost:5173");

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

    await driver.wait(
      async () => (await driver.getCurrentUrl()).includes("/dashboard"),
      15000,
      "Did not navigate to /dashboard in time"
    );

    await driver.wait(
      until.elementLocated(By.css('div[class*="MetricsSection"], h3, [data-testid="dashboard-root"]')),
      10000
    );

    console.log("✓ Login successful and redirected to /dashboard");
  });
});
