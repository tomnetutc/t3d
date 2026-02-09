# Sample Composition Feature - Verification Guide

## ✅ Data Connectivity - How It Works

### 1. **Data Loading Process**

The data is loaded from the CSV file using the existing `DataProvider` class:

```typescript
// In SampleComposition.tsx, line 53:
const loadedData = await DataProvider.getInstance().loadData();
```

**What this does:**
- Fetches `df_time_use.csv` from GitHub: `https://raw.githubusercontent.com/tomnetutc/t3d/main/public/df_time_use.csv`
- Uses D3.js `csv()` function to parse the CSV
- Returns an array of ~228,000 rows (one row per survey respondent)
- Each row is a JavaScript object with all the CSV columns as properties

**To verify data is loading:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to Sample Composition page
4. You should see NO errors
5. Check Network tab - you should see a request to the CSV file

### 2. **How to Verify Data is Connected**

Add this temporary code to see the data in console:

```typescript
// In SampleComposition.tsx, after line 54:
console.log('Data loaded:', loadedData.length, 'rows');
console.log('First row sample:', loadedData[0]);
console.log('Available years:', [...new Set(loadedData.map(r => r.year))]);
```

This will show:
- Total number of rows loaded
- Sample of what one row looks like
- All available years in the data

---

## ✅ Calculation Verification - Step by Step

### Example: Calculating Gender Composition for Year 2020

Let's trace through the code to see how it calculates:

#### Step 1: Filter Data by Year
```typescript
// In calculations.ts, line 33:
const yearData = data.filter(row => row.year === year);
// Result: All rows where year === "2020"
```

#### Step 2: Count Females
```typescript
// In calculations.ts, line 44-46:
const count = yearData.filter(
    row => row[category.field] === category.value
).length;
// For Female: row.female === "1.0"
// Result: Number of rows where female === "1.0"
```

#### Step 3: Calculate Percentage
```typescript
// In calculations.ts, line 48:
return parseFloat(((count / yearData.length) * 100).toFixed(1));
// Example: (5200 / 10000) * 100 = 52.0%
```

### Manual Verification Method

**To manually verify a calculation:**

1. **Pick a specific year** (e.g., 2020)
2. **Pick a specific attribute** (e.g., Gender)
3. **Open browser console** and run:

```javascript
// Get the data (assuming it's in window for debugging)
const data = await fetch('https://raw.githubusercontent.com/tomnetutc/t3d/main/public/df_time_use.csv')
  .then(r => r.text())
  .then(text => {
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, h, i) => {
        obj[h] = values[i];
        return obj;
      }, {});
    });
  });

// Filter for 2020
const year2020 = data.filter(row => row.year === '2020');
console.log('Total 2020 rows:', year2020.length);

// Count females
const females = year2020.filter(row => row.female === '1.0');
console.log('Female count:', females.length);
console.log('Female %:', (females.length / year2020.length * 100).toFixed(1) + '%');

// Count males
const males = year2020.filter(row => row.female === '0.0');
console.log('Male count:', males.length);
console.log('Male %:', (males.length / year2020.length * 100).toFixed(1) + '%');
```

---

## ✅ Calculation Formulas

### Unweighted Percentage
```
Unweighted % = (Count of category / Total rows in year) × 100
```

**Example:**
- Year 2020 has 10,000 rows
- 5,200 rows have `female === "1.0"`
- Unweighted % = (5,200 / 10,000) × 100 = 52.0%

### Weighted Percentage
```
Weighted % = (Sum of weights for category / Sum of all weights) × 100
```

**Example:**
- Year 2020 total weight sum = 100,000,000
- Female weight sum = 52,345,678
- Weighted % = (52,345,678 / 100,000,000) × 100 = 52.3%

**Why different?**
- Unweighted: Simple count, represents the actual sample
- Weighted: Adjusted to represent the U.S. population (more accurate for national statistics)

---

## ✅ How to Verify Calculations Are Correct

### Method 1: Check Percentages Add to 100%

For each year and attribute, all categories should add up to ~100%:

```typescript
// Add this debug code temporarily in SampleComposition.tsx
useEffect(() => {
    if (chartData) {
        chartData.labels.forEach((year, yearIndex) => {
            const sum = chartData.datasets.reduce((total, dataset) => {
                return total + dataset.data[yearIndex];
            }, 0);
            console.log(`Year ${year} sum:`, sum.toFixed(1) + '%');
            // Should be close to 100%
        });
    }
}, [chartData]);
```

### Method 2: Verify Sample Sizes Match

Check that the counts in the table match what you'd expect:

```typescript
// In the table, for year 2020:
// Count for "Female" + Count for "Male" should equal total sample size for 2020
```

### Method 3: Compare with Known Statistics

If you have access to ATUS official statistics, compare:
- The weighted percentages should be close to official U.S. Census data
- The sample sizes should match ATUS documentation

---

## ✅ Data Flow Diagram

```
CSV File (GitHub)
    ↓
DataProvider.loadData()
    ↓
Array of ~228,000 DataRow objects
    ↓
calculateCompositionOverTime() or calculateYearComposition()
    ↓
Filter by year/attribute
    ↓
Count rows matching category
    ↓
Calculate percentages (unweighted and weighted)
    ↓
Display in Chart/Table
```

---

## ✅ Testing Checklist

### Data Loading
- [ ] Page loads without errors
- [ ] Console shows no errors
- [ ] Network tab shows CSV file loaded
- [ ] Loading spinner appears then disappears

### Chart Verification
- [ ] Chart displays with bars for each year
- [ ] Each bar's segments add up to ~100%
- [ ] Changing attribute dropdown updates chart
- [ ] Tooltip shows correct percentages when hovering

### Table Verification
- [ ] Table shows data for selected year
- [ ] Unweighted % + Weighted % columns both show values
- [ ] Count column shows whole numbers
- [ ] For Gender: Male + Female counts = total sample size
- [ ] Changing year updates table

### Calculation Verification
- [ ] Unweighted % = (Count / Total) × 100
- [ ] Weighted % uses weight field correctly
- [ ] Percentages are rounded to 1 decimal place
- [ ] All categories for an attribute sum to ~100%

---

## ✅ Debugging Tips

### If chart shows no data:
1. Check console for errors
2. Verify `data.length > 0` in useEffect
3. Check that `selectedAttribute` is valid
4. Verify CSV file is accessible

### If percentages don't add to 100%:
1. Check for missing data (some rows might have null values)
2. Verify filter logic is correct
3. Check that each person only matches ONE category per attribute

### If weighted % seems wrong:
1. Verify `weight` field exists in CSV
2. Check that weight values are numeric
3. Verify total weight calculation

---

## ✅ Code Locations

- **Data Loading**: `src/pages/SampleComposition.tsx` lines 49-75
- **Chart Calculations**: `src/components/SampleComposition/calculations.ts` lines 21-58
- **Table Calculations**: `src/components/SampleComposition/calculations.ts` lines 64-115
- **Data Provider**: `src/utils/Helpers.tsx` lines 30-66

---

## ✅ Quick Verification Script

Add this to your browser console on the Sample Composition page:

```javascript
// This will log the actual calculations being performed
window.debugSampleComposition = function(year = '2020', attribute = 'gender') {
    console.log('=== Sample Composition Debug ===');
    console.log('Year:', year);
    console.log('Attribute:', attribute);
    
    // You'll need to access the component's data
    // This is just a template - actual implementation depends on React DevTools
};
```

---

## Summary

**The calculations are NOT hardcoded** - they:
1. ✅ Load real data from CSV file
2. ✅ Filter data by year and attribute
3. ✅ Count rows matching each category
4. ✅ Calculate percentages using actual counts
5. ✅ Use weight field for weighted calculations

**To verify:**
- Check browser console for data loading
- Verify percentages add to ~100%
- Compare counts with sample sizes
- Test with different years/attributes

The implementation is fully connected to the data and performs real calculations!

