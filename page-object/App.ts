import { Locator, Page } from "@playwright/test";

export interface LoginCredentials {
    username: string;
    password: string;
}

export class App {
    page: Page;
    usernameLoginText: Locator;
    passwordLoginText: Locator;
    loginButton: Locator;

    constructor (page: Page) {
        this.page = page;

        this.usernameLoginText = page.getByPlaceholder('Username');
        this.passwordLoginText = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async login(credentials: LoginCredentials) {
        await this.usernameLoginText.fill(credentials.username);
        await this.passwordLoginText.fill(credentials.password);
        await this.loginButton.click();
    }

    async navigate(option: String) {
        const link = this.page.getByRole('link', { name: `${option}` });
        await link.waitFor();
        await link.click();
    }

    async clickButton(buttonText: String) {
        const button = this.page.getByRole('button', { name: `${buttonText}` }).first();
        await button.waitFor({ state: 'visible' });
        await button.click();
    }
};