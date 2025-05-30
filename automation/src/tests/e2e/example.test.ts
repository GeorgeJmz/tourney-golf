import { PuppeteerHelper } from "../../helpers/puppeteer";
import { testConfig } from "../../config/testConfig";

// describe("Example E2E Test", () => {
//   let puppeteer: PuppeteerHelper;

//   beforeAll(async () => {
//     puppeteer = new PuppeteerHelper();
//     await puppeteer.initialize();
//   });

//   afterAll(async () => {
//     await puppeteer.close();
//   });

//   it("should navigate to the home page", async () => {
//     await puppeteer.navigateTo(testConfig.baseUrl);
//     // Add your assertions here
//   });
// });
// describe("ExampleLogin", () => {
//   let puppeteer: PuppeteerHelper;

//   beforeAll(async () => {
//     puppeteer = new PuppeteerHelper();
//     await puppeteer.initialize();
//   });

//   afterAll(async () => {
//     await puppeteer.close();
//   });

//   it("should login successfully", async () => {
//     await puppeteer.loginAndScreenshot(puppeteer);
//   });
// });
describe("ExampleCreateTournament", () => {
  let puppeteer: PuppeteerHelper;

  beforeAll(async () => {
    puppeteer = new PuppeteerHelper();
    await puppeteer.initialize();
  });

  afterAll(async () => {
    await puppeteer.close();
  });

  // it("should create a team play tournament successfully", async () => {
  //   await puppeteer.createTeamPlayTournament(puppeteer);
  // });
  it("should create a league tournament successfully", async () => {
    await puppeteer.createLeagueTournament(puppeteer);
  }, 50000);
});
