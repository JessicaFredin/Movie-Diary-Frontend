# Movie Diary

Movie Diary is an application that allows users to track the movies and TV shows they have watched throughout their lives. Using the TMDB API, users can add titles to a personal diary, monitor their progress in TV series, and easily search or filter their logged content. The app also includes social features such as user profiles and the ability to connect with friends to see what they have watched, creating a shared movie-tracking experience.

## Description

Movie Diary is a personal tracking application designed for people who enjoy watching movies and TV shows and want an easy way to keep track of what they have watched over time. Many viewers struggle to remember which films they have already seen, which shows they started but never finished, or how far they have progressed in a series. Movie Diary solves this by allowing users to log movies and TV shows into a personal diary where everything is organized in one place.

The application uses the TMDB API to provide detailed information about movies and TV series. Users can add titles to their diary, track their progress in TV shows by season or episode, and see their completion status—for example, showing the percentage of a show watched or marking it as finished once all episodes are completed.

Movie Diary also includes social features that allow users to create profiles, add friends, and view what others have logged in their diaries if they choose to share their activity. This makes the platform not only a personal tracking tool but also a way to discover new movies and shows through friends.

The app is designed for movie enthusiasts, TV series fans, and anyone who wants a simple and organized way to track their viewing history and progress.

## Features

- **Track Movies and TV Shows**  
  Add movies and TV series to your personal diary to keep a record of everything you have watched.

- **TV Show Progress Tracking**  
  Track your progress in TV shows by episodes and seasons. The app displays how much of a series you have watched, including percentage progress or a completed status when finished.

- **Personal Diary**  
  All watched content is saved in a personal diary where users can easily browse their viewing history.

- **Search and Filter**  
  Quickly search for specific titles or filter your diary to find movies and shows you have logged.

- **Movie and TV Data from TMDB**  
  The app integrates with the TMDB API to provide reliable information about movies and TV series.

- **User Profiles**  
  Create a personal profile where your diary activity and viewing history are connected to your account.

- **Friends and Social Features**  
  Add friends and view what movies and shows they have logged in their diaries if they choose to share their activity.

- **Discovery Through Friends**  
  Explore new movies and TV shows by seeing what your friends are watching or have recently added.

# Screenshots / Preview

Add images or GIFs showing how the app looks and works.
This helps people quickly understand the project.

## 🛠 Tech Stack

The following technologies and tools were used to build this project:

**Frontend**
- React  
- Next.js  
- TypeScript  
- Tailwind CSS  

**Backend**
- Node.js  
- Express  

**Database**
- PostgreSQL  

**API**
- TMDB API (The Movie Database) for retrieving movie and TV show data

## 🚀 Installation

Follow these steps to run the project locally.

### 1. Clone the Repository

Clone the project to your local machine.

```bash
git clone https://github.com/yourusername/movie-diary.git
```

### Navigate to the Project Folder
Move into the project directory
```bash
cd movie-diary
```

### Install Dependencies
Install all required packages.
```bash
npm install
```

### Get a TMDB API Key
This project uses the TMDB (The Movie Database) API to retrieve movie and TV show data.
1. Go to https://www.themoviedb.org/
2. Create an account if you do not already have one
3. Open Account Settings
4. Navigate to the API section
5. Request and generate your API Key

### Create Environment Variables
Create a file called:
```bash
.env.local
```
in the root of the project

Add the following variable:
```bash
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```
Replace your_tmdb_api_key_here with the API key you generated from TMDB.

### Run the Development Server
Start the application locally
```bash
npm run dev
```
### Open the Application
Once the server starts, open your browser and go to:
```bash
http://localhost:3000
```
The Movie Diary application should now be running locally.

## 🔑 Environment Variables

This project requires a **TMDB API key** in order to fetch movie and TV show data.

### 1. Create an Environment File

Create a file named `.env.local` in the **root directory of the project**.

### 2. Add the Required Variable

Add the following variable to the `.env.local` file:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```
## ▶️ Usage

Once the application is running locally, you can start using Movie Diary to track your movies and TV shows.

1. **Create an Account**  
   Sign up for a user account to create your personal profile.

2. **Search for Movies or TV Shows**  
   Use the search functionality to find movies or TV series. The application retrieves data from the **TMDB API**.

3. **Add Titles to Your Diary**  
   Add movies or TV shows you have watched to your personal diary.

4. **Track TV Show Progress**  
   For TV shows, you can track how many episodes or seasons you have watched. The app will display your progress, such as the percentage of the show completed or whether the show is fully finished.

5. **Browse and Manage Your Diary**  
   View your logged movies and shows in your diary. You can search or filter entries to quickly find specific titles.

6. **Connect with Friends**  
   Add friends and explore what they have logged in their diaries if they choose to share their activity.

This workflow allows you to keep a structured record of your viewing history while also discovering new content through friends.

## 📂 Project Structure

Below is the folder structure of the **Movie Diary** project.


### Structure Overview

- **app/** — Contains all application routes using the Next.js App Router.
- **components/** — Reusable UI components used throughout the application.
- **services/** — Logic for external APIs such as the TMDB API.
- **context/** — Global state management using React Context.
- **constants/** — Shared constants used across the application.
- **types/** — TypeScript interfaces and types.
- **utils/** — Helper and utility functions used across the project.

## 🧭 Roadmap

The following features and improvements are planned for future versions of **Movie Diary**:

- ⭐ **Rating System**  
  Allow users to rate movies and TV shows they have watched.

- 📝 **Reviews and Comments**  
  Enable users to write short reviews or notes for movies and shows in their diary.

- 📊 **Viewing Statistics**  
  Show statistics such as total movies watched, favorite genres, most watched actors, and yearly viewing summaries.

- 🎯 **Personalized Recommendations**  
  Suggest movies and TV shows based on the user's diary history and preferences.

- 👥 **Improved Social Features**  
  Expand the friends system with activity feeds and the ability to see what friends are currently watching.

- 📱 **Mobile Experience Improvements**  
  Improve responsiveness and usability for mobile devices.

- 🔔 **Notifications**  
  Notify users about new episodes of shows they are watching or activity from friends.

- 🎬 **Watchlist Feature**  
  Allow users to save movies and shows they plan to watch later.

## 🤝 Contributing

Contributions are welcome and appreciated. If you would like to improve the project, fix bugs, or add new features, you can contribute by following these steps:

1. **Fork the Repository**  
   Create your own copy of the repository by clicking the **Fork** button on GitHub.

2. **Clone Your Fork**  
   Clone the forked repository to your local machine.

```bash
git clone https://github.com/yourusername/movie-diary.git
```
3. **Create a New Branch**  
   Create a separate branch for your changes.

```bash
git checkout -b feature/your-feature-name
```
4. **Make Your Changes**  
   Implement your feature, improvement, or bug fix.

5. **Commit Your Changes**
```bash
git commit -m "Add: description of the change"
```
6. **Push the Branch**
```bash
git push origin feature/your-feature-name
```
7. **Open a Pull Request**  
   Go to the original repository on GitHub and open a Pull Request describing the changes you made.

Please ensure your code follows the project's structure and coding standards where possible.

## 📄 License

This project is licensed under the **MIT License**.

The MIT License allows anyone to use, modify, and distribute the project with minimal restrictions. For more details, see the `LICENSE` file in this repository.

## 👨‍💻 Author

**Jessica Fredin**

- GitHub: https://github.com/JessicaFredin
- Portfolio: https://jessicafredin.github.io/Portfolio/index.html   
- LinkedIn: https://www.linkedin.com/in/jessica-fredin-6ab751124/