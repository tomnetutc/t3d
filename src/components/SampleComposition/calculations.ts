import { DataRow } from '../Types';
import { ATTRIBUTE_CONFIG, AttributeKey } from './attributeConfig';

export interface YearComposition {
    year: string;
    percentages: number[];
}

export interface CategoryComposition {
    attribute: string;
    category: string;
    unweightedPercent: number;
    weightedPercent: number;
    count: number;
}

/**
 * Calculate composition percentages for chart (all years)
 * Returns unweighted percentages for each year
 */
export function calculateCompositionOverTime(
    data: DataRow[],
    attributeKey: AttributeKey
): YearComposition[] {
    const config = ATTRIBUTE_CONFIG[attributeKey];
    
    // Get unique years and sort them
    const years = Array.from(new Set(data.map(row => row.year)))
        .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    
    const result: YearComposition[] = years.map(year => {
        // Filter data for this year
        const yearData = data.filter(row => row.year === year);
        
        if (yearData.length === 0) {
            return {
                year,
                percentages: config.categories.map(() => 0)
            };
        }
        
        // For income, check if we need to filter out rows with missing income data
        let filteredYearData = yearData;
        if (attributeKey === 'income') {
            // Check if any rows have missing income data (all income fields are "0.0" or empty)
            const rowsWithIncome = yearData.filter(row => {
                const hasIncome = config.categories.some(cat => 
                    row[cat.field] === cat.value
                );
                return hasIncome;
            });
            
            // If there are rows without income data, use only rows with income data for calculation
            if (rowsWithIncome.length < yearData.length) {
                filteredYearData = rowsWithIncome;
                const missingCount = yearData.length - rowsWithIncome.length;
                const missingPercent = ((missingCount / yearData.length) * 100).toFixed(1);
                if (parseFloat(missingPercent) > 0.1) {
                    console.warn(`⚠️ Year ${year}: ${missingCount} rows (${missingPercent}%) have missing income data`);
                }
            }
        }
        
        // Calculate percentage for each category
        const percentages = config.categories.map(category => {
            const count = filteredYearData.filter(
                row => row[category.field] === category.value
            ).length;
            
            const percentage = filteredYearData.length > 0
                ? parseFloat(((count / filteredYearData.length) * 100).toFixed(1))
                : 0;
            
            // Debug logging for income issues
            if (attributeKey === 'income' && (year === '2003' || year === '2010')) {
                console.log(`   ${category.label}: ${count} / ${filteredYearData.length} = ${percentage}%`);
            }
            
            return percentage;
        });
        
        // Verify percentages sum to ~100% (with tolerance for rounding)
        const sum = percentages.reduce((a, b) => a + b, 0);
        if (Math.abs(sum - 100) > 1 && filteredYearData.length > 0) {
            console.warn(`⚠️ Year ${year} (${attributeKey}) percentages sum to ${sum.toFixed(1)}% (expected ~100%)`);
            console.warn(`   Categories: ${config.categories.map((c, i) => `${c.label}=${percentages[i]}%`).join(', ')}`);
        }
        
        // Additional validation: ensure all categories are mutually exclusive
        // (This is a data quality check - shouldn't happen if data is correct)
        if (filteredYearData.length > 0) {
            const totalMatches = config.categories.reduce((sum, category) => {
                return sum + filteredYearData.filter(
                    row => row[category.field] === category.value
                ).length;
            }, 0);
            
            // For mutually exclusive categories, totalMatches should equal filteredYearData.length
            // (except for income where we filter out missing data)
            if (attributeKey !== 'income' && totalMatches !== filteredYearData.length) {
                console.warn(`⚠️ Year ${year} (${attributeKey}): Found ${totalMatches} matches but ${filteredYearData.length} total rows (some rows may have multiple categories or missing data)`);
            }
        }
        
        return {
            year,
            percentages
        };
    });
    
    return result;
}

/**
 * Calculate detailed composition for table (single year)
 * Returns both unweighted and weighted percentages
 */
export function calculateYearComposition(
    data: DataRow[],
    year: string
): CategoryComposition[] {
    const yearData = data.filter(row => row.year === year);
    
    if (yearData.length === 0) return [];
    
    // Calculate total weight for weighted percentages
    const totalWeight = yearData.reduce(
        (sum, row) => sum + parseFloat(row.weight || '0'),
        0
    );
    
    const result: CategoryComposition[] = [];
    
    // Process each attribute
    Object.entries(ATTRIBUTE_CONFIG).forEach(([key, config]) => {
        // For income, filter out rows with missing income data
        let filteredYearData = yearData;
        let filteredTotalWeight = totalWeight;
        
        if (key === 'income') {
            // Only include rows that have at least one income category set
            const rowsWithIncome = yearData.filter(row => {
                return config.categories.some(cat => row[cat.field] === cat.value);
            });
            
            if (rowsWithIncome.length < yearData.length) {
                filteredYearData = rowsWithIncome;
                filteredTotalWeight = rowsWithIncome.reduce(
                    (sum, row) => sum + parseFloat(row.weight || '0'),
                    0
                );
            }
        }
        
        config.categories.forEach(category => {
            // Count rows matching this category
            const matchingRows = filteredYearData.filter(
                row => row[category.field] === category.value
            );
            
            const count = matchingRows.length;
            
            // Calculate unweighted percentage (based on filtered data for income)
            const unweightedPercent = filteredYearData.length > 0 
                ? (count / filteredYearData.length) * 100 
                : 0;
            
            // Calculate weighted percentage (based on filtered weights for income)
            const weightSum = matchingRows.reduce(
                (sum, row) => sum + parseFloat(row.weight || '0'),
                0
            );
            const weightedPercent = filteredTotalWeight > 0 
                ? (weightSum / filteredTotalWeight) * 100 
                : 0;
            
            result.push({
                attribute: config.name,
                category: category.label,
                unweightedPercent: parseFloat(unweightedPercent.toFixed(1)),
                weightedPercent: parseFloat(weightedPercent.toFixed(1)),
                count
            });
        });
    });
    
    return result;
}

/**
 * Get sample sizes for each year
 */
export function getSampleSizesByYear(data: DataRow[]): Record<string, number> {
    const sizes: Record<string, number> = {};
    
    const years = Array.from(new Set(data.map(row => row.year)));
    
    years.forEach(year => {
        sizes[year] = data.filter(row => row.year === year).length;
    });
    
    return sizes;
}

/**
 * Get available years from the data
 */
export function getAvailableYears(data: DataRow[]): string[] {
    return Array.from(new Set(data.map(row => row.year)))
        .sort((a, b) => parseInt(b, 10) - parseInt(a, 10)); // Sort descending (newest first)
}

