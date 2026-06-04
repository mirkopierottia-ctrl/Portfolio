// Initialize Lucide Icons
lucide.createIcons();

// Chart.js Setup
document.addEventListener('DOMContentLoaded', () => {
    // Splash Screen Logic
    const splashScreen = document.getElementById('splash-screen');
    const splashLogoContainer = document.getElementById('splash-logo-container');
    const splashLogin = document.getElementById('splash-login');
    const loginBtn = document.getElementById('login-btn');
    const appContainer = document.getElementById('app-container');

    // Step 1: Animate logo up and show login form after 1.5s
    setTimeout(() => {
        splashLogoContainer.style.transform = 'translateY(-120px) scale(0.8)';
        splashLogoContainer.style.opacity = '0.5';
        
        splashLogin.style.opacity = '1';
        splashLogin.style.transform = 'translate(-50%, -50%)';
        splashLogin.style.pointerEvents = 'auto';
    }, 1500);

    // Step 2: Unlock system
    loginBtn.addEventListener('click', () => {
        const originalText = loginBtn.innerHTML;
        loginBtn.innerHTML = 'Verificando... <i data-lucide="loader-2" class="spin"></i>';
        lucide.createIcons();
        
        setTimeout(() => {
            splashScreen.style.opacity = '0';
            setTimeout(() => {
                splashScreen.style.visibility = 'hidden';
                appContainer.style.visibility = 'visible';
                appContainer.style.opacity = '1';
            }, 800);
        }, 1000);
    });

    // Initialize Lucide Icons
    lucide.createIcons();
    
    const ctx = document.getElementById('portfolioChart').getContext('2d');
    
    // Gradient fill for the chart
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 255, 157, 0.3)');   
    gradient.addColorStop(1, 'rgba(0, 255, 157, 0.0)');

    const data = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: 'Balance del Portafolio',
            data: [65000, 72000, 68000, 85000, 95000, 110000, 124500],
            borderColor: '#00FF9D',
            backgroundColor: gradient,
            borderWidth: 2,
            pointBackgroundColor: '#07090e',
            pointBorderColor: '#00FF9D',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.4 // Smooth curves
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 20, 0.9)',
                    titleColor: '#8b949e',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b949e'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b949e',
                        callback: function(value, index, values) {
                            if(value >= 1000) {
                                return '$' + value/1000 + 'k';
                            }
                            return '$' + value;
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
        }
    };

    let portfolioChart = new Chart(ctx, config);

    // Dynamic Chart Update Logic
    const chartFilter = document.getElementById('chart-filter');
    const chartDatasets = {
        '6m': {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            data: [65000, 72000, 68000, 85000, 95000, 124500]
        },
        '1y': {
            labels: ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            data: [45000, 48000, 46000, 52000, 58000, 61000, 65000, 72000, 68000, 85000, 95000, 124500]
        },
        'all': {
            labels: ['2022', '2023', '2024', '2025', '2026'],
            data: [15000, 25000, 45000, 85000, 124500]
        }
    };

    chartFilter.addEventListener('change', (e) => {
        const val = e.target.value;
        if(chartDatasets[val]) {
            portfolioChart.data.labels = chartDatasets[val].labels;
            portfolioChart.data.datasets[0].data = chartDatasets[val].data;
            portfolioChart.update();
        }
    });

    // Quick Transfer Interactive Logic
    const transferBtn = document.getElementById('transfer-btn');
    const transferAmount = document.getElementById('transfer-amount');
    const transferMsg = document.getElementById('transfer-msg');
    const totalBalanceEl = document.getElementById('total-balance');
    const recentContactsContainer = document.getElementById('recent-contacts');
    const addContactBtn = document.getElementById('add-contact-btn');
    
    // Add Contact Modal elements
    const contactModal = document.getElementById('contact-modal');
    const closeContactModal = document.getElementById('close-contact-modal');
    const newContactNameInput = document.getElementById('new-contact-name');
    const saveContactBtn = document.getElementById('save-contact-btn');
    const transactionsTbody = document.getElementById('transactions-tbody');

    let currentBalance = 124500.00;
    let selectedContactName = null;

    // Contact Selection Logic
    function bindContactSelection() {
        const contacts = document.querySelectorAll('.contact:not(.add-new)');
        contacts.forEach(contact => {
            contact.addEventListener('click', () => {
                contacts.forEach(c => c.classList.remove('selected'));
                contact.classList.add('selected');
                selectedContactName = contact.getAttribute('data-name');
            });
        });
    }
    bindContactSelection();

    // Open/Close Add Contact Modal
    addContactBtn.addEventListener('click', () => {
        contactModal.classList.add('active');
    });

    closeContactModal.addEventListener('click', () => {
        contactModal.classList.remove('active');
        newContactNameInput.value = '';
    });

    // Save New Contact
    saveContactBtn.addEventListener('click', () => {
        const name = newContactNameInput.value.trim();
        if(name) {
            // Create new contact HTML
            const firstName = name.split(' ')[0];
            const newContact = document.createElement('div');
            newContact.className = 'contact selected';
            newContact.setAttribute('data-name', name);
            newContact.innerHTML = `
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2d3748&color=fff" alt="${firstName}">
                <span>${firstName}</span>
            `;
            
            // Insert before the add-new button
            recentContactsContainer.insertBefore(newContact, addContactBtn);
            
            // Re-bind click events
            bindContactSelection();
            
            // Set as selected
            document.querySelectorAll('.contact:not(.add-new)').forEach(c => c.classList.remove('selected'));
            newContact.classList.add('selected');
            selectedContactName = name;
            
            // Close modal
            contactModal.classList.remove('active');
            newContactNameInput.value = '';
        }
    });

    transferBtn.addEventListener('click', () => {
        const amount = parseFloat(transferAmount.value);
        
        // Reset messages
        transferMsg.className = 'transfer-msg';
        transferMsg.innerText = '';

        if (!selectedContactName) {
            transferMsg.innerText = 'Por favor, selecciona un destinatario.';
            transferMsg.classList.add('error');
            return;
        }
        
        if (isNaN(amount) || amount <= 0) {
            transferMsg.innerText = 'Ingresa un monto válido mayor a 0.';
            transferMsg.classList.add('error');
            return;
        }

        if (amount > currentBalance) {
            transferMsg.innerText = 'Fondos insuficientes.';
            transferMsg.classList.add('error');
            return;
        }

        // Loading state
        transferBtn.classList.add('loading');
        const btnText = transferBtn.querySelector('.btn-text-inner');
        const originalText = btnText.innerText;
        btnText.innerText = 'Procesando...';
        transferBtn.disabled = true;

        setTimeout(() => {
            // Success state
            transferBtn.classList.remove('loading');
            btnText.innerText = originalText;
            transferBtn.disabled = false;
            
            // Update Balance
            currentBalance -= amount;
            
            // Format to USD currency format
            const formattedBalance = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentBalance);
            
            totalBalanceEl.innerText = formattedBalance;
            
            // Show Success Message
            transferMsg.innerText = `Transferencia de $${amount.toFixed(2)} USD a ${selectedContactName} completada.`;
            transferMsg.classList.add('success');
            
            // Append to Transactions Table
            const today = new Date();
            const dateStr = today.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            
            const newTr = document.createElement('tr');
            newTr.innerHTML = `
                <td>
                    <div class="tx-detail">
                        <div class="tx-icon negative"><i data-lucide="arrow-up-right"></i></div>
                        <div>
                            <p class="tx-name">${selectedContactName}</p>
                            <p class="tx-sub">Transferencia saliente</p>
                        </div>
                    </div>
                </td>
                <td>Transferencia</td>
                <td>${dateStr}</td>
                <td><span class="badge badge-success">Completado</span></td>
                <td class="text-right">-$ ${amount.toFixed(2)}</td>
            `;
            
            transactionsTbody.insertBefore(newTr, transactionsTbody.firstChild);
            lucide.createIcons();

            // Reset input
            transferAmount.value = '';
            
            // Hide message after 4s
            setTimeout(() => {
                transferMsg.classList.remove('success');
                transferMsg.innerText = '';
            }, 4000);
            
        }, 1500); // 1.5 seconds simulated delay
    });

    // SPA Routing Logic
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const appViews = document.querySelectorAll('.app-view');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active to clicked
            item.classList.add('active');
            
            // Get target view ID
            const targetId = item.getAttribute('data-target');
            
            // Hide all views
            appViews.forEach(view => {
                view.classList.remove('active');
            });
            
            // Show target view
            const targetView = document.getElementById(targetId);
            if(targetView) {
                targetView.classList.add('active');
            }
        });
    });

    // Dropdown Logic
    const notifBtn = document.getElementById('notif-btn');
    const notifMenu = document.querySelector('.notif-menu');
    const profileBtn = document.getElementById('profile-btn');
    const profileMenu = document.querySelector('.profile-menu');

    function closeAllDropdowns() {
        if(notifMenu) notifMenu.classList.remove('active');
        if(profileMenu) profileMenu.classList.remove('active');
    }

    if(notifBtn) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = notifMenu.classList.contains('active');
            closeAllDropdowns();
            if (!isActive) notifMenu.classList.add('active');
        });
    }

    if(profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = profileMenu.classList.contains('active');
            closeAllDropdowns();
            if (!isActive) profileMenu.classList.add('active');
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-container')) {
            closeAllDropdowns();
        }
    });

    // Analytics Doughnut Chart
    const expenseCtx = document.getElementById('expenseChart');
    if(expenseCtx) {
        new Chart(expenseCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Tecnología', 'Comida', 'Ocio', 'Transporte', 'Otros'],
                datasets: [{
                    data: [450, 200, 320, 50, 100],
                    backgroundColor: [
                        '#00FF9D',
                        '#627EEA',
                        '#FF4B4B',
                        '#F5A623',
                        '#2D3748'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#8b949e',
                            padding: 20,
                            font: {
                                family: "'Inter', sans-serif",
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 14, 20, 0.9)',
                        titleColor: '#8b949e',
                        bodyColor: '#ffffff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
});
