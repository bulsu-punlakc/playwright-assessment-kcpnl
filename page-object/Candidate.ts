import { expect, Locator, Page } from "@playwright/test";
import { App } from "./App";

type Interview = {
    title: string;
    interviewer: string;
    date: string;
};

export interface CandidateDetails {
    firstName: string;
    middleName: string;
    lastName: string;
    vacancy: string;
    email: string;
    contact: string;
    resumePath: string;
    keywords: string;
    dateOfApplication: string;
    notes: string;
    interview: Interview;
};

export class Candidate {
    page: Page;
    app: App;

    firstNameInput: Locator;
    middleNameInput: Locator;
    lastNameInput: Locator;
    vacancyDropdown: Locator;
    emailInput: Locator;
    contactInput: Locator;
    resumeUpload: Locator;
    keywordsInput: Locator;
    dateOfApplication: Locator;
    notesInput: Locator;

    saveButton: Locator;
    cancelButton: Locator;

    constructor (page: Page) {
        this.page = page;
        this.app = new App(this.page);

        this.firstNameInput = page.getByPlaceholder('First Name');
        this.middleNameInput = page.getByRole('textbox', { name: 'Middle Name' });
        this.lastNameInput = page.getByPlaceholder('Last Name');
        
        this.vacancyDropdown = page.locator('.oxd-select-text').first();

        this.emailInput = page.locator('//label[text()="Email"]/parent::div/following-sibling::div//input');
        this.contactInput = page.locator('//label[text()="Contact Number"]/parent::div/following-sibling::div//input');

        this.resumeUpload = page.locator('//label[text()="Resume"]/parent::div/following-sibling::div//input');

        this.keywordsInput = page.locator('//label[text()="Keywords"]/parent::div/following-sibling::div//input');
        this.dateOfApplication = page.locator('//label[text()="Date of Application"]/parent::div/following-sibling::div//input');
        this.notesInput = page.locator('//label[text()="Notes"]/parent::div/following-sibling::div//textarea');

        this.saveButton = page.getByRole("button", { name: "Save" });
        this.cancelButton = page.getByRole("button", { name: "Cancel" });
    };

    async fillCandidateForm(candidateDetails: CandidateDetails) {
        await this.app.clickButton('Add');

        const form = this.page.locator('form.oxd-form');
        await form.waitFor({ state: 'visible', timeout: 5000 });

        await this.firstNameInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.firstNameInput.fill(candidateDetails.firstName);

        await this.lastNameInput.waitFor({ state: 'visible' });
        await this.lastNameInput.fill(candidateDetails.lastName);

        await this.vacancyDropdown.click();
        await this.page.getByText(candidateDetails.vacancy).click();

        await this.emailInput.fill(candidateDetails.email);
        await this.contactInput.fill(candidateDetails.contact);

        await this.keywordsInput.fill(candidateDetails.keywords);

        await this.dateOfApplication.clear();
        await this.dateOfApplication.fill(candidateDetails.dateOfApplication);

        await this.notesInput.fill(candidateDetails.notes);
    
        await this.saveButton.click();
    };

    async searchAndOpenCandidate(candidateVacancy: string) {
        await this.app.navigate('Candidates');
        await this.page.getByText('-- Select --').nth(1).click();
        await this.page.getByRole('listbox').getByText(candidateVacancy).click();
        await this.page.getByRole('button', { name: 'Search' }).click();
        await this.page.locator('//button[contains(@class,"oxd-icon-button")]').nth(3).click();
        await this.page.getByRole('button', { name: 'Shortlist' }).waitFor({ state: 'visible' });
    };

    // async validateCandidate(candidateDetails: CandidateDetails) {
    //     await this.app.navigate('Candidates');
    //     await this.page.locator('div.oxd-table-body').waitFor({ state: 'visible' });
    //     await expect(this.page.locator(`//div[contains(@class, 'oxd-table-row')]//div[text()='${candidateDetails.vacancy}']`)).toBeVisible();
    // }

    async shortlistCurrentCandidate() {
        await this.app.clickButton('Shortlist');
        await this.app.clickButton('Save');
        await this.page.getByText('Successfully Updated').click();
    };

    async scheduleInterviewOfCurrentCandidate(candidateDetails: CandidateDetails) {
        await this.app.clickButton('Schedule Interview');

        await this.page.locator(`//label[text()="Interview Title"]/parent::div/following-sibling::div//input`).fill(candidateDetails.interview.title);
        await this.page.locator(`//label[text()="Interviewer"]/parent::div/following-sibling::div//input`).fill(candidateDetails.interview.interviewer);
        await this.page.getByText(candidateDetails.interview.interviewer).click()
        await this.page.locator(`//label[text()="Date"]/parent::div/following-sibling::div//input`).fill(candidateDetails.interview.date);

        await this.app.clickButton('Save');
    };

    async markInterviewAsPassed() {
        await this.app.clickButton('Mark Interview Passed');
        await this.app.clickButton('Save');
    };

    async offerJob() {
        await this.app.clickButton('Offer Job');
        await this.app.clickButton('Save');
    };

    async hireCandidate() {
        await this.app.clickButton('Hire');
        await this.app.clickButton('Save');
    };
};