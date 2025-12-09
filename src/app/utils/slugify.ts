export const generateSlug = (text: string): string => {
    return text
        .toLowerCase() // lowercase করুন
        .trim() // আগে-পিছের space remove
        .replace(/[^\w\s-]/g, '') // special characters remove (শুধু word, space, hyphen রাখুন)
        .replace(/\s+/g, '-') // spaces কে hyphen দিয়ে replace
        .replace(/-+/g, '-') // multiple hyphens কে একটা করুন
        .replace(/^-+|-+$/g, ''); // শুরু/শেষের hyphens remove
};

// Example usage:
// "Social Meetups" → "social-meetups"
// "Tech & Gaming!" → "tech-gaming"
// "  Sports   Events  " → "sports-events"
