# Campus Guide

A comprehensive campus navigation and information system designed to help students, staff, and visitors easily find and access various locations and services across the university campus.

## Features

- **Interactive Location Search**: Find any campus location using natural language queries
- **AI-Powered Search**: Advanced search functionality that understands context and intent
- **Category Browsing**: Explore locations by category (Academic Buildings, Libraries, Dining Halls, etc.)
- **Real-time Directions**: Get turn-by-turn directions to any campus location
- **Pharmacy Finder**: Locate campus pharmacies and check medicine availability
- **Medicine Search**: Find specific medications across all campus pharmacies
- **Multi-language Support**: Voice search in multiple languages including English, French, and local languages
- **Admin Dashboard**: Comprehensive management system for administrators
- **Pharmacy Portal**: Dedicated portal for pharmacy staff to manage inventory

## Technology Stack

- **Frontend**: React with TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Supabase Auth
- **Serverless Functions**: Supabase Edge Functions
- **Maps Integration**: Google Maps API
- **UI Components**: Lucide React, Framer Motion, React Icons
- **State Management**: React Context API
- **Voice Recognition**: Web Speech API with multi-language support

## Project Structure

The project is organized into several key components:

- **Home**: Main landing page with search functionality and category navigation
- **Categories**: Dedicated pages for each location type (Academic, Libraries, Dining, etc.)
- **Medicines**: Browse and search for medications across campus pharmacies
- **Pharmacies**: View all campus pharmacies with detailed information
- **Admin Dashboard**: Comprehensive management interface for administrators
- **Pharmacy Dashboard**: Inventory management for pharmacy staff

## Database Schema

The database includes several interconnected tables:

- **locations**: Base table for all campus locations
- **academic_buildings**, **libraries**, **dining_halls**, etc.: Specialized tables for each location type
- **pharmacies**: Information about campus pharmacies
- **medicines**: Details about available medications
- **medicine_pharmacies**: Junction table linking medicines to pharmacies
- **users** and **admin_users**: User authentication and management
- **notifications**: System notifications for users

## AI Search Functionality

The system includes an AI-powered search function that:

1. Processes natural language queries
2. Identifies location types and keywords
3. Performs context-aware database searches
4. Returns relevant results with coordinates
5. Provides directions via Google Maps integration

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/campus-guide.git
   cd campus-guide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Deployment

The project is configured for deployment on Netlify:

```bash
# Deploy to Netlify
netlify deploy --prod
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.