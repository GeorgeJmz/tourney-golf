import puppeteer, { Browser, Page, Mouse } from "puppeteer";

export class PuppeteerHelper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private mouse: Mouse | null = null;

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    this.page = await this.browser.newPage();
    this.mouse = this.page.mouse;
    return this.page;
  }
  async navigateTo(url: string) {
    if (!this.page) {
      throw new Error("Browser not initialized");
    }
    await this.page.goto(url, { waitUntil: "networkidle0" });
  }

  async getElementText(selector: string): Promise<string> {
    if (!this.page) {
      throw new Error("Browser not initialized");
    }
    return await this.page.$eval(selector, (el) => el.textContent || "");
  }

  async clickElement(selector: string) {
    if (!this.page) {
      throw new Error("Browser not initialized");
    }
    await this.page.click(selector);
  }

  async typeText(selector: string, text: string) {
    if (!this.page) {
      throw new Error("Browser not initialized");
    }
    await this.page.type(selector, text);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  async setViewport(width: number, height: number) {
    if (!this.page) {
      throw new Error("Browser not initialized");
    }
    await this.page.setViewport({ width, height });
  }

  async waitForSelector(selector: string) {
    if (!this.page) {
      throw new Error("Browser not initialized");
    }
    await this.page.waitForSelector(selector);
  }

  async waitForNavigation() {
    if (!this.page) {
      throw new Error("Browser not initialized");
    }
    await this.page.waitForNavigation({ waitUntil: "networkidle2" });
  }

  async takeScreenshot(path: string) {
    if (!this.page) {
      throw new Error("Browser not initialized");
    }
    await this.page.screenshot({ path, fullPage: true });
  }

  async loginAndScreenshot(helper: PuppeteerHelper) {
    try {
      await helper.login("jeckox@gmail.com", "Password12345");
      console.log(
        "Login exitoso, esperando a que la página cargue completamente..."
      );

      // Esperar un momento adicional para asegurarse de que todo el contenido esté cargado
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Tomando captura de pantalla...");
      await helper.takeScreenshot("login_screenshot.png");

      console.log("¡Captura de pantalla guardada como login_screenshot.png!");
    } catch (error) {
      console.error("Ocurrió un error:", error);
      throw error;
    }
  }

  async createTournament(helper: PuppeteerHelper) {
    try {
      const tournamentName = "Tournament Name";
      await helper.login("jeckox@gmail.com", "Password12345");
      await helper.clickElement('a[href="/create-tournament"]');
      await helper.waitForSelector("form");
      await helper.typeText('input[name="name"]', tournamentName);

      await helper.clickElement('div[id="select-type"]');
      await helper.clickElement('li[data-value="teamplay"]');
      await new Promise((resolve) => setTimeout(resolve, 800));

      await helper.clickElement('div[id="select-playType"]');
      await helper.clickElement('li[data-value="stableford"]');
      await new Promise((resolve) => setTimeout(resolve, 800));

      await helper.clickElement(
        'button[data-testid="save-and-next-step-league-setup"]'
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // await this.page?.focus("input[name=\"numberOfStages\"]");
      // await this.page?.keyboard.press("Backspace");
      // await helper.typeText("input[name=\"numberOfStages\"]", "2");
      // await new Promise((resolve) => setTimeout(resolve, 800));

      const numberOfStagesInput = await this.page?.waitForSelector(
        'input[name="numberOfStages"]'
      );
      await numberOfStagesInput?.click({ clickCount: 3 });
      await numberOfStagesInput?.type("2");
      await new Promise((resolve) => setTimeout(resolve, 3000));

      await helper.clickElement(
        'button[data-testid="save-and-next-step-rules-setup"]'
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));

      await helper.typeText('input[name="name"]', "Adrian");
      await new Promise((resolve) => setTimeout(resolve, 800));

      await helper.typeText('input[name="email"]', "jeckox@gmail.com");
      await new Promise((resolve) => setTimeout(resolve, 800));

      await helper.clickElement('button[data-testid="add-player"]');
      await new Promise((resolve) => setTimeout(resolve, 800));

      await helper.typeText('input[name="name"]', "Test");
      await new Promise((resolve) => setTimeout(resolve, 800));

      await helper.typeText('input[name="email"]', "test1@gmail.com");
      await new Promise((resolve) => setTimeout(resolve, 800));

      await helper.clickElement('button[data-testid="add-player"]');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await helper.clickElement(
        'button[data-testid="save-and-next-step-player-setup"]'
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await helper.clickElement('div[id="select-Teams"]');
      await new Promise((resolve) => setTimeout(resolve, 800));

      await helper.clickElement('li[data-value="2"]');
      await new Promise((resolve) => setTimeout(resolve, 800));

      await helper.clickElement(
        'button[data-testid="save-and-next-step-teams-setup"]'
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await helper.dragAndDrop(
        'div[id="jeckox@gmail.com-card"]',
        'div[id="team1-droppable"]'
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await helper.dragAndDrop(
        'div[id="test1@gmail.com-card"]',
        'div[id="team2-droppable"]'
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await helper.clickElement(
        'button[data-testid="save-and-next-step-teams-setup"]'
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));

      await helper.clickElement(
        'button[data-testid="save-and-finish-league-setup"]'
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await helper.clickElement('button[data-testid="done-setup"]');
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await helper.takeScreenshot("tournament_created.png");

      console.log("Torneo creado exitosamente");
    } catch (error) {
      console.error("Ocurrió un error:", error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    await this.navigateTo("http://localhost:3000/");
    await this.clickElement('a[href="/login"]');
    await this.waitForSelector("form");
    await this.typeText('input[type="email"]', email);
    await this.typeText('input[type="password"]', password);
    await this.clickElement('button[type="submit"]');
    await this.waitForNavigation();
  }

  async dragAndDrop(sourceSelector: string, targetSelector: string) {
    if (!this.page || !this.mouse) {
      throw new Error("Browser not initialized");
    }

    // Esperar a que los elementos estén presentes
    await this.waitForSelector(sourceSelector);
    await this.waitForSelector(targetSelector);

    // Obtener las posiciones de los elementos
    const sourceElement = await this.page.$(sourceSelector);
    const targetElement = await this.page.$(targetSelector);

    if (!sourceElement || !targetElement) {
      throw new Error("Source or target element not found");
    }

    // Obtener las coordenadas de los elementos
    const sourceBox = await sourceElement.boundingBox();
    const targetBox = await targetElement.boundingBox();

    if (!sourceBox || !targetBox) {
      throw new Error("Could not get element positions");
    }

    // Calcular los puntos centrales de los elementos
    const sourceX = sourceBox.x + sourceBox.width / 2;
    const sourceY = sourceBox.y + sourceBox.height / 2;
    const targetX = targetBox.x + targetBox.width / 2;
    const targetY = targetBox.y + targetBox.height / 2;

    // Realizar el drag and drop
    await this.mouse.move(sourceX, sourceY);
    await this.mouse.down();
    await this.mouse.move(targetX, targetY, { steps: 10 }); // steps hace el movimiento más suave
    await this.mouse.up();

    // Esperar un momento para que la animación se complete
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  async dragAndDropToPosition(
    sourceSelector: string,
    targetX: number,
    targetY: number
  ) {
    if (!this.page || !this.mouse) {
      throw new Error("Browser not initialized");
    }

    // Esperar a que el elemento fuente esté presente
    await this.waitForSelector(sourceSelector);

    // Obtener el elemento fuente
    const sourceElement = await this.page.$(sourceSelector);

    if (!sourceElement) {
      throw new Error("Source element not found");
    }

    // Obtener las coordenadas del elemento fuente
    const sourceBox = await sourceElement.boundingBox();

    if (!sourceBox) {
      throw new Error("Could not get source element position");
    }

    // Calcular el punto central del elemento fuente
    const sourceX = sourceBox.x + sourceBox.width / 2;
    const sourceY = sourceBox.y + sourceBox.height / 2;

    // Realizar el drag and drop
    await this.mouse.move(sourceX, sourceY);
    await this.mouse.down();
    await this.mouse.move(targetX, targetY, { steps: 10 }); // steps hace el movimiento más suave
    await this.mouse.up();

    // Esperar un momento para que la animación se complete
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}
