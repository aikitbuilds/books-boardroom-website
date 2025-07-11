#!/bin/bash

echo "🚀 BooksBoardroom Portal Deployment Script"
echo "========================================="
echo ""

# Check if logged in to Firebase
echo "📋 Checking Firebase authentication..."
if ! firebase projects:list &>/dev/null; then
    echo "❌ Not logged in to Firebase"
    echo "👉 Please run: firebase login"
    exit 1
fi

echo "✅ Firebase authentication confirmed"
echo ""

# Use the BooksBoardroom project
echo "📁 Setting active project to BooksBoardroom..."
firebase use booksboardroom

echo ""
echo "🏗️  Building production version..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Your BooksBoardroom Portal is now live at:"
    echo "   https://booksboardroom.web.app"
    echo "   https://booksboardroom.firebaseapp.com"
    echo ""
    echo "📊 Features available:"
    echo "   - Back Office Dashboard (/back-office)"
    echo "   - CRM System (/crm)"
    echo "   - Financial Dashboard (/financial)"
    echo "   - Project Management"
    echo "   - File Management"
    echo "   - Project Tracker (/projecttracker.html)"
else
    echo ""
    echo "❌ Deployment failed!"
    echo "Please check the error messages above."
fi