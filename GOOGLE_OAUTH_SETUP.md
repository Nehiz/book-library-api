# Google OAuth Setup Instructions for W04 Project

## Step 1: Create Google OAuth Application

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select an existing one
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" 
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Name it "Book Library API W04"
   
5. **Configure OAuth Settings**:
   - **Authorized JavaScript origins**: 
     - http://localhost:3000
     - https://your-render-app-name.onrender.com
   
   - **Authorized redirect URIs**:
     - http://localhost:3000/api/v1/auth/google/callback
     - https://your-render-app-name.onrender.com/api/v1/auth/google/callback

6. **Copy the credentials**:
   - Client ID (starts with something like: 123456789-abc...)
   - Client Secret (starts with something like: GOCSPX-...)

## Step 2: Update Environment Variables

Add these to your .env file:
```
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
```

## Step 3: Update Render Environment Variables

When deploying to Render, add the same environment variables in your Render dashboard.

## For Demo Purposes (If you don't want to set up Google OAuth):

The application will work perfectly without Google OAuth. The OAuth endpoints will show:
"Google OAuth not configured - please set up credentials" 

This is acceptable for the W04 project demonstration.

## Testing OAuth (Once Set Up):

1. Visit: http://localhost:3000/api/v1/auth/google
2. Should redirect to Google login
3. After login, returns to callback with JWT token

---
**Note**: For this W04 project, JWT authentication is the main requirement. 
OAuth is an additional feature that enhances the project but isn't strictly required.