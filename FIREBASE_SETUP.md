# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for your Lavvissa project.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" and follow the setup wizard
3. Once your project is created, click on "Web" (</>) to add a web app to your project
4. Register your app with a nickname (e.g., "Lavvissa Frontend")
5. Copy the Firebase configuration object

## Step 2: Set Up Environment Variables

1. Create a `.env.local` file in the root of your project with the following variables:

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

Replace all placeholder values with the actual values from your Firebase configuration.

## Step 3: Enable Authentication Methods

1. In the Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable the authentication methods you want to use:
   - Email/Password
   - Google
   - (You can enable others like Apple, Facebook, etc. later)

### For Google Authentication:

1. Click on Google in the sign-in providers list
2. Enable it and provide your support email
3. Save your changes

## Step 4: Set Up Firestore Database

1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose either "Production mode" or "Test mode" (Test mode allows everyone to read/write to your database initially)
4. Select a location closest to your users
5. Click "Enable"

## Step 5: Set Up Security Rules for Firestore

Navigate to "Firestore Database" → "Rules" and set up basic security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and update their own data
    match /users/{userId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
    
    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Step 6: Testing

Now you should be able to:
1. Register with email/password
2. Sign in with Google
3. Reset passwords
4. View and update user profiles

## Troubleshooting

- **Callback URL Issues**: For Google Auth, make sure you have added your domain to the authorized domains list in Firebase Authentication settings.
- **CORS Issues**: If you're having CORS problems, ensure your Firebase project's authorized domains include your development domain (localhost, etc.).
- **Error 400 in Google Sign-in**: Check that you've properly configured your OAuth consent screen in Google Cloud Platform.

## Next Steps

- Add more authentication providers (Apple, Facebook, Twitter, etc.)
- Implement role-based access control
- Add more user profile data to Firestore 