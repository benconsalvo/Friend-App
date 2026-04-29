// --- 1. SUPABASE CONFIG ---
const supabaseUrl = 'https://zwjwewuiqlhiwxndvxij.supabase.co';
const supabaseKey = 'sb_publishable_pBtHBqw1Kj_XTsRobi7LkA_aP9rZjQm'; 
const mySupabase = supabase.createClient(supabaseUrl, supabaseKey);

// --- 2. ELEMENTS ---
const authContainer = document.getElementById('auth-container');
const appContent = document.getElementById('app-content');
const authBtn = document.getElementById('auth-btn');
const toggleAuth = document.getElementById('toggle-auth');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name'); // Added
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

let isSignUpMode = true;

// --- 3. AUTH LOGIC ---

toggleAuth.addEventListener('click', () => {
    isSignUpMode = !isSignUpMode;
    document.getElementById('form-title').innerText = isSignUpMode ? 'Join Our App' : 'Welcome Back';
    authBtn.innerText = isSignUpMode ? 'Sign Up' : 'Log In';
    toggleAuth.innerHTML = isSignUpMode ? 
        'Already have an account? <span>Log In</span>' : 
        'Need an account? <span>Sign Up</span>';
    
    firstNameInput.style.display = isSignUpMode ? 'block' : 'none';
    lastNameInput.style.display = isSignUpMode ? 'block' : 'none'; // Toggle visibility
});

authBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value; // Capture last name

    if (isSignUpMode) {
        // --- SIGN UP ---
        const { data, error } = await mySupabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { 
                    first_name: firstName,
                    last_name: lastName // Store in Auth Metadata
                }
            }
        });

        if (error) {
            alert("Sign Up Error: " + error.message);
        } else if (data.user) {
            // Store both names in Profiles Table
            const { error: tableError } = await mySupabase
                .from('profiles')
                .insert([
                    { 
                        id: data.user.id, 
                        first_name: firstName, 
                        last_name: lastName 
                    }
                ]);

            if (tableError) console.error("Table Error:", tableError.message);
            
            // Auto-login: Pass both names to the app
            startApp(firstName, lastName);
        }
    } else {
        // --- LOG IN ---
        const { data, error } = await mySupabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            alert("Login failed: " + error.message);
        } else {
            // Retrieve names from the metadata we stored during sign up
            const fName = data.user.user_metadata.first_name || "Friend";
            const lName = data.user.user_metadata.last_name || "";
            startApp(fName, lName);
        }
    }
});

// Updated to accept and display both names
function startApp(first, last) {
    authContainer.style.display = 'none';
    appContent.style.display = 'flex';
    document.getElementById('welcome-msg').innerText = `Hi ${first} ${last}!`;
}

// --- 4. HEART BURST LOGIC (Stays the same) ---
document.getElementById('love-button').addEventListener('click', function() {
    document.getElementById('message').style.opacity = '1';
    for (let i = 0; i < 15; i++) {
        createHeart();
    }
});

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤️';
    heart.style.left = '50%';
    heart.style.top = '50%';
    const randomX = (Math.random() - 0.5) * 300; 
    heart.style.setProperty('--dx', `${randomX}px`);
    document.body.appendChild(heart);
    setTimeout(() => { heart.remove(); }, 1500);
}