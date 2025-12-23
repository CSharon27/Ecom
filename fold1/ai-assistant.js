// AI Assistant Functions

// Close AI Banner
function closeAIBanner() {
    const banner = document.querySelector('.ai-banner-container');
    if (banner) {
        banner.style.display = 'none';
    }
}

// Show AI Assistant
function showAIAssistant() {
    const section = document.getElementById('aiAssistantSection');
    if (section) {
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Close AI Assistant
function closeAIAssistant() {
    const section = document.getElementById('aiAssistantSection');
    if (section) {
        section.style.display = 'none';
    }
}

// Switch between AI tabs
function switchAITab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.ai-tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.ai-tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to clicked button
    event.target.closest('.ai-tab-btn').classList.add('active');

    // Clear previous results
    const resultsDiv = document.getElementById(tabName + 'Results');
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
}

// Find Scholarships
async function findScholarships() {
    console.log('findScholarships called');
    const educationLevel = document.getElementById('aiEducationLevel').value;
    const fieldOfStudy = document.getElementById('aiFieldOfStudy').value;
    const marks = document.getElementById('aiMarks').value;
    const familyIncome = document.getElementById('aiFamilyIncome').value;
    const state = document.getElementById('aiState').value;
    const category = document.getElementById('aiCategory').value;

    console.log('Form values:', { educationLevel, fieldOfStudy, marks, familyIncome, state, category });

    if (!educationLevel || !fieldOfStudy || !marks || !familyIncome || !state) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    const button = document.querySelector('button[onclick="findScholarships()"]');
    if (button) {
        button.disabled = true;
        button.innerHTML = '<span class="loading-spinner"></span> Finding scholarships...';
    }

    try {
        console.log('Sending request to:', `${API_BASE}/ai/find-scholarships`);
        const response = await fetch(`${API_BASE}/ai/find-scholarships`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentProfile: {
                    educationLevel,
                    fieldOfStudy,
                    marks,
                    familyIncome,
                    state,
                    category
                }
            })
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
            showToast(data.message || 'Error finding scholarships', 'error');
            if (button) {
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-search"></i> Find Tailored Scholarships';
            }
            return;
        }

        displayScholarships(data.scholarships);
        document.getElementById('scholarshipsResults').style.display = 'block';
        showToast('Scholarships found! Check the results below.', 'success');
    } catch (error) {
        console.error('Error:', error);
        showToast('Error finding scholarships. Please try again.', 'error');
    } finally {
        if (button) {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-search"></i> Find Tailored Scholarships';
        }
    }
}

// Display Scholarships
function displayScholarships(scholarships) {
    const container = document.getElementById('scholarshipsContent');
    
    if (!scholarships || scholarships.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No scholarships found. Please try with different criteria.</p>';
        return;
    }

    container.innerHTML = scholarships.map(scholarship => `
        <div class="scholarship-card">
            <h4>${scholarship.name || 'Scholarship'}</h4>
            <div style="white-space: pre-wrap; word-wrap: break-word; line-height: 1.6;">
                ${formatText(scholarship.matchReason || scholarship.description || '')}
            </div>
            <div class="eligibility" style="margin-top: 12px;">
                <strong>Eligibility:</strong> 
                <div style="white-space: pre-wrap; word-wrap: break-word; margin-top: 5px;">
                    ${formatText(scholarship.eligibility || 'Check official website')}
                </div>
            </div>
            <div class="amount" style="margin-top: 12px;">
                <strong>Estimated Amount:</strong> ${scholarship.estimatedAmount || 'Varies'}
            </div>
            ${scholarship.applicationLink ? `
                <a href="${scholarship.applicationLink}" target="_blank" rel="noopener" class="btn btn-outline" style="margin-top: 10px; display: inline-block;">
                    Apply Now <i class="fas fa-external-link-alt"></i>
                </a>
            ` : ''}
        </div>
    `).join('');
}

// Format text with proper line breaks and links
function formatText(text) {
    if (!text) return '';
    
    // Convert URLs to clickable links
    text = text.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener" style="color: #667eea; text-decoration: underline;">$1</a>'
    );
    
    // Convert bullet points
    text = text.replace(/^\* /gm, '• ');
    
    // Convert bold text
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    return text;
}

// Get Education Tips
async function getEducationTips() {
    console.log('getEducationTips called');
    const educationLevel = document.getElementById('tipEducationLevel').value;
    const subject = document.getElementById('tipSubject').value;
    const challenges = document.getElementById('tipChallenges').value;

    console.log('Form values:', { educationLevel, subject, challenges });

    if (!educationLevel || !subject) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    const button = document.querySelector('button[onclick="getEducationTips()"]');
    if (button) {
        button.disabled = true;
        button.innerHTML = '<span class="loading-spinner"></span> Getting tips...';
    }

    try {
        console.log('Sending request to:', `${API_BASE}/ai/education-tips`);
        const response = await fetch(`${API_BASE}/ai/education-tips`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                educationLevel,
                subject,
                challenges
            })
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
            showToast(data.message || 'Error fetching tips', 'error');
            if (button) {
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-lightbulb"></i> Get Tips';
            }
            return;
        }

        displayTips(data.tips);
        document.getElementById('tipsResults').style.display = 'block';
        showToast('Tips loaded! Check the results below.', 'success');
    } catch (error) {
        console.error('Error:', error);
        showToast('Error fetching tips. Please try again.', 'error');
    } finally {
        if (button) {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-lightbulb"></i> Get Tips';
        }
    }
}

// Display Tips
function displayTips(tips) {
    const container = document.getElementById('tipsContent');
    
    if (!tips || tips.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No tips available. Please try again.</p>';
        return;
    }

    container.innerHTML = tips.map(tip => `
        <div class="tip-card">
            <h4>${tip.title || 'Tip'}</h4>
            <div style="white-space: pre-wrap; word-wrap: break-word; line-height: 1.6; margin-bottom: 12px;">
                ${formatText(tip.description || '')}
            </div>
            ${tip.actionableSteps && tip.actionableSteps.length > 0 ? `
                <div class="actionable-steps">
                    <strong>Action Steps:</strong>
                    <ul style="margin-top: 8px; padding-left: 20px;">
                        ${tip.actionableSteps.map(step => `<li style="margin-bottom: 6px;">${formatText(step)}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Get Education Trends
async function getEducationTrends() {
    console.log('getEducationTrends called');
    const field = document.getElementById('trendField').value || 'Education';

    console.log('Field value:', field);

    const button = document.querySelector('button[onclick="getEducationTrends()"]');
    if (button) {
        button.disabled = true;
        button.innerHTML = '<span class="loading-spinner"></span> Loading trends...';
    }

    try {
        console.log('Sending request to:', `${API_BASE}/ai/education-trends`);
        const response = await fetch(`${API_BASE}/ai/education-trends`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field })
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
            showToast(data.message || 'Error fetching trends', 'error');
            if (button) {
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-chart-line"></i> Show Trends';
            }
            return;
        }

        displayTrends(data.trends);
        document.getElementById('trendsResults').style.display = 'block';
        showToast('Trends loaded! Check the results below.', 'success');
    } catch (error) {
        console.error('Error:', error);
        showToast('Error fetching trends. Please try again.', 'error');
    } finally {
        if (button) {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-chart-line"></i> Show Trends';
        }
    }
}

// Display Trends
function displayTrends(trends) {
    const container = document.getElementById('trendsContent');
    
    if (!trends || trends.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No trends available. Please try again.</p>';
        return;
    }

    container.innerHTML = trends.map(trend => `
        <div class="trend-card">
            <h4>${trend.trend || 'Trend'}</h4>
            <div style="white-space: pre-wrap; word-wrap: break-word; line-height: 1.6; margin-bottom: 12px;">
                ${formatText(trend.description || '')}
            </div>
            <div style="margin-top: 10px;">
                <strong>Impact:</strong> ${trend.impact || 'High'}
            </div>
            ${trend.skillsNeeded && trend.skillsNeeded.length > 0 ? `
                <div class="skills-needed" style="margin-top: 12px;">
                    <strong style="display: block; margin-bottom: 8px;">Skills Needed:</strong>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${trend.skillsNeeded.map(skill => `<span class="skill-tag" style="background: #f0f0f0; padding: 6px 12px; border-radius: 20px; font-size: 0.9em;">${formatText(skill)}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Send Chat Message
async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) {
        return;
    }

    // Add user message to chat
    addChatMessage(message, 'user');
    input.value = '';

    try {
        const response = await fetch(`${API_BASE}/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                context: `User is a ${currentUser?.role || 'student'} using Scholar Link Hub`
            })
        });

        const data = await response.json();

        if (!response.ok) {
            addChatMessage('Sorry, I encountered an error. Please try again.', 'assistant');
            return;
        }

        addChatMessage(data.response, 'assistant');
    } catch (error) {
        console.error('Error:', error);
        addChatMessage('Sorry, I encountered an error. Please try again.', 'assistant');
    }
}

// Add Chat Message
function addChatMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `<div class="chat-bubble">${text}</div>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Handle Chat Keypress
function handleChatKeypress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatMessage();
    }
}
