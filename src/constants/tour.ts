import { Step } from 'types/tour';

export const tradePageSteps: Step[] = [
    {
        heading: 'onboarding-tour.steps.step-0.title',
        content: 'onboarding-tour.steps.step-0.content',
    },
    {
        selector: '.step-1',
        heading: 'onboarding-tour.steps.step-1.title',
        content: 'onboarding-tour.steps.step-1.content',
        highlightedSelectors: ['.step-1', '.step-1-dropdown'],
    },
    {
        selector: '.step-2',
        heading: 'onboarding-tour.steps.step-2.title',
        content: 'onboarding-tour.steps.step-2.content',
        highlightedSelectors: ['.step-2', '.step-2-dropdown'],
    },
    {
        selector: '.step-3',
        heading: 'onboarding-tour.steps.step-3.title',
        content: 'onboarding-tour.steps.step-3.content',
    },
    {
        selector: '.step-4',
        heading: 'onboarding-tour.steps.step-4.title',
        content: 'onboarding-tour.steps.step-4.content',
    },
    {
        selector: '.step-5',
        heading: 'onboarding-tour.steps.step-5.title',
        content: 'onboarding-tour.steps.step-5.content',
    },
];
