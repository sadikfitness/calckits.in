/* ========================================
   CalcKit - Calculator Functions
   All 20 Calculator Implementations
   ======================================== */

/* ========================================
   FINANCE CALCULATORS
   ======================================== */

// 1. EMI Calculator
function calculateEMI() {
    const principal = parseFloat(document.getElementById('emi-principal').value);
    const rate = parseFloat(document.getElementById('emi-rate').value);
    const tenure = parseFloat(document.getElementById('emi-tenure').value);
    
    if (!principal || !rate || !tenure) {
        alert('Please fill all fields');
        return;
    }
    
    const monthlyRate = rate / (12 * 100);
    const months = tenure * 12;
    
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;
    
    document.getElementById('emi-monthly').textContent = formatCurrency(emi);
    document.getElementById('emi-interest').textContent = formatCurrency(totalInterest);
    document.getElementById('emi-total').textContent = formatCurrency(totalAmount);
    
    showResult('emi');
    
    // Create chart
    createChart('emi-chart', 'doughnut', 
        ['Principal', 'Interest'],
        [{
            data: [principal, totalInterest],
            backgroundColor: ['#2563eb', '#f59e0b'],
            borderWidth: 0
        }]
    );
    
    saveToHistory('calculation', { type: 'EMI', principal, rate, tenure, result: emi });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'EMI' });
    }
}

// 2. GST Calculator
function calculateGST() {
    const amount = parseFloat(document.getElementById('gst-amount').value);
    const rate = parseFloat(document.getElementById('gst-rate').value);
    const type = document.getElementById('gst-type').value;
    
    if (!amount || !rate) {
        alert('Please fill all fields');
        return;
    }
    
    let gstAmount, totalAmount;
    
    if (type === 'exclusive') {
        gstAmount = amount * (rate / 100);
        totalAmount = amount + gstAmount;
    } else {
        totalAmount = amount;
        gstAmount = amount - (amount * (100 / (100 + rate)));
    }
    
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    
    document.getElementById('gst-amount-result').textContent = formatCurrency(gstAmount);
    document.getElementById('gst-cgst').textContent = formatCurrency(cgst);
    document.getElementById('gst-sgst').textContent = formatCurrency(sgst);
    document.getElementById('gst-total').textContent = formatCurrency(totalAmount);
    
    showResult('gst');
    
    saveToHistory('calculation', { type: 'GST', amount, rate, gstType: type, result: gstAmount });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'GST' });
    }
}

// 3. FD Calculator
function calculateFD() {
    const principal = parseFloat(document.getElementById('fd-principal').value);
    const rate = parseFloat(document.getElementById('fd-rate').value);
    const tenure = parseFloat(document.getElementById('fd-tenure').value);
    
    if (!principal || !rate || !tenure) {
        alert('Please fill all fields');
        return;
    }
    
    // Compound interest formula: A = P(1 + r/n)^(nt)
    // For quarterly compounding: n = 4
    const n = 4;
    const maturityAmount = principal * Math.pow(1 + (rate / (n * 100)), n * tenure);
    const interest = maturityAmount - principal;
    
    document.getElementById('fd-maturity').textContent = formatCurrency(maturityAmount);
    document.getElementById('fd-interest').textContent = formatCurrency(interest);
    
    showResult('fd');
    
    // Create chart
    createChart('fd-chart', 'doughnut',
        ['Principal', 'Interest Earned'],
        [{
            data: [principal, interest],
            backgroundColor: ['#2563eb', '#10b981'],
            borderWidth: 0
        }]
    );
    
    saveToHistory('calculation', { type: 'FD', principal, rate, tenure, result: maturityAmount });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'FD' });
    }
}

// 4. SIP Calculator
function calculateSIP() {
    const monthly = parseFloat(document.getElementById('sip-monthly').value);
    const rate = parseFloat(document.getElementById('sip-rate').value);
    const tenure = parseFloat(document.getElementById('sip-tenure').value);
    
    if (!monthly || !rate || !tenure) {
        alert('Please fill all fields');
        return;
    }
    
    const monthlyRate = rate / (12 * 100);
    const months = tenure * 12;
    
    // SIP Future Value Formula
    const maturityValue = monthly * (Math.pow(1 + monthlyRate, months) - 1) / 
                         monthlyRate * (1 + monthlyRate);
    
    const invested = monthly * months;
    const returns = maturityValue - invested;
    
    document.getElementById('sip-maturity').textContent = formatCurrency(maturityValue);
    document.getElementById('sip-invested').textContent = formatCurrency(invested);
    document.getElementById('sip-returns').textContent = formatCurrency(returns);
    
    showResult('sip');
    
    // Create chart
    createChart('sip-chart', 'doughnut',
        ['Invested Amount', 'Returns'],
        [{
            data: [invested, returns],
            backgroundColor: ['#2563eb', '#10b981'],
            borderWidth: 0
        }]
    );
    
    saveToHistory('calculation', { type: 'SIP', monthly, rate, tenure, result: maturityValue });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'SIP' });
    }
}

// 5. Currency Converter
const exchangeRates = {
    'INR': 1,
    'USD': 0.012,
    'EUR': 0.011,
    'GBP': 0.0095,
    'AED': 0.044
};

function calculateCurrency() {
    const amount = parseFloat(document.getElementById('currency-amount').value);
    const from = document.getElementById('currency-from').value;
    const to = document.getElementById('currency-to').value;
    
    if (!amount) {
        alert('Please enter amount');
        return;
    }
    
    // Convert to INR first, then to target currency
    const inrAmount = amount / exchangeRates[from];
    const convertedAmount = inrAmount * exchangeRates[to];
    const rate = exchangeRates[to] / exchangeRates[from];
    
    const symbols = {
        'INR': '₹',
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'AED': 'AED '
    };
    
    document.getElementById('currency-converted').textContent = 
        `${symbols[to]}${formatNumber(convertedAmount, 2)}`;
    document.getElementById('currency-rate').textContent = 
        `Exchange rate: 1 ${from} = ${formatNumber(rate, 4)} ${to}`;
    
    showResult('currency');
    
    saveToHistory('calculation', { type: 'Currency', amount, from, to, result: convertedAmount });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'Currency' });
    }
}

/* ========================================
   EDUCATION CALCULATORS
   ======================================== */

// 6. Percentage Calculator
function calculatePercentage() {
    const value = parseFloat(document.getElementById('percent-value').value);
    const total = parseFloat(document.getElementById('percent-total').value);
    
    if (!value || !total) {
        alert('Please fill all fields');
        return;
    }
    
    const result = (value / 100) * total;
    
    document.getElementById('percentage-answer').textContent = formatNumber(result, 2);
    
    showResult('percentage');
    
    saveToHistory('calculation', { type: 'Percentage', value, total, result });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'Percentage' });
    }
}

// 7. Age Calculator
function calculateAge() {
    const dob = new Date(document.getElementById('age-dob').value);
    
    if (!dob || isNaN(dob)) {
        alert('Please select date of birth');
        return;
    }
    
    const today = new Date();
    const ageInMs = today - dob;
    const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(ageInDays / 365.25);
    const months = Math.floor((ageInDays % 365.25) / 30.44);
    const days = Math.floor((ageInDays % 365.25) % 30.44);
    
    // Next birthday
    const nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysToNext = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    
    document.getElementById('age-years').textContent = `${years} years, ${months} months, ${days} days`;
    document.getElementById('age-days').textContent = formatNumber(ageInDays, 0);
    document.getElementById('age-next').textContent = `${daysToNext} days`;
    
    showResult('age');
    
    saveToHistory('calculation', { type: 'Age', dob: dob.toISOString(), result: years });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'Age' });
    }
}

// 8. GPA Calculator
function calculateGPA() {
    const subjects = document.querySelectorAll('.gpa-subject');
    
    if (subjects.length === 0) {
        alert('Please add at least one subject');
        return;
    }
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    subjects.forEach(subject => {
        const credits = parseFloat(subject.querySelector('.gpa-credits').value) || 0;
        const grade = parseFloat(subject.querySelector('.gpa-grade').value) || 0;
        
        totalPoints += credits * grade;
        totalCredits += credits;
    });
    
    if (totalCredits === 0) {
        alert('Please enter valid credits');
        return;
    }
    
    const gpa = totalPoints / totalCredits;
    
    document.getElementById('gpa-value').textContent = formatNumber(gpa, 2);
    document.getElementById('gpa-total-credits').textContent = `Total Credits: ${totalCredits}`;
    
    showResult('gpa');
    
    saveToHistory('calculation', { type: 'GPA', totalCredits, result: gpa });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'GPA' });
    }
}

// 9. Compound Interest Calculator
function calculateCompound() {
    const principal = parseFloat(document.getElementById('compound-principal').value);
    const rate = parseFloat(document.getElementById('compound-rate').value);
    const time = parseFloat(document.getElementById('compound-time').value);
    const frequency = parseFloat(document.getElementById('compound-frequency').value);
    
    if (!principal || !rate || !time) {
        alert('Please fill all fields');
        return;
    }
    
    // A = P(1 + r/n)^(nt)
    const finalAmount = principal * Math.pow(1 + (rate / (frequency * 100)), frequency * time);
    const interest = finalAmount - principal;
    
    document.getElementById('compound-final').textContent = formatCurrency(finalAmount);
    document.getElementById('compound-interest').textContent = formatCurrency(interest);
    
    showResult('compound');
    
    // Create chart
    createChart('compound-chart', 'doughnut',
        ['Principal', 'Interest'],
        [{
            data: [principal, interest],
            backgroundColor: ['#2563eb', '#10b981'],
            borderWidth: 0
        }]
    );
    
    saveToHistory('calculation', { type: 'Compound Interest', principal, rate, time, result: finalAmount });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'Compound' });
    }
}

/* ========================================
   HEALTH CALCULATORS
   ======================================== */

// 10. BMI Calculator
function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const height = parseFloat(document.getElementById('bmi-height').value);
    
    if (!weight || !height) {
        alert('Please fill all fields');
        return;
    }
    
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';
    
    document.getElementById('bmi-value').textContent = formatNumber(bmi, 1);
    document.getElementById('bmi-category').textContent = category;
    
    showResult('bmi');
    
    saveToHistory('calculation', { type: 'BMI', weight, height, result: bmi });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'BMI' });
    }
}

// 11. BMR Calculator
function calculateBMR() {
    const gender = document.getElementById('bmr-gender').value;
    const age = parseFloat(document.getElementById('bmr-age').value);
    const weight = parseFloat(document.getElementById('bmr-weight').value);
    const height = parseFloat(document.getElementById('bmr-height').value);
    
    if (!age || !weight || !height) {
        alert('Please fill all fields');
        return;
    }
    
    let bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    document.getElementById('bmr-value').textContent = `${Math.round(bmr)} calories/day`;
    
    // Activity levels
    const activities = [
        { name: 'Sedentary (little/no exercise)', multiplier: 1.2 },
        { name: 'Lightly active (1-3 days/week)', multiplier: 1.375 },
        { name: 'Moderately active (3-5 days/week)', multiplier: 1.55 },
        { name: 'Very active (6-7 days/week)', multiplier: 1.725 },
        { name: 'Extra active (athlete)', multiplier: 1.9 }
    ];
    
    let activityHTML = '';
    activities.forEach(activity => {
        const calories = Math.round(bmr * activity.multiplier);
        activityHTML += `
            <div class="activity-level-item">
                <span>${activity.name}</span>
                <strong>${calories} cal/day</strong>
            </div>
        `;
    });
    
    document.getElementById('bmr-activity').innerHTML = activityHTML;
    
    showResult('bmr');
    
    saveToHistory('calculation', { type: 'BMR', gender, age, weight, height, result: bmr });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'BMR' });
    }
}

// 12. Pregnancy Calculator
function calculatePregnancy() {
    const lmp = new Date(document.getElementById('pregnancy-lmp').value);
    
    if (!lmp || isNaN(lmp)) {
        alert('Please select LMP date');
        return;
    }
    
    const today = new Date();
    const dueDate = new Date(lmp);
    dueDate.setDate(dueDate.getDate() + 280); // 40 weeks
    
    const daysPregnant = Math.floor((today - lmp) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(daysPregnant / 7);
    const days = daysPregnant % 7;
    
    const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    let trimester = '';
    if (weeks <= 12) trimester = 'First Trimester';
    else if (weeks <= 26) trimester = 'Second Trimester';
    else trimester = 'Third Trimester';
    
    document.getElementById('pregnancy-due').textContent = dueDate.toLocaleDateString('en-IN');
    document.getElementById('pregnancy-week').textContent = `${weeks} weeks, ${days} days`;
    document.getElementById('pregnancy-days').textContent = daysRemaining > 0 ? daysRemaining : 0;
    document.getElementById('pregnancy-trimester').textContent = trimester;
    
    showResult('pregnancy');
    
    saveToHistory('calculation', { type: 'Pregnancy', lmp: lmp.toISOString(), dueDate: dueDate.toISOString() });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'Pregnancy' });
    }
}

// 13. Calorie Calculator
function calculateCalorie() {
    const gender = document.getElementById('calorie-gender').value;
    const age = parseFloat(document.getElementById('calorie-age').value);
    const weight = parseFloat(document.getElementById('calorie-weight').value);
    const height = parseFloat(document.getElementById('calorie-height').value);
    const activity = parseFloat(document.getElementById('calorie-activity').value);
    const goal = document.getElementById('calorie-goal').value;
    
    if (!age || !weight || !height) {
        alert('Please fill all fields');
        return;
    }
    
    // Calculate BMR
    let bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    // Apply activity level
    let dailyCalories = bmr * activity;
    
    // Apply goal
    let weeklyChange = 0;
    if (goal === 'lose') {
        dailyCalories -= 500;
        weeklyChange = -0.5;
    } else if (goal === 'gain') {
        dailyCalories += 500;
        weeklyChange = 0.5;
    }
    
    document.getElementById('calorie-daily').textContent = `${Math.round(dailyCalories)} cal/day`;
    document.getElementById('calorie-change').textContent = `${weeklyChange > 0 ? '+' : ''}${weeklyChange} kg/week`;
    
    showResult('calorie');
    
    // Create chart
    const protein = Math.round(dailyCalories * 0.3 / 4);
    const carbs = Math.round(dailyCalories * 0.4 / 4);
    const fats = Math.round(dailyCalories * 0.3 / 9);
    
    createChart('calorie-chart', 'doughnut',
        ['Protein (30%)', 'Carbs (40%)', 'Fats (30%)'],
        [{
            data: [protein, carbs, fats],
            backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
            borderWidth: 0
        }]
    );
    
    saveToHistory('calculation', { type: 'Calorie', gender, age, weight, height, goal, result: dailyCalories });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'Calorie' });
    }
}

/* ========================================
   BUSINESS CALCULATORS
   ======================================== */

// 14. Profit Calculator
function calculateProfit() {
    const cost = parseFloat(document.getElementById('profit-cost').value);
    const selling = parseFloat(document.getElementById('profit-selling').value);
    
    if (!cost || !selling) {
        alert('Please fill all fields');
        return;
    }
    
    const profit = selling - cost;
    const profitMargin = (profit / selling) * 100;
    const markup = (profit / cost) * 100;
    
    document.getElementById('profit-amount').textContent = formatCurrency(profit);
    document.getElementById('profit-margin').textContent = formatNumber(profitMargin, 2) + '%';
    document.getElementById('profit-markup').textContent = formatNumber(markup, 2) + '%';
    
    showResult('profit');
    
    saveToHistory('calculation', { type: 'Profit', cost, selling, result: profit });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'Profit' });
    }
}

// 15. ROI Calculator
function calculateROI() {
    const initial = parseFloat(document.getElementById('roi-initial').value);
    const final = parseFloat(document.getElementById('roi-final').value);
    
    if (!initial || !final) {
        alert('Please fill all fields');
        return;
    }
    
    const gain = final - initial;
    const roi = (gain / initial) * 100;
    
    document.getElementById('roi-percentage').textContent = formatNumber(roi, 2) + '%';
    document.getElementById('roi-gain').textContent = formatCurrency(gain);
    
    showResult('roi');
    
    saveToHistory('calculation', { type: 'ROI', initial, final, result: roi });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'ROI' });
    }
}

// 16. Salary Calculator (Indian Tax Regime)
function calculateSalary() {
    const gross = parseFloat(document.getElementById('salary-gross').value);
    const standardDeduction = parseFloat(document.getElementById('salary-deduction').value);
    const deduction80c = parseFloat(document.getElementById('salary-80c').value);
    
    if (!gross) {
        alert('Please fill gross salary');
        return;
    }
    
    const taxableIncome = gross - standardDeduction - deduction80c;
    
    // Indian Tax Slabs (New Regime 2023-24)
    let tax = 0;
    if (taxableIncome <= 300000) {
        tax = 0;
    } else if (taxableIncome <= 600000) {
        tax = (taxableIncome - 300000) * 0.05;
    } else if (taxableIncome <= 900000) {
        tax = 15000 + (taxableIncome - 600000) * 0.10;
    } else if (taxableIncome <= 1200000) {
        tax = 45000 + (taxableIncome - 900000) * 0.15;
    } else if (taxableIncome <= 1500000) {
        tax = 90000 + (taxableIncome - 1200000) * 0.20;
    } else {
        tax = 150000 + (taxableIncome - 1500000) * 0.30;
    }
    
    // Add 4% cess
    tax = tax * 1.04;
    
    const takeHome = gross - tax;
    const monthly = takeHome / 12;
    
    document.getElementById('salary-tax').textContent = formatCurrency(tax);
    document.getElementById('salary-takehome').textContent = formatCurrency(takeHome);
    document.getElementById('salary-monthly').textContent = formatCurrency(monthly);
    
    showResult('salary');
    
    // Create chart
    createChart('salary-chart', 'doughnut',
        ['Take Home', 'Tax'],
        [{
            data: [takeHome, tax],
            backgroundColor: ['#10b981', '#ef4444'],
            borderWidth: 0
        }]
    );
    
    saveToHistory('calculation', { type: 'Salary', gross, tax, takeHome });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'Salary' });
    }
}

// 17. Retirement Calculator
function calculateRetirement() {
    const currentAge = parseFloat(document.getElementById('retirement-age').value);
    const retirementAge = parseFloat(document.getElementById('retirement-target-age').value);
    const monthlyExpense = parseFloat(document.getElementById('retirement-expense').value);
    const returnRate = parseFloat(document.getElementById('retirement-return').value);
    const inflationRate = parseFloat(document.getElementById('retirement-inflation').value);
    
    if (!currentAge || !retirementAge || !monthlyExpense || !returnRate || !inflationRate) {
        alert('Please fill all fields');
        return;
    }
    
    const yearsToRetire = retirementAge - currentAge;
    const yearsInRetirement = 85 - retirementAge; // Assuming life expectancy of 85
    
    // Future value of monthly expenses at retirement
    const futureMonthlyExpense = monthlyExpense * Math.pow(1 + inflationRate/100, yearsToRetire);
    
    // Corpus needed for retirement
    const annualExpense = futureMonthlyExpense * 12;
    const realReturn = ((1 + returnRate/100) / (1 + inflationRate/100)) - 1;
    const corpusNeeded = annualExpense * ((1 - Math.pow(1 + realReturn, -yearsInRetirement)) / realReturn);
    
    // Monthly SIP needed
    const monthlyRate = returnRate / (12 * 100);
    const months = yearsToRetire * 12;
    const monthlySIP = corpusNeeded / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate));
    
    document.getElementById('retirement-corpus').textContent = formatCurrency(corpusNeeded);
    document.getElementById('retirement-monthly').textContent = formatCurrency(monthlySIP);
    document.getElementById('retirement-years').textContent = yearsToRetire;
    
    showResult('retirement');
    
    saveToHistory('calculation', { type: 'Retirement', currentAge, retirementAge, result: corpusNeeded });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'Retirement' });
    }
}

/* ========================================
   DAILY LIFE CALCULATORS
   ======================================== */

// 18. Fuel Calculator
function calculateFuel() {
    const distance = parseFloat(document.getElementById('fuel-distance').value);
    const mileage = parseFloat(document.getElementById('fuel-mileage').value);
    const price = parseFloat(document.getElementById('fuel-price').value);
    
    if (!distance || !mileage || !price) {
        alert('Please fill all fields');
        return;
    }
    
    const fuelNeeded = distance / mileage;
    const cost = fuelNeeded * price;
    
    document.getElementById('fuel-needed').textContent = formatNumber(fuelNeeded, 2) + ' L';
    document.getElementById('fuel-cost').textContent = formatCurrency(cost);
    
    showResult('fuel');
    
    saveToHistory('calculation', { type: 'Fuel', distance, mileage, price, result: cost });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'Fuel' });
    }
}

// 19. Discount Calculator
function calculateDiscount() {
    const original = parseFloat(document.getElementById('discount-original').value);
    const percent = parseFloat(document.getElementById('discount-percent').value);
    
    if (!original || !percent) {
        alert('Please fill all fields');
        return;
    }
    
    const savings = original * (percent / 100);
    const final = original - savings;
    
    document.getElementById('discount-final').textContent = formatCurrency(final);
    document.getElementById('discount-savings').textContent = formatCurrency(savings);
    
    showResult('discount');
    
    saveToHistory('calculation', { type: 'Discount', original, percent, result: final });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'Discount' });
    }
}

// 20. Recipe Converter
function calculateRecipe() {
    const original = parseFloat(document.getElementById('recipe-original').value);
    const desired = parseFloat(document.getElementById('recipe-desired').value);
    
    if (!original || !desired) {
        alert('Please fill all fields');
        return;
    }
    
    const ratio = desired / original;
    
    document.getElementById('recipe-ratio').textContent = formatNumber(ratio, 2) + 'x';
    
    showResult('recipe');
    
    saveToHistory('calculation', { type: 'Recipe', original, desired, result: ratio });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'Recipe' });
    }
}

// 21. Tip Calculator
function calculateTip() {
    const bill = parseFloat(document.getElementById('tip-bill').value);
    const percent = parseFloat(document.getElementById('tip-percent').value);
    const people = parseFloat(document.getElementById('tip-people').value);
    
    if (!bill || !percent || !people) {
        alert('Please fill all fields');
        return;
    }
    
    const tipAmount = bill * (percent / 100);
    const total = bill + tipAmount;
    const perPerson = total / people;
    
    document.getElementById('tip-amount').textContent = formatCurrency(tipAmount);
    document.getElementById('tip-total').textContent = formatCurrency(total);
    document.getElementById('tip-per-person').textContent = formatCurrency(perPerson);
    
    showResult('tip');
    
    saveToHistory('calculation', { type: 'Tip', bill, percent, people, result: total });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calculation', { calculator_type: 'Tip' });
    }
}

// Initialize - Set current date for date inputs
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    const pregLMPInput = document.getElementById('pregnancy-lmp');
    if (pregLMPInput) {
        pregLMPInput.setAttribute('max', today);
    }
});

