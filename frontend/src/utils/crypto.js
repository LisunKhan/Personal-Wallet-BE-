/**
 * Generate a deterministic salt from email for consistent hashing
 */
export const generateSalt = async (email) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(email + 'wallet_salt'); // Add app-specific salt
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return new Uint8Array(hashBuffer.slice(0, 16)); // Use first 16 bytes as salt
};

/**
 * Hash the master password with email-based salt using PBKDF2
 * (Using Web Crypto API for better compatibility)
 */
export const hashMasterPassword = async (password, email) => {
    try {
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);
        const salt = await generateSalt(email);

        // Import password as key material
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            { name: 'PBKDF2' },
            false,
            ['deriveBits']
        );

        // Derive key using PBKDF2
        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000, // 100k iterations for security
                hash: 'SHA-256'
            },
            keyMaterial,
            256 // 256 bits = 32 bytes
        );

        // Convert to base64 for storage
        const hashArray = new Uint8Array(derivedBits);
        return btoa(String.fromCharCode(...hashArray));
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Failed to hash password');
    }
};

/**
 * Derive encryption key from master password (for future vault encryption)
 */
export const deriveEncryptionKey = async (password, email) => {
    try {
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);
        const salt = await generateSalt(email + '_encryption'); // Different salt for encryption

        // Import password as key material
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );

        // Derive AES key for encryption
        const encryptionKey = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );

        return encryptionKey;
    } catch (error) {
        console.error('Error deriving encryption key:', error);
        throw new Error('Failed to derive encryption key');
    }
};