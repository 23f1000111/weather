# Deploying JalVaayu Weather App to Heroku

This guide will walk you through deploying your JalVaayu Weather App to Heroku.

## Prerequisites

1. Create a [Heroku account](https://signup.heroku.com/) if you don't already have one
2. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
3. Install [Git](https://git-scm.com/downloads) if not already installed

## Deployment Steps

### 1. Initialize Git Repository

```bash
# Navigate to your project directory
cd /Volumes/Tarun\ 1/Weather

# Initialize git repository
git init

# Add all files to git
git add .

# Commit the changes
git commit -m "Initial commit for Heroku deployment"
```

### 2. Log in to Heroku

```bash
# Login to your Heroku account
heroku login
```

### 3. Create a Heroku App

```bash
# Create a new Heroku app
heroku create jalvaayu-weather

# Note: If the name 'jalvaayu-weather' is already taken, Heroku will suggest an alternative name
```

### 4. Deploy to Heroku

```bash
# Push your code to Heroku
git push heroku master

# If you're on the main branch instead of master
# git push heroku main
```

### 5. Open Your App

```bash
# Open your app in the browser
heroku open
```

## Updating Your App

Whenever you make changes to your app, you'll need to:

1. Commit your changes to git
```bash
git add .
git commit -m "Description of changes"
```

2. Push to Heroku
```bash
git push heroku master  # or git push heroku main
```

## Environment Variables

To set environment variables in Heroku (for API keys, etc.):

```bash
heroku config:set WEATHER_API_KEY=your_api_key
```

## Viewing Logs

To see logs from your app:

```bash
heroku logs --tail
```

## Troubleshooting

If you encounter issues:

1. Check your Heroku logs: `heroku logs --tail`
2. Make sure your app works locally: `npm start`
3. Verify your package.json has the correct start script
4. Check that your Procfile is correct
5. Ensure all files are committed to git

## Additional Resources

- [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Deploying Node.js Apps on Heroku](https://devcenter.heroku.com/articles/deploying-nodejs)
- [Heroku Dev Center](https://devcenter.heroku.com/)
