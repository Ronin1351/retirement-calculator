// Get elements
const currentAssetsInput = document.getElementById('current-assets');
const assetsSlider = document.getElementById('assets-slider');
const planningYearsInput = document.getElementById('planning-years');
const yearsSlider = document.getElementById('years-slider');
const calculateButton = document.getElementById('calculate-button');
const monthlyBudgetDisplay = document.getElementById('monthly-budget');
const remainingBudgetDisplay = document.getElementById('remaining-budget');
const totalPercentageDisplay = document.getElementById('total-percentage');
const expenseChartCtx = document.getElementById('expense-chart').getContext('2d');
const tipsInsights = document.getElementById('tips-insights');

const expenseDivs = document.querySelectorAll('.expense');

// Synchronize inputs and sliders for assets and years
currentAssetsInput.addEventListener('input', () => {
    assetsSlider.value = currentAssetsInput.value;
});

assetsSlider.addEventListener('input', () => {
    currentAssetsInput.value = assetsSlider.value;
});

planningYearsInput.addEventListener('input', () => {
    yearsSlider.value = planningYearsInput.value;
});

yearsSlider.addEventListener('input', () => {
    planningYearsInput.value = yearsSlider.value;
});

// Variables
let monthlyBudget = 0;

// Calculate Monthly Budget
calculateButton.addEventListener('click', () => {
    const assets = parseFloat(currentAssetsInput.value);
    const years = parseFloat(planningYearsInput.value);
    monthlyBudget = (assets / (years * 12)).toFixed(2);
    monthlyBudgetDisplay.textContent = `$${monthlyBudget}`;

    updateExpenseAmounts();
    updateRemainingBudget();
    updateChart();
});

// Function to update expense amounts based on percentages
function updateExpenseAmounts() {
    expenseDivs.forEach(div => {
        const percentageInput = div.querySelector('.percentage-input');
        const expenseInput = div.querySelector('.expense-input');
        const percentage = parseFloat(percentageInput.value) || 0;
        const expenseAmount = ((monthlyBudget * percentage) / 100).toFixed(2);
        expenseInput.value = expenseAmount;
        const expenseSlider = div.querySelector('.expense-slider');
        expenseSlider.value = expenseAmount;
    });
    updateTotalPercentage();
}

// Update total percentage
function updateTotalPercentage() {
    let totalPercentage = 0;
    expenseDivs.forEach(div => {
        const percentageInput = div.querySelector('.percentage-input');
        totalPercentage += parseFloat(percentageInput.value) || 0;
    });
    totalPercentageDisplay.textContent = totalPercentage;
    if (totalPercentage !== 100) {
        totalPercentageDisplay.style.color = '#e74c3c'; // Red color
        tipsInsights.textContent = 'Total expense percentages must equal 100%.';
    } else {
        totalPercentageDisplay.style.color = '#27ae60'; // Green color
        tipsInsights.textContent = 'Expense percentages equal 100%.';
    }
}

// Synchronize percentage inputs and sliders
expenseDivs.forEach(div => {
    const percentageInput = div.querySelector('.percentage-input');
    const percentageSlider = div.querySelector('.percentage-slider');

    percentageInput.addEventListener('input', () => {
        percentageSlider.value = percentageInput.value;
        updateExpenseAmounts();
        updateRemainingBudget();
        updateChart();
    });

    percentageSlider.addEventListener('input', () => {
        percentageInput.value = percentageSlider.value;
        updateExpenseAmounts();
        updateRemainingBudget();
        updateChart();
    });
});

// Synchronize expense amount inputs and sliders
expenseDivs.forEach(div => {
    const expenseInput = div.querySelector('.expense-input');
    const expenseSlider = div.querySelector('.expense-slider');

    expenseInput.addEventListener('input', () => {
        expenseSlider.value = expenseInput.value;
        updateRemainingBudget();
        updateChart();
    });

    expenseSlider.addEventListener('input', () => {
        expenseInput.value = expenseSlider.value;
        updateRemainingBudget();
        updateChart();
    });
});

// Update Remaining Budget
function updateRemainingBudget() {
    let totalExpenses = 0;
    expenseDivs.forEach(div => {
        const expenseInput = div.querySelector('.expense-input');
        totalExpenses += parseFloat(expenseInput.value) || 0;
    });
    const remaining = (monthlyBudget - totalExpenses).toFixed(2);
    remainingBudgetDisplay.textContent = `$${remaining}`;

    // Update tips based on remaining budget and total percentage
    let totalPercentage = 0;
    expenseDivs.forEach(div => {
        const percentageInput = div.querySelector('.percentage-input');
        totalPercentage += parseFloat(percentageInput.value) || 0;
    });

    if (totalPercentage !== 100) {
        tipsInsights.textContent = 'Total expense percentages must equal 100%.';
    } else if (remaining < 0) {
        tipsInsights.textContent = 'Your expenses exceed your monthly budget. Consider reducing some expenses.';
    } else if (remaining > 0) {
        tipsInsights.textContent = 'You have a surplus. You might want to allocate more to savings or investments.';
    } else {
        tipsInsights.textContent = 'You have perfectly allocated your monthly budget.';
    }
}

// Initialize Chart
let expenseChart = new Chart(expenseChartCtx, {
    type: 'doughnut',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                '#3498db',
                '#1abc9c',
                '#9b59b6',
                '#f1c40f',
                '#e67e22',
                '#e74c3c',
                '#2ecc71'
            ]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            }
        }
    }
});

// Update Chart
function updateChart() {
    const labels = [];
    const data = [];
    expenseDivs.forEach(div => {
        const label = div.querySelector('label').textContent;
        const expenseInput = div.querySelector('.expense-input');
        labels.push(label);
        data.push(parseFloat(expenseInput.value) || 0);
    });
    expenseChart.data.labels = labels;
    expenseChart.data.datasets[0].data = data;
    expenseChart.update();
}
