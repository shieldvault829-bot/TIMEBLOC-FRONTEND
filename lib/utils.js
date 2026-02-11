// Utility functions for TimeBloc

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
};

// Encrypt text
export const encryptText = async (text, key) => {
  if (!text || !key) return text;
  
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(key),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      data
    );
    
    return {
      encrypted: Buffer.from(encrypted).toString('base64'),
      iv: Buffer.from(iv).toString('base64')
    };
  } catch (error) {
    console.error('Encryption error:', error);
    return text;
  }
};

// Decrypt text
export const decryptText = async (encryptedData, key) => {
  if (!encryptedData || !key) return encryptedData;
  
  try {
    const encoder = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(key),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const encrypted = Buffer.from(encryptedData.encrypted, 'base64');
    const iv = Buffer.from(encryptedData.iv, 'base64');
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encrypted
    );
    
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedData;
  }
};

// Generate referral code
export const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TIMEBLOC-${code}`;
};

// Check if content is NSFW
export const checkNSFW = async (text) => {
  // Simple keyword check - in production use AI/ML service
  const nsfwKeywords = [
    'porn', 'xxx', 'adult', 'nsfw', 'sex', 'nude',
    'drugs', 'violence', 'hate', 'racist'
  ];
  
  const lowerText = text.toLowerCase();
  const matches = nsfwKeywords.filter(keyword => 
    lowerText.includes(keyword)
  );
  
  return {
    isNSFW: matches.length > 0,
    score: matches.length / nsfwKeywords.length,
    matchedKeywords: matches
  };
};

// Upload file to Supabase storage
export const uploadFile = async (file, bucket = 'user-gallery') => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.user.id}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);
  
  if (error) throw error;
  
  return {
    url: data.path,
    publicUrl: supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl
  };
};

// Get subscription features
export const getSubscriptionFeatures = (tier) => {
  const features = {
    free: [
      '3 daily posts',
      'Basic editing tools',
      '500MB storage',
      'Community support'
    ],
    student: [
      '10 daily posts',
      'Advanced editing',
      '5GB storage',
      'Priority support',
      'Student badge',
      'Basic auto-publish'
    ],
    family: [
      '25 daily posts',
      'Pro editing suite',
      '20GB shared storage',
      'Up to 5 family members',
      'Family badge',
      'Advanced auto-publish'
    ],
    premium: [
      'Unlimited posts',
      'AI editing tools',
      '50GB storage',
      'Premium badge',
      'Scheduled auto-publish',
      'Advanced analytics'
    ],
    elite: [
      'Everything in Premium',
      '100GB storage',
      'Team collaboration',
      'Elite badge',
      'Custom branding',
      'API access',
      '24/7 phone support'
    ]
  };
  
  return features[tier] || features.free;
};