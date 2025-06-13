// middleware/auth.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with service role
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // From your .env
);

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // 1. Check for token
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify token using Supabase (no JWT secret needed!)
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) throw error;
    if (!user) throw new Error('Invalid user');

    // 3. Attach standardized user object
    req.user = {
      id: user.id, // Always use 'id' (not 'sub')
      email: user.email
      // Add other needed properties
    };

    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    
    // 4. Specific error handling
    const errorMessage = err.message.includes('expired') 
      ? 'Session expired - please log in again'
      : 'Invalid authentication token';
    
    return res.status(401).json({ error: errorMessage });
  }
};