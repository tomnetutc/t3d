export interface TermDefinition {
    term: string;
    definition: string;
}

export const timePovertyDefinition: TermDefinition = {
    term: "Time poverty",
    definition: "The notion of time poverty is often used to describe individuals who do not have enough time to engage in discretionary activities that presumably enhance wellbeing. Similar to income-based poverty, time poverty is linked to poorer wellbeing. To identify individuals experiencing time poverty, activities are first classified into necessary, committed, and discretionary categories. Necessary and committed activities include personal care, household chores, caregiving, and work, while all other activities are considered discretionary. The time spent on necessary and committed activities is then aggregated for each respondent and subtracted from the 1,440 minutes available in a day to determine the remaining time for discretionary activities. Subsequently, the median discretionary time is calculated for the sample in a given year, and individuals with discretionary time less than 60% of this median are deemed time-poor (or not time-poor otherwise).",
};

export const zeroTripMakingDefinition: TermDefinition = {
    term: "Zero trip-making",
    definition: "Zero trip-making refers to situations where individuals do not undertake any trips throughout the day. This condition may lead to feelings of social isolation, depression, and other mental health problems as a result of not being able to interact in person with others outside the home. Zero trip-making is generally seen as a negative indicator of wellbeing, indicating that those who do not make any trips in a full day may have a lower quality of life. Identifying zero trip-makers in ATUS datasets is straightforward. If a person's activity time use diary does not report any travel outside the home, they are classified as a zero trip-maker in the dataset (or trip-maker otherwise).",
};

export const workArrangementDefinitions: TermDefinition[] = [
    {
        term: "Non-workers",
        definition: "This group includes individuals who have indicated that they are not participating in the labor force.",
    },
    {
        term: "Workers with Zero Work",
        definition: "This category comprises respondents who reported no work activity in their time use diary.",
    },
    {
        term: "In-home Only Workers",
        definition: "These individuals are those who reported working exclusively from home, with no reported out-of-home work activity.",
    },
    {
        term: "Commuters Only",
        definition: "Respondents in this group reported engaging in at least some out-of-home work activity in their time use diary, without any in-home work activity.",
    },
    {
        term: "Multi-site Workers",
        definition: "This category encompasses those who reported both out-of-home and in-home work activity in their time use diary.",
    },
];
