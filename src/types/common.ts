export type TmdbCategory = 'now_playing' | 'popular' | 'top_rated' | 'upcoming'

export type ExploreApiReqData = {
    category: TmdbCategory
    page: number
}

export type TmdbMovie = {
    adult: boolean
    backdrop_path: string
    genre_ids: Array<number>
    id: number
    original_language: string
    original_title: string
    overview: string
    popularity: number
    poster_path: string
    release_date: string
    title: string
    video: boolean
    vote_average: number
    vote_count: number
    likes: number
}

export type ExploreApiRespData = {
    page: number
    results: Array<TmdbMovie>
    total_pages: number
    total_results: number
}

export type OmdbMovie = {
    Title: string
    Year: string
    imdbID: string
    Type: 'movie'
    Poster: string
    Plot: string
}
