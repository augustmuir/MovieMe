
# MovieMe - Sample Project

Movie me is a simple web appication which allows you to explore, search, and journal movies.

#### Preview: [movie-me-six.vercel.app](https://movie-me-six.vercel.app/)

## Features

- Explore Upcoming, Top Rated, In Theatres and Upcoming Movies
- Anonymously like & dislike movies
- Add & manage your own movie journal
- Search for any movie



## Tech Stack

**Client:** NextJS (React), TailwindCSS

**Server:** PostgreSQL, NextJS Server Side API


## Run Locally

Clone the project

```bash
  gh repo clone augustmuir/MovieMe
```

Go to the project directory

```bash
  cd MovieMe
```

Install dependencies

```bash
  npm install
```

Create a `.env.local` file in the root directory and fill out enviroment variables. [Contact me](mailto:mail@augustmuir.com) for keys.  
For the API to work the port in `NEXT_PUBLIC_SERVER` must match your local server The default port is 3000.

```bash
TMDB_KEY = *****
NEXT_PUBLIC_SERVER = "http://localhost:3000"
SQL_USER = *****
SQL_PASSWORD = *****
SQL_ADDR = *****
OMDB_KEY = *****
```

Start the server locally and navigate to [NEXT_PUBLIC_SERVER / localhost:port](http://localhost:3000)

```bash
  npm run dev
```

