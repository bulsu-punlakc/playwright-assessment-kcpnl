import { test } from "@playwright/test";
import { App } from "../page-object/App";
import { Candidate } from "../page-object/Candidate";
import { Vacancy } from "../page-object/Vacancy";

import data from "../test-data/data.json";

test('Recruitment Process', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', { waitUntil: 'domcontentloaded' });

    const app = new App(page);
    const vacancy = new Vacancy(page);
    const candidate = new Candidate(page);

    const vacancyData = data.vacancies[0];
    const candidateData = data.candidates[0];

    await test.step('Log In', async () => {
        await app.login(data.user);
        await app.navigate('Recruitment');
    });

    // // 1. Add Vacancy
    // await test.step(`Add New Vacancy: ${vacancyData.vacancyName}`, async () => {
    //     await app.navigate('Recruitment');
    //     await app.navigate('Vacancies');
    //     await vacancy.fillVacancyForm(vacancyData);
    // });

    // // 1.5. Verify Newly Added Vacancy
    // await test.step(`Validate Vacancy: ${vacancyData.vacancyName}`, async () => {
    //     await vacancy.validateVacancy(vacancyData);
    // });

    // 2. Add Candidate
    await test.step(`Add New Candidate: ${candidateData.firstName}`, async () => {
        await app.navigate('Candidates');
        await candidate.fillCandidateForm(candidateData);
    });

    // 2.5. Verify Newly Added Candidate
    await test.step(`Validate Candidate: ${candidateData.firstName}`, async () => {
        // await candidate.validateCandidate(candidateData);
        await candidate.searchAndOpenCandidate(candidateData.vacancy);
    });

    // 3. Shortlist Candidate
    await test.step(`Shortlist Candidate: ${candidateData.firstName}`, async () => {
        await candidate.shortlistCurrentCandidate();
    });

    // 4. Schedule Interview
    await test.step(`Schedule Candidate ${candidateData.firstName}'s Interview`, async () => {
        await candidate.scheduleInterviewOfCurrentCandidate(candidateData);
    });

    // 5. Mark Interview Passed
    await test.step(`Mark Candidate ${candidateData.firstName}'s Interview To Passed`, async () => {
        await candidate.markInterviewAsPassed();
    });

    // 6. Offer Job To Candidate
    await test.step(`Offer Job To Candidate: ${candidateData.firstName}`, async () => {
        await candidate.offerJob();
    });

    // 7. Hire Candidate
    await test.step(`Hire Candidate: ${candidateData.firstName}`, async () => {
        await candidate.hireCandidate();
    });
});