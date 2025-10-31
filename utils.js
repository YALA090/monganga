// Utility functions for the MONGANGA application

// Global state variables
window.currentLanguage = 'fr';
window.userData = null;
window.consultationState = {
    symptoms: [],
    currentStep: 0,
    diagnosis: null,
    labTests: [],
    medications: [],
    symptomsCollected: {},
    labResultsUploaded: false
};

// Loading modal functions
function showLoadingModal() {
    const loadingModal = document.getElementById('loadingModal');
    if (loadingModal) {
        loadingModal.classList.remove('hidden');
    }
}

function hideLoadingModal() {
    const loadingModal = document.getElementById('loadingModal');
    if (loadingModal) {
        loadingModal.classList.add('hidden');
    }
}

// Alert function
function showCustomAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.add('animate-fade-out');
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 300);
    }, 3000);
}

// Reset consultation function
function resetConsultation() {
    // Reset consultation state
    window.updateConsultationState({
        symptomsCollected: {},
        labResultsUploaded: false
    });
    
    // Clear input fields
    const autoSymptomsInput = document.getElementById('autoSymptomsInput');
    const symptomDuration = document.getElementById('symptomDuration');
    const symptomIntensity = document.getElementById('symptomIntensity');
    const bodyTemperature = document.getElementById('bodyTemperature');
    
    if (autoSymptomsInput) autoSymptomsInput.value = '';
    if (symptomDuration) symptomDuration.value = '';
    if (symptomIntensity) symptomIntensity.value = '5';
    if (bodyTemperature) bodyTemperature.value = '37.0';
    
    // Clear diagnosis content
    const diagnosisContent = document.getElementById('diagnosisContent');
    if (diagnosisContent) {
        diagnosisContent.innerHTML = '';
    }
}

// Export functions to window object
// State management functions
function updateConsultationState(updates) {
    window.consultationState = {
        ...window.consultationState,
        ...updates
    };
}

function getConsultationState() {
    return window.consultationState;
}

function setUserData(data) {
    window.userData = data;
}

function getUserData() {
    return window.userData;
}

function setCurrentLanguage(language) {
    window.currentLanguage = language;
}

function getCurrentLanguage() {
    return window.currentLanguage;
}

// Export all functions to window object
window.showLoadingModal = showLoadingModal;
window.hideLoadingModal = hideLoadingModal;
window.showCustomAlert = showCustomAlert;
window.resetConsultation = resetConsultation;
window.updateConsultationState = updateConsultationState;
window.getConsultationState = getConsultationState;
window.setUserData = setUserData;
window.getUserData = getUserData;
window.setCurrentLanguage = setCurrentLanguage;
window.getCurrentLanguage = getCurrentLanguage;