// Collection of motivational quotes by category
const quoteCategories = {
    personal_development: [
        {
            title: "Growth Mindset",
            description: "The only person you should try to be better than is the person you were yesterday.",
            image: "https://images.pexels.com/photos/1146242/pexels-photo-1146242.jpeg?auto=compress&cs=tinysrgb&w=300",
            category: "Personal Development"
        },
        {
            title: "Continuous Learning",
            description: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
            image: "https://images.pexels.com/photos/256517/pexels-photo-256517.jpeg?auto=compress&cs=tinysrgb&w=300",
            category: "Personal Development"
        }
    ],
    career_success: [
        {
            title: "Professional Excellence",
            description: "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
            image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300",
            category: "Career"
        },
        {
            title: "Work Ethic",
            description: "The only place where success comes before work is in the dictionary.",
            image: "https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=300",
            category: "Career"
        }
    ],
    relationships: [
        {
            title: "Connection",
            description: "The quality of your life is the quality of your relationships.",
            image: "https://images.pexels.com/photos/1645668/pexels-photo-1645668.jpeg?auto=compress&cs=tinysrgb&w=300",
            category: "Relationships"
        },
        {
            title: "Empathy",
            description: "When you show deep empathy toward others, their defensive energy goes down, and positive energy replaces it.",
            image: "https://images.pexels.com/photos/6964367/pexels-photo-6964367.jpeg?auto=compress&cs=tinysrgb&w=300",
            category: "Relationships"
        }
    ],
    health_wellness: [
        {
            title: "Mental Health",
            description: "Take care of your body. It's the only place you have to live.",
            image: "https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&cs=tinysrgb&w=300",
            category: "Health"
        },
        {
            title: "Balance",
            description: "Health is not about the weight you lose, but about the life you gain.",
            image: "https://images.pexels.com/photos/40751/running-runner-long-distance-fitness-40751.jpeg?auto=compress&cs=tinysrgb&w=300",
            category: "Health"
        }
    ],
    financial_wisdom: [
        {
            title: "Investment",
            description: "The best investment you can make is in yourself.",
            image: "https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg?auto=compress&cs=tinysrgb&w=300",
            category: "Finance"
        },
        {
            title: "Financial Freedom",
            description: "Don't save what is left after spending; spend what is left after saving.",
            image: "https://images.pexels.com/photos/47344/dollar-currency-money-us-dollar-47344.jpeg?auto=compress&cs=tinysrgb&w=300",
            category: "Finance"
        }
    ],
    creativity_innovation: [
        {
            title: "Creative Thinking",
            description: "Creativity is intelligence having fun.",
            image: "https://images.pexels.com/photos/20967/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300",
            category: "Creativity"
        },
        {
            title: "Innovation",
            description: "Innovation distinguishes between a leader and a follower.",
            image: "https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=300",
            category: "Creativity"
        }
    ],
    resilience: [
        {
            title: "Overcoming Challenges",
            description: "The oak fought the wind and was broken, the willow bent when it must and survived.",
            image: "https://images.pexels.com/photos/163444/sport-treadmill-tor-route-163444.jpeg?auto=compress&cs=tinysrgb&w=300",
            category: "Resilience"
        },
        {
            title: "Persistence",
            description: "It's not whether you get knocked down, it's whether you get up.",
            image: "https://images.pexels.com/photos/1574850/pexels-photo-1574850.jpeg?auto=compress&cs=tinysrgb&w=300",
            category: "Resilience"
        }
    ],
    leadership: [
        {
            title: "Leading by Example",
            description: "A leader is one who knows the way, goes the way, and shows the way.",
            image: "https://images.pexels.com/photos/2422294/pexels-photo-2422294.jpeg?auto=compress&cs=tinysrgb&w=300",
            category: "Leadership"
        },
        {
            title: "Influence",
            description: "Leadership is not about being in charge. Leadership is about taking care of those in your charge.",
            image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=300",
            category: "Leadership"
        }
    ],
    mindfulness: [
        {
            title: "Present Moment",
            description: "The present moment is the only time over which we have dominion.",
            image: "https://images.pexels.com/photos/268134/pexels-photo-268134.jpeg?auto=compress&cs=tinysrgb&w=300",
            category: "Mindfulness"
        },
        {
            title: "Inner Peace",
            description: "Peace comes from within. Do not seek it without.",
            image: "https://images.pexels.com/photos/747964/pexels-photo-747964.jpeg?auto=compress&cs=tinysrgb&w=300",
            category: "Mindfulness"
        }
    ],
    success: [
        {
            title: "Achievement",
            description: "Success is walking from failure to failure with no loss of enthusiasm.",
            image: "https://images.pexels.com/photos/2681319/pexels-photo-2681319.jpeg?auto=compress&cs=tinysrgb&w=300",
            category: "Success"
        },
        {
            title: "Determination",
            description: "The difference between the impossible and the possible lies in determination.",
            image: "https://images.pexels.com/photos/1432942/pexels-photo-1432942.jpeg?auto=compress&cs=tinysrgb&w=300",
            category: "Success"
        }
    ]
};

// Function to get all quotes as a flat array
function getAllQuotes() {
    return Object.values(quoteCategories).flat();
}

// Function to get a random quote from a specific category
function getRandomQuoteFromCategory(category) {
    if (quoteCategories[category]) {
        const quotes = quoteCategories[category];
        return quotes[Math.floor(Math.random() * quotes.length)];
    }
    return null;
}

// Function to get a random quote from any category
function getRandomQuote() {
    const allQuotes = getAllQuotes();
    return allQuotes[Math.floor(Math.random() * allQuotes.length)];
}

// Function to get quotes by mood
function getQuotesByMood(mood) {
    const moodMap = {
        'happy': ['success', 'creativity_innovation', 'mindfulness'],
        'motivated': ['career_success', 'personal_development', 'leadership'],
        'reflective': ['mindfulness', 'relationships', 'health_wellness'],
        'challenged': ['resilience', 'financial_wisdom', 'success']
    };

    if (moodMap[mood]) {
        const relevantCategories = moodMap[mood];
        const relevantQuotes = relevantCategories.flatMap(category => quoteCategories[category]);
        return relevantQuotes[Math.floor(Math.random() * relevantQuotes.length)];
    }
    return getRandomQuote();
}

// Export the quotes and functions
export { 
    quoteCategories, 
    getAllQuotes, 
    getRandomQuote, 
    getRandomQuoteFromCategory,
    getQuotesByMood 
};
