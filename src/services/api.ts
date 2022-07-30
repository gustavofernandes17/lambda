import axios, { Axios } from 'axios'


export interface YTSearchResults {
  results:{
    video: {
      id: string;
      title: string;
      url: string; 
      duration: string; 
      snippet: string;
      thumbnail_src: string;
    }, 
    uploader: {
      username: string; 
      url: string; 
      verified: Boolean; 
    },
    channel?: {}
    radio?: {}
    playlist?: {}
  }[]

}

// just a formatedVersion of the YTSearchResults made to fit in the UI
export interface  YTMusicItem {
  id: string; 
  title: string;
  url: string; 
  duration: string; 
  snippet: string;
  thumbnail_src: string;
  username: string; 
}

export interface YTScrapperAPI {
  rawAPI: Axios;
  apiBaseURL: string | undefined;
  search: (query: string) => Promise<YTMusicItem[]> 
}

export const API_DEFAULT_BASE_URL = 'https://youtube-scrape.herokuapp.com/api/search'

export function createYTScrapper(apiBaseURL = API_DEFAULT_BASE_URL): YTScrapperAPI {

  const apiInstance = axios.create({
    baseURL: apiBaseURL
  })

  return {
    rawAPI: apiInstance, 
    apiBaseURL: apiInstance.defaults.baseURL, 
    async search(query) {

      const results = await this.rawAPI.get<YTSearchResults>(`?q=${query}`)

      const filteredResults = results.data.results.filter((result) => !!result.video)
      // console.log(filteredResults)

      const formattedResults = filteredResults.map((result) => {
  
        return {
          id: result.video.id, 
          title: result.video.title,
          url: result.video.url, 
          duration: result.video.duration, 
          snippet: result.video.snippet,
          thumbnail_src: result.video.thumbnail_src,
          username: result.uploader.username, 
        }
      })
      return formattedResults
    }
  }
}