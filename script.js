/* ========================================
   CalcKit - Main JavaScript
   ======================================== */

// Theme Management
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Load theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Log theme change
    if (typeof gtag !== 'undefined') {
        gtag('event', 'theme_change', {
            'theme': newTheme
        });
    }
});

// Tab Navigation
const tabButtons = document.querySelectorAll('.tab-btn');
const categorySections = document.querySelectorAll('.category-section');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        
        // Update active tab
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Show corresponding category
        categorySections.forEach(section => {
            section.classList.remove('active');
            if (section.getAttribute('data-category') === category) {
                section.classList.add('active');
            }
        });
        
        // Save to history
        saveToHistory('category_view', category);
        
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'category_view', {
                'category_name': category
            });
        }
    });
});

// Search Functionality
const searchInput = document.getElementById('searchInput');
const calculatorCards = document.querySelectorAll('.calculator-card');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    let foundCount = 0;
    calculatorCards.forEach(card => {
        const title = card.querySelector('.calc-title').textContent.toLowerCase();
        const description = card.querySelector('.calc-description').textContent.toLowerCase();
        const category = card.closest('.category-section').getAttribute('data-category');
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
            foundCount++;
            
            // Show parent category if hidden
            const parentSection = card.closest('.category-section');
            if (!parentSection.classList.contains('active') && searchTerm.length > 0) {
                categorySections.forEach(s => s.classList.remove('active'));
                parentSection.classList.add('active');
            }
        } else {
            if (searchTerm.length > 0) {
                card.style.display = 'none';
            } else {
                card.style.display = 'block';
            }
        }
    });
    
    // Google Analytics
    if (searchTerm.length > 2 && typeof gtag !== 'undefined') {
        gtag('event', 'search', {
            'search_term': searchTerm
        });
    }
});

// Switch Calculator Function
function switchCalculator(calculatorName) {
    event.preventDefault();
    
    // Find the calculator card
    const targetCard = document.querySelector(`[data-calculator="${calculatorName}"]`);
    if (!targetCard) return;
    
    // Find parent category
    const parentSection = targetCard.closest('.category-section');
    const category = parentSection.getAttribute('data-category');
    
    // Switch to category
    categorySections.forEach(section => section.classList.remove('active'));
    parentSection.classList.add('active');
    
    // Update active tab
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
    
    // Scroll to calculator
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Highlight animation
    targetCard.style.animation = 'none';
    setTimeout(() => {
        targetCard.style.animation = 'pulse 1s ease-in-out';
    }, 10);
}

// History Management
function saveToHistory(type, data) {
    try {
        const history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
        history.unshift({
            type,
            data,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 items
        if (history.length > 50) {
            history.pop();
        }
        
        localStorage.setItem('calcHistory', JSON.stringify(history));
    } catch (e) {
        console.error('Error saving to history:', e);
    }
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

// Format Number
function formatNumber(num, decimals = 2) {
    return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals
    }).format(num);
}

// Download Result Function
function downloadResult(calculatorType) {
    let fileName = `${calculatorType}-result-${Date.now()}.txt`;
    let content = getResultText(calculatorType);
    
    // Add header
    let fullContent = `CalcKit - ${calculatorType.toUpperCase()} Calculator Results\n`;
    fullContent += '='.repeat(50) + '\n';
    fullContent += `Date: ${new Date().toLocaleString('en-IN')}\n\n`;
    fullContent += content;
    fullContent += '\n\n' + '='.repeat(50) + '\n';
    fullContent += 'Generated by CalcKit - https://calckits.in\n';
    
    // Create download
    const blob = new Blob([fullContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    
    // Show feedback
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓ Downloaded!';
    btn.style.background = 'linear-gradient(135deg, #059669, #047857)';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 2000);
    
    // Save to history
    saveToHistory('download', { calculator: calculatorType, fileName });
    
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download_result', {
            'calculator_type': calculatorType
        });
    }
}

// Get Result Text for Copy/Download
function getResultText(calculatorType) {
    let textToCopy = '';
    
    switch(calculatorType) {
        case 'emi':
            const emiMonthly = document.getElementById('emi-monthly').textContent;
            const emiInterest = document.getElementById('emi-interest').textContent;
            const emiTotal = document.getElementById('emi-total').textContent;
            textToCopy = `EMI Calculator Results:\nMonthly EMI: ${emiMonthly}\nTotal Interest: ${emiInterest}\nTotal Amount: ${emiTotal}`;
            break;
        case 'gst':
            const gstAmount = document.getElementById('gst-amount-result').textContent;
            const gstTotal = document.getElementById('gst-total').textContent;
            textToCopy = `GST Calculator Results:\nGST Amount: ${gstAmount}\nTotal Amount: ${gstTotal}`;
            break;
        case 'bmi':
            const bmiValue = document.getElementById('bmi-value').textContent;
            const bmiCategory = document.getElementById('bmi-category').textContent;
            textToCopy = `BMI Calculator Results:\nBMI: ${bmiValue}\nCategory: ${bmiCategory}`;
            break;
        case 'percentage':
            const percentageAnswer = document.getElementById('percentage-answer').textContent;
            textToCopy = `Percentage Result: ${percentageAnswer}`;
            break;
        case 'age':
            const ageYears = document.getElementById('age-years').textContent;
            const ageDays = document.getElementById('age-days').textContent;
            const ageNext = document.getElementById('age-next').textContent;
            textToCopy = `Age Calculator Results:\nAge: ${ageYears}\nTotal Days: ${ageDays}\nNext Birthday: ${ageNext}`;
            break;
        case 'discount':
            const discountFinal = document.getElementById('discount-final').textContent;
            const discountSavings = document.getElementById('discount-savings').textContent;
            textToCopy = `Discount Calculator Results:\nFinal Price: ${discountFinal}\nYou Save: ${discountSavings}`;
            break;
        default:
            const resultSection = document.getElementById(`${calculatorType}-result`);
            if (resultSection) {
                const resultValues = resultSection.querySelectorAll('.result-value');
                const resultTitles = resultSection.querySelectorAll('h4');
                textToCopy = `${calculatorType.toUpperCase()} Calculator Results:\n`;
                resultTitles.forEach((title, index) => {
                    if (resultValues[index]) {
                        textToCopy += `${title.textContent}: ${resultValues[index].textContent}\n`;
                    }
                });
            }
    }
    
    return textToCopy;
}

// Copy Result Function
function copyResult(calculatorType) {
    const textToCopy = getResultText(calculatorType);
    
    // Copy to clipboard
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Show feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        btn.style.background = '#10b981';
        btn.style.color = 'white';
        btn.style.borderColor = '#10b981';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 2000);
        
        // Save to history
        saveToHistory('copy', { calculator: calculatorType, result: textToCopy });
        
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'copy_result', {
                'calculator_type': calculatorType
            });
        }
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
    });
}

// Show Result Section
function showResult(calculatorId) {
    const resultSection = document.getElementById(`${calculatorId}-result`);
    if (resultSection) {
        resultSection.style.display = 'grid';
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// GPA Calculator - Add Subject
function addGPASubject() {
    const container = document.getElementById('gpa-subjects');
    const newSubject = document.createElement('div');
    newSubject.className = 'gpa-subject';
    newSubject.innerHTML = `
        <input type="text" placeholder="Subject" class="gpa-subject-name">
        <input type="number" placeholder="Credits" class="gpa-credits" min="1" max="10" value="3">
        <select class="gpa-grade">
            <option value="10">A+ (10)</option>
            <option value="9">A (9)</option>
            <option value="8">B+ (8)</option>
            <option value="7">B (7)</option>
            <option value="6">C (6)</option>
            <option value="5">D (5)</option>
            <option value="0">F (0)</option>
        </select>
    `;
    container.appendChild(newSubject);
}

// Create Chart Helper
function createChart(canvasId, type, labels, datasets, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    
    // Destroy existing chart if any
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    color: isDark ? '#f1f5f9' : '#1e293b',
                    font: {
                        family: 'Poppins'
                    }
                }
            }
        },
        scales: type !== 'doughnut' && type !== 'pie' ? {
            y: {
                ticks: {
                    color: isDark ? '#94a3b8' : '#64748b'
                },
                grid: {
                    color: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(148, 163, 184, 0.2)'
                }
            },
            x: {
                ticks: {
                    color: isDark ? '#94a3b8' : '#64748b'
                },
                grid: {
                    color: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(148, 163, 184, 0.2)'
                }
            }
        } : {}
    };
    
    canvas.chart = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: { ...defaultOptions, ...options }
    });
    
    return canvas.chart;
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}

// Initialize tooltips and popovers if needed
document.addEventListener('DOMContentLoaded', () => {
    console.log('CalcKit initialized successfully');
    
    // Set current year in footer if needed
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('Back online');
});

window.addEventListener('offline', () => {
    console.log('You are offline. Some features may not work.');
});

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Prevent form submission on Enter key in calculator forms
document.querySelectorAll('.calc-form').forEach(form => {
    form.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Find and click the calculate button in this form
            const calcBtn = form.querySelector('.calc-btn');
            if (calcBtn) calcBtn.click();
        }
    });
});

// Add pulse animation class
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
`;
document.head.appendChild(style);

/* ========================================
   NEW FEATURES - Footer Navigation & More
   ======================================== */

// Navigate to Category from Footer Links
function navigateToCategory(category) {
    // Update tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const categorySections = document.querySelectorAll('.category-section');
    
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
    
    categorySections.forEach(section => {
        section.classList.remove('active');
        if (section.getAttribute('data-category') === category) {
            section.classList.add('active');
        }
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Modal Functions
function openModal(type) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modal.classList.add('active');
    
    switch(type) {
        case 'history':
            showHistory(modalBody);
            break;
        case 'favorites':
            showFavorites(modalBody);
            break;
        case 'privacy':
            showPrivacyPolicy(modalBody);
            break;
        case 'contact':
            showContactForm(modalBody);
            break;
    }
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// Click outside to close modal
document.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
        closeModal();
    }
});

// Show Calculation History
function showHistory(container) {
    const history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    
    if (history.length === 0) {
        container.innerHTML = '<h3>Calculation History</h3><p>No calculations yet. Start using calculators to see your history here!</p>';
        return;
    }
    
    let html = '<h3>📊 Calculation History</h3>';
    history.slice(0, 20).forEach((item, index) => {
        const date = new Date(item.timestamp).toLocaleString('en-IN');
        html += `
            <div class="history-item">
                <h4>${item.data.type || item.type}</h4>
                <p>${JSON.stringify(item.data).substring(0, 100)}...</p>
                <small>${date}</small>
            </div>
        `;
    });
    
    html += `<button class="calc-btn" onclick="clearHistory()">Clear History</button>`;
    container.innerHTML = html;
}

// Show Favorites
function showFavorites(container) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.length === 0) {
        container.innerHTML = '<h3>⭐ Favorites</h3><p>No favorite calculators yet. Click the star icon on any calculator to add it here!</p>';
        return;
    }
    
    let html = '<h3>⭐ Your Favorite Calculators</h3>';
    favorites.forEach(fav => {
        html += `
            <div class="history-item">
                <h4>${fav}</h4>
                <button onclick="navigateToCalculator('${fav}')">Open</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Show Privacy Policy
function showPrivacyPolicy(container) {
    container.innerHTML = `
        <h3>🔒 Privacy Policy</h3>
        <p><strong>Last updated:</strong> October 28, 2025</p>
        
        <h4>Data Collection</h4>
        <p>CalcKit is committed to your privacy. We do NOT collect, store, or transmit any personal data to external servers.</p>
        
        <h4>Local Storage</h4>
        <p>We use browser LocalStorage to save:</p>
        <ul>
            <li>Your calculation history (stored locally on your device)</li>
            <li>Theme preference (dark/light mode)</li>
            <li>Favorite calculators</li>
        </ul>
        
        <h4>Third-Party Services</h4>
        <p>We may use:</p>
        <ul>
            <li>Google Analytics for anonymous usage statistics</li>
            <li>Google AdSense for advertisements</li>
        </ul>
        
        <h4>Your Rights</h4>
        <p>You can clear all local data anytime by clicking "Clear All Data" in the Resources menu.</p>
        
        <h4>Contact</h4>
        <p>For privacy concerns, please contact us through the Contact form.</p>
    `;
}

// Show Contact Form
function showContactForm(container) {
    container.innerHTML = `
        <h3>📧 Contact Us</h3>
        <div class="calc-form">
            <div class="input-group">
                <label>Name</label>
                <input type="text" id="contact-name" placeholder="Your name">
            </div>
            <div class="input-group">
                <label>Email</label>
                <input type="email" id="contact-email" placeholder="your@email.com">
            </div>
            <div class="input-group">
                <label>Message</label>
                <textarea id="contact-message" rows="5" placeholder="Your message..." style="width: 100%; padding: 0.875rem; border: 2px solid var(--border-color); border-radius: 12px; background: var(--bg-secondary); color: var(--text-primary); font-family: 'Poppins', sans-serif;"></textarea>
            </div>
            <button class="calc-btn" onclick="submitContact()">Send Message</button>
        </div>
    `;
}

// Submit Contact Form
function submitContact() {
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;
    
    if (!name || !email || !message) {
        alert('Please fill all fields');
        return;
    }
    
    // In a real app, you'd send this to a server
    alert(`Thank you ${name}! We'll get back to you soon at ${email}`);
    closeModal();
    
    // Track with analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_form_submit');
    }
}

// Clear History
function clearHistory() {
    if (confirm('Clear all calculation history?')) {
        localStorage.removeItem('calcHistory');
        closeModal();
        alert('History cleared!');
    }
}

// Clear All Data
function clearAllData() {
    if (confirm('This will clear ALL your data including history, favorites, and preferences. Continue?')) {
        localStorage.clear();
        alert('All data cleared! Page will reload.');
        location.reload();
    }
}

// Newsletter Subscription
function subscribeNewsletter() {
    const email = document.getElementById('newsletter-email').value;
    
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email');
        return;
    }
    
    // In a real app, you'd send this to your email service
    alert(`Thank you! You've subscribed with ${email}`);
    document.getElementById('newsletter-email').value = '';
    
    // Track with analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'newsletter_subscribe', { email_domain: email.split('@')[1] });
    }
}

// Floating Action Button (FAB) Menu
function toggleFabMenu() {
    const fabMenu = document.getElementById('fab-menu');
    fabMenu.classList.toggle('active');
}

// Scroll to Top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Export All Results
function exportAllResults() {
    const history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    
    if (history.length === 0) {
        alert('No calculations to export!');
        return;
    }
    
    let exportText = 'CalcKit - Calculation History Export\n';
    exportText += '====================================\n\n';
    
    history.forEach((item, index) => {
        exportText += `${index + 1}. ${item.type}\n`;
        exportText += `   Date: ${new Date(item.timestamp).toLocaleString('en-IN')}\n`;
        exportText += `   Data: ${JSON.stringify(item.data, null, 2)}\n\n`;
    });
    
    // Create download
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calckit-history-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('History exported successfully!');
}

// Quick Calculator
let quickCalcExpression = '';

function openQuickCalc() {
    document.getElementById('quick-calc').classList.add('active');
}

function closeQuickCalc() {
    document.getElementById('quick-calc').classList.remove('active');
}

function quickCalc(value) {
    const input = document.getElementById('quick-calc-input');
    const result = document.getElementById('quick-calc-result');
    
    if (value === '=') {
        try {
            const calc = eval(input.value);
            result.textContent = '= ' + calc;
            input.value = calc;
        } catch (e) {
            result.textContent = '= Error';
        }
    } else {
        input.value += value;
        try {
            const calc = eval(input.value);
            result.textContent = '= ' + calc;
        } catch (e) {
            result.textContent = '= ...';
        }
    }
}

function quickCalcClear() {
    document.getElementById('quick-calc-input').value = '';
    document.getElementById('quick-calc-result').textContent = '= 0';
}

// Auto-calculate in quick calc on input
document.addEventListener('DOMContentLoaded', () => {
    const quickCalcInput = document.getElementById('quick-calc-input');
    if (quickCalcInput) {
        quickCalcInput.addEventListener('input', (e) => {
            try {
                const result = eval(e.target.value);
                document.getElementById('quick-calc-result').textContent = '= ' + result;
            } catch (err) {
                document.getElementById('quick-calc-result').textContent = '= ...';
            }
        });
    }
    
    // Update calculation counter
    updateCalculationCounter();
});

// Update Calculation Counter
function updateCalculationCounter() {
    const history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    const totalCalcs = document.getElementById('total-calculations');
    if (totalCalcs) {
        totalCalcs.textContent = `${history.length} calculations`;
    }
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+K or Cmd+K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // Ctrl+H or Cmd+H for history
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        openModal('history');
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        closeModal();
        closeQuickCalc();
    }
    
    // Ctrl+Q or Cmd+Q for quick calculator
    if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
        e.preventDefault();
        openQuickCalc();
    }
});

// Show quick calculator button on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        document.querySelector('.fab-container').style.display = 'block';
    } else {
        document.querySelector('.fab-container').style.display = 'none';
    }
});

// Initialize FAB as hidden
if (document.querySelector('.fab-container')) {
    document.querySelector('.fab-container').style.display = 'none';
}

console.log('✅ CalcKit Enhanced Features Loaded!');
console.log('📝 Keyboard shortcuts:');
console.log('   Ctrl/Cmd + K: Search');
console.log('   Ctrl/Cmd + H: History');
console.log('   Ctrl/Cmd + Q: Quick Calculator');
console.log('   Escape: Close modals');

