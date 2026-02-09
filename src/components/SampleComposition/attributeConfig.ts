import Colors from '../../Colors';

export interface AttributeCategory {
    label: string;
    field: string;
    value: string;
}

export interface AttributeConfig {
    name: string;
    categories: AttributeCategory[];
    colors: string[];
}

export const ATTRIBUTE_CONFIG: Record<string, AttributeConfig> = {
    gender: {
        name: 'Gender',
        categories: [
            { label: 'Male', field: 'female', value: '0.0' },
            { label: 'Female', field: 'female', value: '1.0' }
        ],
        // Use the core Time Use in-home / out-of-home palette to stay consistent
        colors: [Colors.inHomeWithinBackground, Colors.outOfHomeWithinBackground]
    },
    age: {
        name: 'Age Group',
        categories: [
            { label: '15 to 19 years', field: 'age_15_19', value: '1.0' },
            { label: '20 to 29 years', field: 'age_20_29', value: '1.0' },
            { label: '30 to 49 years', field: 'age_30_49', value: '1.0' },
            { label: '50 to 64 years', field: 'age_50_64', value: '1.0' },
            { label: '65 years or older', field: 'age_65p', value: '1.0' }
        ],
        // Use the same 5-color palette as Education Level
        colors: ['#9AAABF', '#CFCCCC', '#FBC6A0', '#F4DF3B', '#F9A875']
    },
    race: {
        name: 'Race/Ethnicity',
        categories: [
            { label: 'White', field: 'white', value: '1.0' },
            { label: 'Black', field: 'black', value: '1.0' },
            { label: 'Asian', field: 'asian', value: '1.0' },
            { label: 'Other', field: 'race_other', value: '1.0' }
        ],
        // Use work arrangement colors from Telework chart (4 colors): Workers with zero work, In-home only, Multi-site, Commuters only
        colors: ['#9AAABF','#CFCCCC', '#FBC6A0', '#F4DF3B']
    },
    education: {
        name: 'Education Level',
        categories: [
            { label: 'Less than high school', field: 'less_than_hs', value: '1.0' },
            { label: 'High school', field: 'hs_grad', value: '1.0' },
            { label: 'Some college degree', field: 'some_col_assc_deg', value: '1.0' },
            { label: "Bachelor's degree", field: 'bachelor', value: '1.0' },
            { label: 'Graduate degree(s)', field: 'grad_sch', value: '1.0' }
        ],
        // Use Telework work-arrangement palette (4 colors) + existing orange from current implementation
        // Order: [blue-grey, light grey, peach, yellow, orange]
        colors: ['#9AAABF', '#CFCCCC', '#FBC6A0', '#F4DF3B', '#F9A875']
    },
    income: {
        name: 'Household Income',
        categories: [
            { label: '<$35K', field: 'inc_up35', value: '1.0' },
            { label: '$35K to $50K', field: 'inc_35_50', value: '1.0' },
            { label: '$50K to $75K', field: 'inc_50_75', value: '1.0' },
            { label: '$75K to $100K', field: 'inc_75_100', value: '1.0' },
            { label: '>$100K', field: 'inc_100p', value: '1.0' }
        ],
        // Also use the 5-color mode share palette here
        colors: [
            Colors.carModeShareBackground,
            Colors.transitModeShareBackground,
            Colors.walkModeShareBackground,
            Colors.bikeModeShareBackground,
            Colors.otherModeShareBackground
        ]
    },
    employment: {
        name: 'Employment Status',
        categories: [
            { label: 'Full-time worker', field: 'full_time', value: '1.0' },
            { label: 'Part-time worker', field: 'part_time', value: '1.0' },
            { label: 'Non-worker', field: 'unemployed', value: '1.0' }
        ],
        // Use Time allocation by activity type colors (3 colors): Necessary, Discretionary, Committed
        colors: ['#8E9B97', '#F9A875', '#657383']
    },
    household_size: {
        name: 'Household Size',
        categories: [
            { label: 'One', field: 'hhsize_1', value: '1.0' },
            { label: 'Two', field: 'hhsize_2', value: '1.0' },
            { label: 'Three or more', field: 'hhsize_3p', value: '1.0' }
        ],
        // Use first 3 colors from the Telework cross-segment palette directly
        colors: ['#9D83A7', '#6DAfA0', '#f9a875']
    }
};

export type AttributeKey = keyof typeof ATTRIBUTE_CONFIG;

