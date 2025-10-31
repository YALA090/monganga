document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('languageSelect');
    const startBtn = document.getElementById('startBtn');
    const loginBtn = document.getElementById('loginBtn');
    const backToWelcomeBtn = document.getElementById('backToWelcomeBtn');
    const welcomePage = document.getElementById('welcomePage');
    const loginPage = document.getElementById('loginPage');
    const registrationPage = document.getElementById('registrationPage');
    const diagnosisPage = document.getElementById('diagnosisPage');
    const profilePage = document.getElementById('profilePage');
    const chatContainer = document.getElementById('chatContainer');
    const profileBtn = document.getElementById('profileBtn');

    const logoutConfirmationModal = document.getElementById('logoutConfirmationModal');
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
    const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');

    const translations = {
        fr: {
            slogan: "Sauvons de vie",
            welcome: "Bienvenue sur MONGANGA",
            welcome_desc: "Votre assistant médical intelligent pour vous aider avec vos consultations",
            start: "Créer un compte",
            have_account: "J'ai déjà un compte",
            login: "Connexion",
            login_desc: "Connectez-vous à votre compte MONGANGA",
            email: "Adresse email",
            password: "Mot de passe",
            connect: "Se connecter",
            back_welcome: "Retour à l'accueil",
            registration: "Inscription",
            step: "Étape",
            name: "Nom complet",
            phone: "Numéro de téléphone",
            age: "Âge",
            gender: "Sexe",
            select_gender: "Sélectionner",
            male: "Homme",
            female: "Femme",
            other: "Autre",
            weight: "Poids (kg)",
            enter_symptoms_alert: "Veuillez entrer vos symptômes.",
            diagnosis_error: "Erreur lors de la génération du diagnostic",
            register_prompt: "Pour sauvegarder votre historique de consultation, veuillez vous inscrire. S'inscrire maintenant ?",
            register_success: "Inscription réussie ! Vos données sont stockées en toute sécurité sur Hedera.",
            register_error: "Erreur lors de l'inscription. Veuillez réessayer.",
            submit_registration: "S'inscrire",
            user_not_found: "Utilisateur non trouvé",
            error_fetching_profile: "Erreur lors de la récupération du profil",
            symptoms: "Symptômes",
            date: "Date",
            no_consultation_history: "Aucun historique de consultation",
            diagnosis: "Diagnostic",
            no_diagnosis_history: "Aucun historique de diagnostic",
            error_fetching_history: "Erreur lors de la récupération de l'historique",
            profile_title: "Profil Utilisateur",
            consultation_history_title: "Historique des Consultations",
            diagnosis_history_title: "Historique des Diagnostics",
            logout: "Déconnexion",
            logout_confirm: "Êtes-vous sûr de vouloir vous déconnecter ?",
            login_error: "Email ou mot de passe incorrect.",
            password_mismatch: "Les mots de passe ne correspondent pas."
        },
        en: {
            slogan: "Saving lives",
            welcome: "Welcome to MONGANGA",
            welcome_desc: "Your intelligent medical assistant to help you with your consultations",
            start: "Create an account",
            have_account: "I already have an account",
            login: "Login",
            login_desc: "Log in to your MONGANGA account",
            email: "Email address",
            password: "Password",
            connect: "Log in",
            back_welcome: "Back to home",
            registration: "Registration",
            step: "Step",
            name: "Full name",
            phone: "Phone number",
            age: "Age",
            gender: "Gender",
            select_gender: "Select",
            male: "Male",
            female: "Female",
            other: "Other",
            weight: "Weight (kg)",
            enter_symptoms_alert: "Please enter your symptoms.",
            diagnosis_error: "Error while making diagnosis",
            register_prompt: "To save your consultation history, please register first. Register now?",
            register_success: "Registration successful! Your data is securely stored on Hedera.",
            register_error: "Error during registration. Please try again.",
            submit_registration: "Register",
            user_not_found: "User not found",
            error_fetching_profile: "Error fetching profile",
            symptoms: "Symptoms",
            date: "Date",
            no_consultation_history: "No consultation history",
            diagnosis: "Diagnosis",
            no_diagnosis_history: "No diagnosis history",
            error_fetching_history: "Error fetching history",
            profile_title: "User Profile",
            consultation_history_title: "Consultation History",
            diagnosis_history_title: "Diagnosis History",
            logout: "Logout",
            logout_confirm: "Are you sure you want to log out?",
            login_error: "Incorrect email or password.",
            password_mismatch: "Passwords do not match."
        },
        sw: {
            slogan: "Kuokoa maisha",
            welcome: "Karibu MONGANGA",
            welcome_desc: "Msaidizi wako wa kimatibabu mwenye akili kukusaidia na mashauriano yako",
            start: "Fungua akaunti",
            have_account: "Tayari nina akaunti",
            login: "Ingia",
            login_desc: "Ingia kwenye akaunti yako ya MONGANGA",
            email: "Anwani ya barua pepe",
            password: "Nenosiri",
            connect: "Ingia",
            back_welcome: "Rudi nyumbani",
            registration: "Usajili",
            step: "Hatua",
            name: "Jina kamili",
            phone: "Nambari ya simu",
            age: "Umri",
            gender: "Jinsia",
            select_gender: "Chagua",
            male: "Mwanaume",
            female: "Mwanamke",
            other: "Nyingine",
            weight: "Uzito (kg)",
            enter_symptoms_alert: "Tafadhali ingiza dalili zako.",
            diagnosis_error: "Kosa wakati wa kutengeneza utambuzi",
            register_prompt: "Ili kuhifadhi historia yako ya mashauriano, tafadhali jisajili kwanza. Jisajili sasa?",
            register_success: "Usajili umefanikiwa! Data yako imehifadhiwa salama kwenye Hedera.",
            register_error: "Kosa wakati wa usajili. Tafadhali jaribu tena.",
            submit_registration: "Sajili",
            user_not_found: "Mtumiaji hajapatikana",
            error_fetching_profile: "Kosa wakati wa kupata wasifu",
            symptoms: "Dalili",
            date: "Tarehe",
            no_consultation_history: "Hakuna historia ya mashauriano",
            diagnosis: "Utambuzi",
            no_diagnosis_history: "Hakuna historia ya utambuzi",
            error_fetching_history: "Kosa wakati wa kupata historia",
            profile_title: "Wasifu wa Mtumiaji",
            consultation_history_title: "Historia ya Mashauriano",
            diagnosis_history_title: "Historia ya Utambuzi",
            logout: "Toka",
            logout_confirm: "Una uhakika unataka kutoka?",
            login_error: "Barua pepe au nenosiri si sahihi.",
            password_mismatch: "Nenosiri halifanani."
        },
        ln: {
            slogan: "Kobikisa bomoi",
            welcome: "Boyeyi malamu na MONGANGA",
            welcome_desc: "Molakisi na yo ya mayele ya monganga mpo na kosunga yo na ba consultations na yo",
            start: "Fungola compte",
            have_account: "Naza na compte",
            login: "Kota",
            login_desc: "Kota na compte na yo ya MONGANGA",
            email: "Adresi ya email",
            password: "Mot de passe",
            connect: "Kota",
            back_welcome: "Zonga na ebandeli",
            registration: "Kofungola compte",
            step: "Etapi",
            name: "Nkombo mobimba",
            phone: "Numero ya telefone",
            age: "Mibu",
            gender: "Nzoto",
            select_gender: "Pona",
            male: "Mobali",
            female: "Mwasi",
            other: "Mosusu",
            weight: "Poids (kg)",
            enter_symptoms_alert: "Tika likambo na yo.",
            diagnosis_error: "Libunga na ntango ya kosala diagnostic",
            register_prompt: "Mpo na kobomba lisolo na yo ya consultation, soki olingi, fungola compte. Ofungoli compte sikoyo?",
            register_success: "Inscription elongi! Ba données na yo ebombami malamu na Hedera.",
            register_error: "Libunga na ntango ya kosala inscription. Meká lisusu.",
            submit_registration: "Inscrire",
            user_not_found: "Utilisateur non trouvé",
            error_fetching_profile: "Erreur lors de la récupération du profil",
            symptoms: "Symptômes",
            date: "Date",
            no_consultation_history: "Aucun historique de consultation",
            diagnosis: "Diagnostic",
            no_diagnosis_history: "Aucun historique de diagnostic",
            error_fetching_history: "Erreur lors de la récupération de l'historique",
            profile_title: "Profile ya mosaleli",
            consultation_history_title: "Lisolo ya ba consultations",
            diagnosis_history_title: "Lisolo ya ba diagnostics",
            logout: "Bima",
            logout_confirm: "Olingi solo kobima?",
            login_error: "Email to mot de passe ezali malamu te.",
            password_mismatch: "Mots de passe ekokani te."
        }
    };

    function updateLanguage(lang) {
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
    }

    languageSelect.addEventListener('change', (e) => {
        updateLanguage(e.target.value);
    });

    function getTranslation(key) {
        const lang = languageSelect.value;
        return translations[lang][key] || translations['en'][key];
    }

    function showPage(page) {
        [welcomePage, loginPage, registrationPage, diagnosisPage, profilePage, chatContainer].forEach(p => {
            if (p) p.classList.add('hidden');
        });
        if (page) {
            page.classList.remove('hidden');
        }
    }

    function showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notificationMessage');

        notificationMessage.textContent = message;
        notification.classList.remove('hidden', 'bg-green-500', 'bg-red-500', 'bg-blue-500');

        if (type === 'success') {
            notification.classList.add('bg-green-500');
        } else if (type === 'error') {
            notification.classList.add('bg-red-500');
        } else {
            notification.classList.add('bg-blue-500');
        }

        notification.classList.remove('hidden');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 5000);
    }

    startBtn.addEventListener('click', () => showPage(registrationPage));
    loginBtn.addEventListener('click', () => showPage(loginPage));
    backToWelcomeBtn.addEventListener('click', () => showPage(welcomePage));

    profileBtn.addEventListener('click', async () => {
        const userId = getCurrentUserId();
        if (userId) {
            showPage(profilePage);
            await displayUserProfile(userId);
            await displayHistory(userId);
        } else {
            showNotification(getTranslation('register_prompt'), 'info');
            showPage(registrationPage);
        }
    });

    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        logoutConfirmationModal.classList.remove('hidden');
    });

    confirmLogoutBtn.addEventListener('click', () => {
        localStorage.removeItem('monganga_user_id');
        logoutConfirmationModal.classList.add('hidden');
        showPage(welcomePage);
    });

    cancelLogoutBtn.addEventListener('click', () => {
        logoutConfirmationModal.classList.add('hidden');
    });

    async function displayUserProfile(userId) {
        const userInfoDiv = document.getElementById('userInfo');
        try {
            const response = await fetch(`/user/${userId}`);
            if (response.ok) {
                const user = await response.json();
                userInfoDiv.innerHTML = `
                    <p><strong>${getTranslation('name')}:</strong> ${user.name}</p>
                    <p><strong>${getTranslation('email')}:</strong> ${user.email}</p>
                    <p><strong>UserID:</strong> ${user.userId}</p>
                `;
            } else {
                userInfoDiv.innerHTML = `<p>${getTranslation('user_not_found')}</p>`;
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            userInfoDiv.innerHTML = `<p>${getTranslation('error_fetching_profile')}</p>`;
        }
    }

    async function displayHistory(userId) {
        const consultationHistoryDiv = document.getElementById('consultationHistory');
        const diagnosisHistoryDiv = document.getElementById('diagnosisHistory');

        try {
            const response = await fetch(`/history/${userId}`);
            if (response.ok) {
                const history = await response.json();

                consultationHistoryDiv.innerHTML = history.consultations.length > 0 ?
                    history.consultations.map(c => `
                        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                            <p><strong>${getTranslation('symptoms')}:</strong> ${c.symptoms}</p>
                            <p><strong>${getTranslation('date')}:</strong> ${new Date(c.timestamp).toLocaleString()}</p>
                        </div>
                    `).join('') :
                    `<p>${getTranslation('no_consultation_history')}</p>`;

                diagnosisHistoryDiv.innerHTML = history.diagnoses.length > 0 ?
                    history.diagnoses.map(d => `
                        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                            <p><strong>${getTranslation('diagnosis')}:</strong> ${d.diagnosis}</p>
                            <p><strong>${getTranslation('date')}:</strong> ${new Date(d.timestamp).toLocaleString()}</p>
                        </div>
                    `).join('') :
                    `<p>${getTranslation('no_diagnosis_history')}</p>`;
            } else {
                consultationHistoryDiv.innerHTML = `<p>${getTranslation('error_fetching_history')}</p>`;
                diagnosisHistoryDiv.innerHTML = `<p>${getTranslation('error_fetching_history')}</p>`;
            }
        } catch (error) {
            console.error('Error fetching history:', error);
            consultationHistoryDiv.innerHTML = `<p>${getTranslation('error_fetching_history')}</p>`;
            diagnosisHistoryDiv.innerHTML = `<p>${getTranslation('error_fetching_history')}</p>`;
        }
    }
    
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setCurrentUserId(data.userId);
                showPage(diagnosisPage);
            } else {
                showNotification(data.error || getTranslation('login_error'), 'error');
            }
        } catch (error) {
            console.error('Error during login:', error);
            showNotification(getTranslation('login_error'), 'error');
        }
    });

    // Gestion du formulaire d'inscription
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const password = document.getElementById('userPassword').value;
            const confirmPassword = document.getElementById('userPasswordConfirm').value;

            if (password !== confirmPassword) {
                showNotification(getTranslation('password_mismatch'), 'error');
                return;
            }

            // Récupération des données du formulaire
            const formData = new FormData(registrationForm);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                age: formData.get('age'),
                gender: formData.get('gender'),
                weight: formData.get('weight'),
                password: password
            };
            
            try {
                // Envoi des données au serveur
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Stockage de l'ID utilisateur
                    setCurrentUserId(data.userId);
                    showNotification(getTranslation('register_success'), 'success');
                    
                    // Redirection vers la page de diagnostic
                    showPage(diagnosisPage);
                } else {
                    showNotification(getTranslation('register_error') + ': ' + data.error, 'error');
                }
            } catch (error) {
                console.error('Error during registration:', error);
                showNotification(getTranslation('register_error'), 'error');
            }
        });
    }

    // Fonction pour récupérer l'ID utilisateur du stockage local
    function getCurrentUserId() {
        return localStorage.getItem('monganga_user_id') || null;
    }
    
    // Fonction pour stocker l'ID utilisateur dans le stockage local
    function setCurrentUserId(userId) {
        localStorage.setItem('monganga_user_id', userId);
    }
    
    // Set initial language
    updateLanguage(languageSelect.value);

    // Check for logged-in user on page load
    const initialUserId = getCurrentUserId();
    if (initialUserId) {
        showPage(diagnosisPage);
    } else {
        showPage(welcomePage);
    }
});

const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Change the icons inside the button based on previous settings
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    themeToggleLightIcon.classList.remove('hidden');
} else {
    themeToggleDarkIcon.classList.remove('hidden');
}

themeToggleBtn.addEventListener('click', function() {
    // toggle icons inside button
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }

    // if NOT set via local storage previously
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