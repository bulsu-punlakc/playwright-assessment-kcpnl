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
    addCandidateButton: Locator;

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
        this.addCandidateButton = page.getByRole('button', { name: 'Add' });

        this.firstNameInput = page.locator(`//input[contains(@placeholder, 'First Name')]`);
        this.middleNameInput = page.locator(`//input[contains(@placeholder, 'Middle Name')]`);
        this.lastNameInput = page.locator(`//input[contains(@placeholder, 'Last Name')]`);
        
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
        await this.addCandidateButton.click();
        
        const formContainer = this.page.locator('form.oxd-form')
        await formContainer.waitFor({ state: 'visible', timeout: 5000 })

        await this.firstNameInput.fill(candidateDetails.firstName);
        await this.lastNameInput.fill(candidateDetails.lastName);

        await this.vacancyDropdown.click();
        const vacancyOption = await this.page.getByText(candidateDetails.vacancy);
        // await vacancyOption.scrollIntoViewIfNeeded();
        await vacancyOption.waitFor({ state: 'visible', timeout: 5000 })
        await vacancyOption.click();

        await this.emailInput.fill(candidateDetails.email);
        await this.contactInput.fill(candidateDetails.contact);

        await this.keywordsInput.fill(candidateDetails.keywords);

        await this.dateOfApplication.clear();
        await this.dateOfApplication.fill(candidateDetails.dateOfApplication);

        await this.notesInput.fill(candidateDetails.notes);
    
        await this.app.clickButton('Save');
        await this.page.waitForTimeout(3000);
    };

    async validateCandidate(candidateDetails: CandidateDetails) {
        await this.app.navigate('Candidates');
        await this.page.locator('div.oxd-table-body').waitFor({ state: 'visible' });
        await expect(this.page.locator(`//div[contains(@class, 'oxd-table-row')]//div[text()='${candidateDetails.vacancy}']`)).toBeVisible();
    }

    async shortlistCurrentCandidate() {
        await this.app.clickButton('Shortlist');
        await this.app.clickButton('Save');
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