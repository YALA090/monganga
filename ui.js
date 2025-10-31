document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initLanguageSelector();
    initDiagnosticButtons();
});

function initThemeToggle() {
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    // Change the icons inside the button based on previous settings
    if (localStorage.getItem('color-theme') === 'dark' ||
        (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        themeToggleLightIcon.classList.remove('hidden');
        document.documentElement.classList.add('dark');
    } else {
        themeToggleDarkIcon.classList.remove('hidden');
        document.documentElement.classList.remove('dark');
    }

    const themeToggleBtn = document.getElementById('theme-toggle');
    themeToggleBtn.addEventListener('click', function() {
        // Toggle icons
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');

        // If is set in localStorage
        if (localStorage.getItem('color-theme')) {
            if (localStorage.getItem('color-theme') === 'light') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            }
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        }
    });
}

function initLanguageSelector() {
    const languageSelect = document.getElementById('languageSelect');
    
    // Set initial language from localStorage or default to 'fr'
    const currentLang = localStorage.getItem('language') || 'fr';
    languageSelect.value = currentLang;
    
    // Update translations when language changes
    languageSelect.addEventListener('change', (e) => {
        const selectedLang = e.target.value;
        localStorage.setItem('language', selectedLang);
        updatePageLanguage(selectedLang);
    });
    
    // Trigger initial translation
    languageSelect.dispatchEvent(new Event('change'));
}

function initDiagnosticButtons() {
    const autoDiagnoseBtn = document.getElementById('autoDiagnoseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const symptomsInput = document.getElementById('symptoms');

    autoDiagnoseBtn.addEventListener('click', () => {
        const symptoms = symptomsInput.value.trim();
        if (symptoms) {
            startAutoDiagnosis(symptoms);
        } else {
            showCustomAlert('Veuillez décrire vos symptômes');
        }
    });

    resetBtn.addEventListener('click', resetConsultation);
}

async function startAutoDiagnosis(symptoms) {
    const currentLang = localStorage.getItem('language') || 'fr';
    const userId = localStorage.getItem('userId'); // Récupérer l'userId
    showLoadingModal();
    
    try {
        console.log('Envoi de la requête avec les symptômes:', symptoms);
        const response = await fetch('http://localhost:3000/diagnose', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                symptoms: symptoms,
                language: currentLang,
                userId: userId // Inclure l'userId dans la requête
            })
        });

        // Vérifier d'abord le type de contenu de la réponse
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Réponse invalide du serveur (${contentType})`);
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || translations[currentLang].error_api);
        }

        const data = await response.json();
        if (!data || !data.diagnosis) {
            throw new Error('Réponse invalide du serveur');
        }

        displayDiagnosisResult(data);
    } catch (error) {
        console.error('Erreur lors du diagnostic:', error);
        let errorMessage = translations[currentLang].error_api;
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Le serveur n\'est pas accessible. Veuillez vérifier qu\'il est démarré.';
        }
        showCustomAlert(errorMessage);
    } finally {
        hideLoadingModal();
    }
}

function displayDiagnosisResult(data) {
    const diagnosisResult = document.getElementById('diagnosisResult');
    const labTestsRequest = document.getElementById('labTestsRequest');
    const labTestsList = document.getElementById('labTestsList');

    // Afficher le résultat du diagnostic
    diagnosisResult.innerHTML = marked.parse(data.diagnosis);
    diagnosisResult.classList.remove('hidden');

    // Afficher les tests de laboratoire si présents
    if (data.labTests && data.labTests.length > 0) {
        labTestsList.innerHTML = data.labTests.map(test => `<li>${test}</li>`).join('');
        labTestsRequest.classList.remove('hidden');
    } else {
        labTestsRequest.classList.add('hidden');
    }
}

function resetConsultation() {
    document.getElementById('symptoms').value = '';
    document.getElementById('diagnosisResult').classList.add('hidden');
    document.getElementById('labTestsRequest').classList.add('hidden');
}

function showLoadingModal() {
    document.getElementById('loadingModal').classList.remove('hidden');
}

function hideLoadingModal() {
    document.getElementById('loadingModal').classList.add('hidden');
}

function showCustomAlert(message) {
    document.getElementById('alertMessage').textContent = message;
    document.getElementById('alertModal').classList.remove('hidden');
}

function hideCustomAlert() {
    document.getElementById('alertModal').classList.add('hidden');
}