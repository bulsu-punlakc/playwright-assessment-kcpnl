import { expect, Locator, Page } from "@playwright/test";
import { App } from "./App";

export interface VacancyDetails {
    vacancyName: string;
    jobTitle: string;
    description: string;
    hiringManager: string;
    noOfPositions: string;
    isActive: boolean;
    allowPublish: boolean;
};

export class Vacancy {
    page: Page;
    app: App;
    addVacancyButton: Locator;
    
    vacancyNameInput: Locator;
    jobTitleDropdown: Locator;
    descriptionTextarea: Locator;
    hiringManagerInput: Locator;
    numberOfPositionsInput: Locator;
    activeToggle: Locator;
    publishToggle: Locator;
  
    constructor (page: Page) {
        this.page = page;
        this.app = new App(this.page);
        this.addVacancyButton = page.getByRole('button', { name: 'Add' });

        this.vacancyNameInput = page.locator(`//label[text()="Vacancy Name"]/parent::div/following-sibling::div//input`);
        this.jobTitleDropdown = page.locator(".oxd-select-text").first();
        this.descriptionTextarea = page.locator(`//label[text()="Description"]/parent::div/following-sibling::div//textarea`);
        this.hiringManagerInput = page.locator(`//label[text()="Hiring Manager"]/parent::div/following-sibling::div//input`);
        this.numberOfPositionsInput = page.locator(`//label[text()="Number of Positions"]/parent::div/following-sibling::div//input`);

        this.activeToggle = page.locator(".oxd-switch-input").nth(0);
        this.publishToggle = page.locator(".oxd-switch-input").nth(1);
    };

    async fillVacancyForm(vacancyDetails: VacancyDetails) {
        await this.addVacancyButton.click();

        await this.vacancyNameInput.waitFor({ state: 'visible' });

        await this.vacancyNameInput.fill(vacancyDetails.vacancyName);
        await this.jobTitleDropdown.click();
        await this.page.getByRole('option', { name: vacancyDetails.jobTitle }).click();
        await this.descriptionTextarea.fill(vacancyDetails.description);

        await this.hiringManagerInput.fill(vacancyDetails.hiringManager);
        await this.page.getByText(vacancyDetails.hiringManager).click();

        await this.numberOfPositionsInput.fill(vacancyDetails.noOfPositions);

        const activeState = await this.activeToggle.isChecked();
        if (activeState !== vacancyDetails.isActive) {
            await this.activeToggle.click();
        }

        const publishState = await this.publishToggle.isChecked();
        if (publishState !== vacancyDetails.allowPublish) {
            await this.publishToggle.click();
        }

        await this.app.clickButton('Save');
        await this.page.waitForTimeout(3000)
    };

    async validateVacancy(vacancyDetails: VacancyDetails) {
        await this.app.navigate('Vacancies');
        await this.page.locator('div.oxd-table-body').waitFor({ state: 'visible' });
        await expect(this.page.locator(`//div[contains(@class, 'oxd-table-row')]//div[text()='${vacancyDetails.vacancyName}']`)).toBeVisible();
    };
}