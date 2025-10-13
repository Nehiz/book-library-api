const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Google OAuth Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/v1/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔍 Google OAuth Profile:', {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName
    });

    // Check if user already exists with Google ID
    let user = await User.findByGoogleId(profile.id);
    
    if (user) {
      console.log('✅ Existing Google user found:', user.email);
      return done(null, user);
    }

    // Check if user exists with same email (link accounts)
    const email = profile.emails[0].value;
    user = await User.findByEmail(email);
    
    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      user.avatar = profile.photos[0]?.value || user.avatar;
      await user.save();
      console.log('🔗 Linked Google account to existing user:', user.email);
      return done(null, user);
    }

    // Create new user
    user = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: email,
      avatar: profile.photos[0]?.value || '',
      // No password required for OAuth users
    });

    console.log('✅ New Google user created:', user.email);
    return done(null, user);

  } catch (error) {
    console.error('❌ Google OAuth error:', error);
    return done(error, null);
  }
  }));
} else {
  console.log('ℹ️ Google OAuth not configured - skipping Google strategy');
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;