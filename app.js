// 404 Location Finder - Main Application Logic

// Application data
const appData = {
  "absurdDirections": [
    "Walk forward until you greet the ghost of Sir Sandwich, then turn left at the garden of eternal Mondays",
    "Take the third rainbow on your right, past the library of forgotten sneezes",
    "Head north by following the song of the clockwise butterflies until you reach the fountain of yesterday's soup",
    "Turn right at the intersection of Probably Street and Maybe Avenue, then ask the purple elephant for further directions",
    "Follow the trail of cookie crumbs left by the existential crisis of a confused GPS satellite"
  ],
  "randomObstacles": [
    "a bridge made of crystallized laughter",
    "the Department of Lost Sock Investigation",
    "a traffic light that only shows the color of regret",
    "the Museum of Things That Almost Happened",
    "a roundabout where time moves backwards",
    "the Valley of Misplaced Car Keys"
  ],
  "travelRecommendations": [
    "Bring an umbrella for underwater travel",
    "Pack rubber boots for desert hiking",
    "Don't forget your ice skates for volcanic terrain",
    "A snorkel is essential for mountain climbing",
    "Sunglasses are mandatory for cave exploration",
    "Bring a parka for visits to the sun"
  ],
  "mapElements": [
    "treasure chest", "footprint", "warning sign", "compass rose", "dragon", "castle", "mushroom", "crystal", "portal", "camp"
  ],
  "loadingMessages": [
    "Consulting the Oracle of Lost Things...",
    "Triangulating position using broken compasses...",
    "Asking local pigeons for directions...",
    "Searching through the Library of Maybe...",
    "Decoding ancient GPS hieroglyphs...",
    "Calibrating the Uncertainty Engine..."
  ]
};

// Additional content for variety
const additionalDirections = [
  "Continue straight past the intersection of Lost Hope and Found Dreams until you reach the carousel of spinning excuses",
  "Make a U-turn at the fountain of procrastination, then follow the breadcrumbs of forgotten passwords",
  "Head southeast through the forest of mixed metaphors until you find the clearing of existential doubt",
  "Turn left at the statue of the Unknown Commuter, then right at the memorial for things we meant to do",
  "Follow the river of spilled coffee upstream to its source: the Great Cafeteria of Infinite Monday Mornings"
];

const additionalObstacles = [
  "the Great Wall of Unfinished Projects",
  "a moat filled with Monday morning feelings",
  "the Tower of Babel Fish Translation Errors",
  "a labyrinth made entirely of tangled earphone cables",
  "the Bridge of Sighs (specifically about expired yogurt)",
  "the Castle of Unreturned Borrowed Items"
];

const additionalRecommendations = [
  "A diving suit is recommended for mountain peaks",
  "Bring thermal underwear for tropical beaches",
  "Pack a life jacket for desert expeditions",
  "Don't forget your swimsuit for Arctic exploration",
  "A parachute is essential for basement visits",
  "Bring a shovel for cloud walking"
];

// Global variables
let searchHistory = []; // Removed localStorage usage
let currentLocation = '';
let mapCanvas, mapCtx;
let mapElements = [];
let speechSynthesis = window.speechSynthesis;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
});

function initializeApp() {
    console.log('Initializing app...');
    
    // Get DOM elements
    const locationInput = document.getElementById('locationInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (!locationInput || !searchBtn) {
        console.error('Required DOM elements not found');
        return;
    }
    
    // Set up event listeners
    searchBtn.addEventListener('click', handleSearch);
    locationInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    locationInput.addEventListener('input', handleInputChange);
    
    // Initialize map
    initializeMap();
    
    // Set up other event listeners
    setupEventListeners();
    
    // Update search history display
    updateSearchHistoryDisplay();
    
    // Add some initial floating animation
    animateFloatingElements();
    
    console.log('App initialized successfully');
}

function setupEventListeners() {
    // Audio guide
    const audioBtn = document.getElementById('audioBtn');
    if (audioBtn) {
        audioBtn.addEventListener('click', playAudioGuide);
    }
    
    // Randomize button
    const randomizeBtn = document.getElementById('randomizeBtn');
    if (randomizeBtn) {
        randomizeBtn.addEventListener('click', randomizeEverything);
    }
    
    // Action buttons
    const shareBtn = document.getElementById('shareBtn');
    const certificateBtn = document.getElementById('certificateBtn');
    const newSearchBtn = document.getElementById('newSearchBtn');
    
    if (shareBtn) shareBtn.addEventListener('click', openShareModal);
    if (certificateBtn) certificateBtn.addEventListener('click', openCertificateModal);
    if (newSearchBtn) newSearchBtn.addEventListener('click', startNewSearch);
    
    // Modal controls
    const closeShareModal = document.getElementById('closeShareModal');
    const closeCertificateModal = document.getElementById('closeCertificateModal');
    const copyShareText = document.getElementById('copyShareText');
    const tweetBtn = document.getElementById('tweetBtn');
    const downloadCertificate = document.getElementById('downloadCertificate');
    
    if (closeShareModal) closeShareModal.addEventListener('click', () => closeModal('shareModal'));
    if (closeCertificateModal) closeCertificateModal.addEventListener('click', () => closeModal('certificateModal'));
    if (copyShareText) copyShareText.addEventListener('click', copyShareTextFunction);
    if (tweetBtn) tweetBtn.addEventListener('click', tweetQuest);
    if (downloadCertificate) downloadCertificate.addEventListener('click', downloadCertificateFunction);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });
}

function handleInputChange() {
    const locationInput = document.getElementById('locationInput');
    const searchHistoryDiv = document.getElementById('searchHistory');
    
    if (!locationInput || !searchHistoryDiv) return;
    
    const value = locationInput.value.trim();
    if (value.length > 0 && searchHistory.length > 0) {
        searchHistoryDiv.classList.remove('hidden');
    } else {
        searchHistoryDiv.classList.add('hidden');
    }
}

function handleSearch() {
    console.log('Search triggered');
    const locationInput = document.getElementById('locationInput');
    
    if (!locationInput) {
        console.error('Location input not found');
        return;
    }
    
    const location = locationInput.value.trim();
    console.log('Searching for:', location);
    
    if (!location) {
        locationInput.classList.add('shake');
        setTimeout(() => locationInput.classList.remove('shake'), 500);
        return;
    }
    
    currentLocation = location;
    addToSearchHistory(location);
    hideSearchHistory();
    showLoading();
    
    // Simulate processing time
    setTimeout(() => {
        hideLoading();
        generateResults(location);
        showResults();
    }, 3000);
}

function showLoading() {
    console.log('Showing loading...');
    const loadingSection = document.getElementById('loadingSection');
    const resultsSection = document.getElementById('resultsSection');
    
    if (loadingSection) {
        loadingSection.classList.remove('hidden');
    }
    if (resultsSection) {
        resultsSection.classList.add('hidden');
    }
    
    // Animate progress bar
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            progressFill.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(progressInterval);
            }
        }, 200);
    }
    
    // Rotate loading messages
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            loadingMessage.textContent = appData.loadingMessages[messageIndex % appData.loadingMessages.length];
            messageIndex++;
        }, 800);
        
        setTimeout(() => {
            clearInterval(messageInterval);
        }, 3000);
    }
}

function hideLoading() {
    console.log('Hiding loading...');
    const loadingSection = document.getElementById('loadingSection');
    if (loadingSection) {
        loadingSection.classList.add('hidden');
    }
}

function generateResults(location) {
    console.log('Generating results for:', location);
    
    // Generate absurd directions
    const directions = generateDirections(location);
    const directionsText = document.getElementById('directionsText');
    if (directionsText) {
        directionsText.textContent = directions;
    }
    
    // Generate travel recommendations
    generateRecommendations();
    
    // Generate map
    generateMap();
}

function generateDirections(location) {
    const allDirections = [...appData.absurdDirections, ...additionalDirections];
    const allObstacles = [...appData.randomObstacles, ...additionalObstacles];
    
    let direction = allDirections[Math.floor(Math.random() * allDirections.length)];
    
    // Add location-specific elements
    if (location.toLowerCase().includes('atlantis')) {
        direction += `. Remember to pack your snorkel for this underwater metropolis that's definitely not mythical.`;
    } else if (location.toLowerCase().includes('sock')) {
        direction += `. You'll know you're close when you hear the faint sound of lonely feet everywhere.`;
    } else if (location.toLowerCase().includes('eiffel')) {
        direction += `. Fun fact: the real Eiffel Tower is actually just a decoy. The real one is hidden behind ${allObstacles[Math.floor(Math.random() * allObstacles.length)]}.`;
    } else {
        direction += `. Warning: you may encounter ${allObstacles[Math.floor(Math.random() * allObstacles.length)]} along the way.`;
    }
    
    return direction;
}

function generateRecommendations() {
    const allRecommendations = [...appData.travelRecommendations, ...additionalRecommendations];
    const selectedRecommendations = [];
    
    // Select 3-5 random recommendations
    const count = 3 + Math.floor(Math.random() * 3);
    while (selectedRecommendations.length < count) {
        const rec = allRecommendations[Math.floor(Math.random() * allRecommendations.length)];
        if (!selectedRecommendations.includes(rec)) {
            selectedRecommendations.push(rec);
        }
    }
    
    const recommendationsList = document.getElementById('recommendationsList');
    if (recommendationsList) {
        recommendationsList.innerHTML = '';
        selectedRecommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            recommendationsList.appendChild(li);
        });
    }
}

function showResults() {
    console.log('Showing results...');
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function addToSearchHistory(location) {
    if (!searchHistory.includes(location)) {
        searchHistory.unshift(location);
        if (searchHistory.length > 10) {
            searchHistory = searchHistory.slice(0, 10);
        }
        updateSearchHistoryDisplay();
    }
}

function updateSearchHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    historyList.innerHTML = '';
    searchHistory.forEach(location => {
        const li = document.createElement('li');
        li.textContent = location;
        li.addEventListener('click', () => {
            const locationInput = document.getElementById('locationInput');
            if (locationInput) {
                locationInput.value = location;
            }
            hideSearchHistory();
        });
        historyList.appendChild(li);
    });
}

function hideSearchHistory() {
    const searchHistoryDiv = document.getElementById('searchHistory');
    if (searchHistoryDiv) {
        searchHistoryDiv.classList.add('hidden');
    }
}

// Map functionality
function initializeMap() {
    mapCanvas = document.getElementById('mapCanvas');
    if (!mapCanvas) {
        console.error('Map canvas not found');
        return;
    }
    
    mapCtx = mapCanvas.getContext('2d');
    mapCanvas.addEventListener('click', handleMapClick);
    
    // Initialize with a default map
    generateMap();
}

function generateMap() {
    if (!mapCanvas || !mapCtx) return;
    
    // Clear canvas
    mapCtx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    
    // Draw background
    drawMapBackground();
    
    // Generate random elements
    mapElements = [];
    const elementCount = 8 + Math.floor(Math.random() * 7);
    
    for (let i = 0; i < elementCount; i++) {
        const elementType = appData.mapElements[Math.floor(Math.random() * appData.mapElements.length)];
        const element = {
            type: elementType,
            x: 50 + Math.random() * (mapCanvas.width - 100),
            y: 50 + Math.random() * (mapCanvas.height - 100),
            emoji: getElementEmoji(elementType)
        };
        mapElements.push(element);
        drawMapElement(element);
    }
    
    // Draw path
    drawPath();
}

function drawMapBackground() {
    // Create a fantasy map background
    const gradient = mapCtx.createLinearGradient(0, 0, mapCanvas.width, mapCanvas.height);
    gradient.addColorStop(0, '#e8f4f8');
    gradient.addColorStop(0.5, '#d4e8f0');
    gradient.addColorStop(1, '#c0dce8');
    
    mapCtx.fillStyle = gradient;
    mapCtx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
    
    // Add some decorative borders
    mapCtx.strokeStyle = '#8b4513';
    mapCtx.lineWidth = 3;
    mapCtx.strokeRect(5, 5, mapCanvas.width - 10, mapCanvas.height - 10);
}

function getElementEmoji(type) {
    const emojiMap = {
        'treasure chest': '💰',
        'footprint': '👣',
        'warning sign': '⚠️',
        'compass rose': '🧭',
        'dragon': '🐉',
        'castle': '🏰',
        'mushroom': '🍄',
        'crystal': '💎',
        'portal': '🌀',
        'camp': '⛺'
    };
    return emojiMap[type] || '❓';
}

function drawMapElement(element) {
    mapCtx.font = '20px Arial';
    mapCtx.fillStyle = '#333';
    mapCtx.fillText(element.emoji, element.x, element.y);
}

function drawPath() {
    mapCtx.strokeStyle = '#ff6b6b';
    mapCtx.lineWidth = 2;
    mapCtx.setLineDash([5, 5]);
    
    mapCtx.beginPath();
    mapCtx.moveTo(50, mapCanvas.height - 50);
    
    // Create a winding path
    for (let i = 0; i < 5; i++) {
        const x = 100 + (i * 100) + (Math.random() - 0.5) * 80;
        const y = 100 + Math.random() * (mapCanvas.height - 200);
        mapCtx.lineTo(x, y);
    }
    
    mapCtx.stroke();
    mapCtx.setLineDash([]);
}

function handleMapClick(event) {
    const rect = mapCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Scale coordinates if canvas is resized
    const scaleX = mapCanvas.width / rect.width;
    const scaleY = mapCanvas.height / rect.height;
    const clickX = x * scaleX;
    const clickY = y * scaleY;
    
    // Check if clicked near any element
    let clickedElement = null;
    mapElements.forEach(element => {
        const distance = Math.sqrt((clickX - element.x) ** 2 + (clickY - element.y) ** 2);
        if (distance < 30) {
            clickedElement = element;
        }
    });
    
    if (clickedElement) {
        showMapElementInfo(clickedElement);
    } else {
        showRandomMapEvent(clickX, clickY);
    }
}

function showMapElementInfo(element) {
    const messages = {
        'treasure chest': 'You found a treasure chest! Inside: 3 buttons, a rubber duck, and existential dread.',
        'footprint': 'These footprints belong to someone who was definitely lost, just like you!',
        'warning sign': 'Warning: This sign warns about other warning signs. Very meta.',
        'dragon': 'The dragon offers you directions, but only speaks in interpretive dance.',
        'castle': 'This castle is closed for renovations. Estimated completion: next Tuesday, maybe.',
        'portal': 'Portal temporarily out of order. Please try the stairs.',
        'mushroom': 'This mushroom contains wisdom. Also, it might be poisonous. Hard to tell.',
        'crystal': 'The crystal reveals your future: you will continue to be lost.',
        'camp': 'Previous travelers camped here. They left a note: "Good luck, you\'ll need it."',
        'compass rose': 'This compass points in all directions at once. Very helpful!'
    };
    
    alert(messages[element.type] || 'You discovered something mysterious!');
}

function showRandomMapEvent(x, y) {
    const events = [
        'You found a random spot! Nothing here but pure, concentrated nowhere.',
        'Congratulations! You\'ve discovered the intersection of Lost and Confused.',
        'This location has been temporarily misplaced. Please check back never.',
        'You hear the distant sound of someone else being equally lost.',
        'A wild tumbleweed appears! It seems to know where it\'s going better than you do.'
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    alert(event);
    
    // Add a temporary marker
    mapCtx.fillStyle = '#ff4444';
    mapCtx.beginPath();
    mapCtx.arc(x, y, 5, 0, 2 * Math.PI);
    mapCtx.fill();
    
    setTimeout(() => {
        generateMap();
    }, 2000);
}

// Audio functionality
function playAudioGuide() {
    if (!speechSynthesis) {
        alert('Sorry, your browser doesn\'t support the audio guide feature!');
        return;
    }
    
    const directionsText = document.getElementById('directionsText');
    if (!directionsText) return;
    
    const text = directionsText.textContent;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Make it sound more dramatic
    utterance.rate = 0.8;
    utterance.pitch = 0.9;
    utterance.volume = 0.8;
    
    // Try to use a more interesting voice
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
        utterance.voice = voices[Math.floor(Math.random() * voices.length)];
    }
    
    speechSynthesis.speak(utterance);
    
    // Visual feedback
    const audioBtn = document.getElementById('audioBtn');
    if (audioBtn) {
        audioBtn.innerHTML = '<span>🔊 Playing...</span>';
        
        utterance.onend = () => {
            audioBtn.innerHTML = '<span>🔊 Play Audio Guide</span>';
        };
    }
}

function randomizeEverything() {
    if (!currentLocation) return;
    
    // Regenerate all content
    generateResults(currentLocation);
    
    // Add some visual flair
    document.body.style.filter = 'hue-rotate(' + Math.random() * 360 + 'deg)';
    setTimeout(() => {
        document.body.style.filter = 'none';
    }, 1000);
}

function startNewSearch() {
    const locationInput = document.getElementById('locationInput');
    const resultsSection = document.getElementById('resultsSection');
    
    if (locationInput) {
        locationInput.value = '';
        locationInput.focus();
    }
    if (resultsSection) {
        resultsSection.classList.add('hidden');
    }
}

// Modal functionality
function openShareModal() {
    const directionsText = document.getElementById('directionsText');
    if (!directionsText) return;
    
    const shareText = `I just searched for "${currentLocation}" using the 404 Location Finder and got completely lost! 🗺️ The directions involved ${directionsText.textContent.split(' ').slice(0, 10).join(' ')}... Try it yourself and join me in the land of the perpetually lost! #404LocationFinder #CompletelyLost`;
    
    const shareTextArea = document.getElementById('shareText');
    if (shareTextArea) {
        shareTextArea.value = shareText;
    }
    
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        shareModal.classList.remove('hidden');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

function copyShareTextFunction() {
    const shareText = document.getElementById('shareText');
    if (!shareText) return;
    
    shareText.select();
    shareText.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        const copyBtn = document.getElementById('copyShareText');
        if (copyBtn) {
            copyBtn.textContent = '✅ Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = '📋 Copy Text';
            }, 2000);
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}

function tweetQuest() {
    const shareText = document.getElementById('shareText');
    if (!shareText) return;
    
    const text = encodeURIComponent(shareText.value);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
}

function openCertificateModal() {
    const certificateName = document.getElementById('certificateName');
    const certificateLocation = document.getElementById('certificateLocation');
    const certificateDate = document.getElementById('certificateDate');
    
    if (certificateName) certificateName.textContent = 'Brave Explorer';
    if (certificateLocation) certificateLocation.textContent = currentLocation;
    if (certificateDate) certificateDate.textContent = new Date().toLocaleDateString();
    
    const certificateModal = document.getElementById('certificateModal');
    if (certificateModal) {
        certificateModal.classList.remove('hidden');
    }
}

function downloadCertificateFunction() {
    const certificate = document.getElementById('certificate');
    if (!certificate) return;
    
    // Create a simple download
    const text = certificate.textContent;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `404-certificate-${currentLocation.replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function animateFloatingElements() {
    const elements = document.querySelectorAll('.floating-element');
    elements.forEach((element, index) => {
        // Random position
        element.style.left = Math.random() * 80 + '%';
        element.style.top = Math.random() * 80 + '%';
        
        // Start animation
        setTimeout(() => {
            element.style.animation = `float ${8 + Math.random() * 4}s ease-in-out infinite`;
        }, index * 1000);
    });
}

// Add some easter eggs
document.addEventListener('keydown', function(e) {
    // Konami code: up, up, down, down, left, right, left, right, B, A
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    if (!window.konamiSequence) window.konamiSequence = [];
    
    window.konamiSequence.push(e.keyCode);
    if (window.konamiSequence.length > konamiCode.length) {
        window.konamiSequence = window.konamiSequence.slice(-konamiCode.length);
    }
    
    if (window.konamiSequence.join(',') === konamiCode.join(',')) {
        activateEasterEgg();
        window.konamiSequence = [];
    }
});

function activateEasterEgg() {
    alert('🎉 You found the secret code! Everything is now extra ridiculous!');
    
    // Make everything more ridiculous
    document.body.style.transform = 'rotate(1deg)';
    document.body.style.filter = 'sepia(20%) hue-rotate(180deg)';
    
    // Add dancing elements
    const elements = document.querySelectorAll('*');
    elements.forEach((el, index) => {
        if (Math.random() < 0.1) {
            el.style.animation = `wobble ${1 + Math.random() * 2}s ease-in-out infinite`;
        }
    });
    
    setTimeout(() => {
        document.body.style.transform = 'none';
        document.body.style.filter = 'none';
        elements.forEach(el => {
            el.style.animation = '';
        });
    }, 10000);
}