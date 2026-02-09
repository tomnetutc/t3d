import React, { useState, useEffect, useCallback } from 'react';
import { DataProvider, useDocumentTitle } from '../utils/Helpers';
import { ATTRIBUTE_CONFIG, AttributeKey } from '../components/SampleComposition/attributeConfig';
import {
    calculateCompositionOverTime,
    calculateYearComposition,
    getSampleSizesByYear,
    getAvailableYears
} from '../components/SampleComposition/calculations';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Container, Form, Table } from 'react-bootstrap';
import LoadingOverlay from '../components/LoadingOverlay';
import { DataRow, Option } from '../components/Types';
import { chartDataToCSV, downloadCSV } from '../utils/Helpers';
import { Navbar } from '../components/Navbar';
import Footer from '../components/Footer';
import DownloadButton from '../components/DownloadButton';
import InfoBox from '../components/InfoBox/InfoBox';
import './SampleComposition.scss';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

export function SampleComposition(): JSX.Element {
    useDocumentTitle('Sample Composition');

    const [data, setData] = useState<DataRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAttribute, setSelectedAttribute] = useState<AttributeKey>('gender');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [chartData, setChartData] = useState<any>(null);
    const [tableData, setTableData] = useState<any[]>([]);
    const [sampleSizes, setSampleSizes] = useState<Record<string, number>>({});
    const [availableYears, setAvailableYears] = useState<string[]>([]);

    // Dummy handlers for Navbar (not used in Sample Composition but required by Navbar component)
    const handleMenuOptionChange = useCallback((options: Option[] | Option[][]) => {
        // Not used in Sample Composition
    }, []);

    const handleToggleChange = useCallback((includeDecember: boolean) => {
        // Not used in Sample Composition
    }, []);

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const loadedData = await DataProvider.getInstance().loadData();
                
                // Debug: Verify data is loaded
                console.log('✅ Sample Composition: Data loaded successfully');
                console.log('   Total rows:', loadedData.length);
                console.log('   Sample row:', loadedData[0]);
                
                setData(loadedData as DataRow[]);
                
                // Get available years and set default to most recent
                const years = getAvailableYears(loadedData as DataRow[]);
                console.log('   Available years:', years);
                setAvailableYears(years);
                if (years.length > 0) {
                    setSelectedYear(years[0]);
                }
                
                // Get sample sizes
                const sizes = getSampleSizesByYear(loadedData as DataRow[]);
                console.log('   Sample sizes by year:', sizes);
                setSampleSizes(sizes);
                
                setLoading(false);
            } catch (error) {
                console.error('❌ Error loading data:', error);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Calculate chart data when attribute or data changes
    useEffect(() => {
        if (data.length === 0) return;

        const composition = calculateCompositionOverTime(data, selectedAttribute);
        const config = ATTRIBUTE_CONFIG[selectedAttribute];

        // Transform data for Chart.js
        const labels = composition.map(item => item.year);
        const datasets = config.categories.map((category, index) => ({
            label: category.label,
            data: composition.map(item => item.percentages[index]),
            backgroundColor: config.colors[index],
            borderWidth: 0
        }));

        setChartData({
            labels,
            datasets
        });
    }, [data, selectedAttribute]);

    // Calculate table data when year changes
    useEffect(() => {
        if (data.length === 0 || !selectedYear) return;

        const composition = calculateYearComposition(data, selectedYear);
        setTableData(composition);
    }, [data, selectedYear]);

    const handleAttributeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAttribute(e.target.value as AttributeKey);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(e.target.value);
    };

    const handleDownloadChart = () => {
        if (!chartData) return;

        // Transform chart data to CSV format
        const csvData = chartData.labels.map((year: string, index: number) => {
            const obj: { [key: string]: string | number } = {
                name: year
            };
            chartData.datasets.forEach((dataset: any) => {
                obj[dataset.label] = dataset.data[index] ?? 0;
            });
            return obj;
        });

        const csv = chartDataToCSV(
            csvData,
            chartData.datasets.map((ds: any) => ({ label: ds.label }))
        );
        const filename = `sample_composition_${selectedAttribute}_chart.csv`;
        downloadCSV(csv, filename);
    };

    const handleDownloadTable = () => {
        if (tableData.length === 0) return;

        // Create CSV content
        let csv = 'Attribute,Category,Unweighted %,Weighted %,Count\n';

        tableData.forEach(row => {
            csv += `${row.attribute},${row.category},${row.unweightedPercent}%,${row.weightedPercent}%,${row.count}\n`;
        });

        // Download CSV
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sample_composition_${selectedYear}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                color: '#FFFFFF',
                font: {
                    weight: 'bold' as const,
                    size: 10,
                },
                formatter: (value: number) => {
                    // Always show one decimal place, even for integers (e.g., 45.0)
                    if (typeof value === 'number') {
                        return `${value.toFixed(1)}%`;
                    }
                    const num = Number(value);
                    return isNaN(num) ? '' : `${num.toFixed(1)}%`;
                },
                anchor: 'center' as const,
                align: 'center' as const,
                clamp: true,
            },
            legend: {
                display: true,
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    pointStyle: 'rect' as const,
                    padding: 15,
                    boxWidth: 10,
                    boxHeight: 10
                }
            },
            tooltip: {
                mode: 'index' as const,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: { size: 13, weight: 600 },
                bodyFont: { size: 12 },
                callbacks: {
                    label: function (context: any) {
                        return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                    },
                    footer: function (tooltipItems: any[]) {
                        const year = tooltipItems[0].label;
                        return 'Sample: ' + (sampleSizes[year] || 0).toLocaleString();
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                stacked: true,
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function (value: any) {
                        return value + '%';
                    },
                    font: {
                        size: 12
                    }
                },
                grid: {
                    color: '#f0f0f0'
                }
            }
        }
    };

    if (loading) {
        return (
            <>
                <Navbar
                    onMenuOptionChange={handleMenuOptionChange}
                    toggleState={handleToggleChange}
                    analysisType="withinYear"
                    onAnalysisTypeChange={() => {}}
                    updatedCrossSegmentSelections={[[]]}
                    hideAnalysisButtons={true}
                    hideMenu={true}
                />
                <LoadingOverlay />
            </>
        );
    }

    const config = ATTRIBUTE_CONFIG[selectedAttribute];

    return (
        <>
            <Navbar
                onMenuOptionChange={handleMenuOptionChange}
                toggleState={handleToggleChange}
                analysisType="withinYear"
                onAnalysisTypeChange={() => {}}
                updatedCrossSegmentSelections={[[]]}
                hideAnalysisButtons={true}
                hideMenu={true}
            />
            <div className="home sample-composition-page" style={{ backgroundColor: '#f5f5f5', padding: '20px 20px 20px' }}>
                <Container fluid className="sc-container">
                    <header className="sc-page-header">
                        <div>
                            <h1 className="sc-page-title">Sample Composition Analysis</h1>
                            <p className="sc-page-subtitle">
                                Explore how the ATUS survey sample composition changes across years and demographic groups.
                            </p>
                        </div>
                    </header>

                    {/* Section 1: Between Years Analysis - Chart */}
                    <section className="sc-section">
                        <div className="sc-section-header">
                            <h2 className="sc-section-title">Sample Composition Across Years</h2>
                        </div>

                        <div className="sc-control-card">
                            <div className="sc-control-field">
                                <span className="sc-control-label">Select Attribute</span>
                                <Form.Select
                                    id="attributeSelect"
                                    value={selectedAttribute}
                                    onChange={handleAttributeChange}
                                    className="sc-select"
                                >
                                    {Object.entries(ATTRIBUTE_CONFIG).map(([key, config]) => (
                                        <option key={key} value={key}>
                                            {config.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </div>
                        </div>

                        <div className="sc-chart-card">
                            <InfoBox>
                                <p>This chart shows the distribution of the selected attribute across all ATUS survey samples. Each bar represents one year, with categories stacked to total 100%. Values shown are unweighted percentages based on the raw sample composition.</p>
                            </InfoBox>
                            <div className="sc-chart-title">
                                <span>{config.name} Distribution ({chartData?.labels[0] || '2003'}-{chartData?.labels[chartData?.labels.length - 1] || '2024'})</span>
                                <DownloadButton onClick={handleDownloadChart} />
                            </div>
                            <div className="sc-chart-container">
                                {chartData && (
                                    <Bar data={chartData} options={chartOptions} />
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Within Year Analysis - Table */}
                    <section className="sc-section">
                        <div className="sc-section-header">
                            <h2 className="sc-section-title">Sample Composition Within Year</h2>
                        </div>

                        <div className="sc-control-card">
                            <div className="sc-control-field">
                                <span className="sc-control-label">Select Year</span>
                                <Form.Select
                                    id="yearSelect"
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    className="sc-select"
                                >
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </Form.Select>
                            </div>
                        </div>

                        <div className="sc-table-container">
                            <InfoBox>
                                <p>
                                    This table shows the demographic composition of ATUS survey respondents for the selected year.<br /><br />
                                    <strong>Unweighted %:</strong> The raw percentage of respondents in each category, representing the actual sample composition without any statistical adjustments.<br /><br />
                                    <strong>Weighted %:</strong> Percentages adjusted using survey weights to represent the U.S. population (15 or older).<br /><br />
                                    <strong>Count:</strong> The number of survey respondents in each category (unweighted sample size).
                                </p>
                            </InfoBox>
                            <div className="sc-table-title">
                                <span>Sample Characteristics for {selectedYear}</span>
                                <DownloadButton onClick={handleDownloadTable} />
                            </div>
                            <table className="sc-data-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '20%' }}>Attribute</th>
                                        <th style={{ width: '25%' }}>Category</th>
                                        <th style={{ width: '18%' }}>Unweighted %</th>
                                        <th style={{ width: '18%' }}>Weighted %</th>
                                        <th style={{ width: '19%' }}>Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((row, index) => {
                                        // Group rows by attribute
                                        const isFirstInGroup = index === 0 || tableData[index - 1].attribute !== row.attribute;
                                        const isLastInGroup = index === tableData.length - 1 || tableData[index + 1].attribute !== row.attribute;
                                        const attributeRowCount = tableData.filter(r => r.attribute === row.attribute).length;
                                        
                                        // Build className for row
                                        const rowClasses = [];
                                        if (isFirstInGroup) rowClasses.push('sc-attribute-group-start');
                                        if (isLastInGroup) rowClasses.push('sc-attribute-group-end');

                                        return (
                                            <tr key={index} className={rowClasses.join(' ')}>
                                                {isFirstInGroup && (
                                                    <td
                                                        rowSpan={attributeRowCount}
                                                        className="sc-attribute-header"
                                                    >
                                                        {row.attribute}
                                                    </td>
                                                )}
                                                <td>{row.category}</td>
                                                <td>{row.unweightedPercent.toFixed(1)}%</td>
                                                <td>{row.weightedPercent.toFixed(1)}%</td>
                                                <td>{row.count.toLocaleString()}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </Container>
                <Footer
                    docRefID="sample_composition_footer"
                    page="hasVisitedSampleCompositionPage"
                    expiry="sampleCompositionExpiry"
                />
            </div>
        </>
    );
}

