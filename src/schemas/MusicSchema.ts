
export interface MusicSchemaProperties {
  id: string
  url: string 
  isLocal: boolean
  title: string
  duration: number
  cid: string
  artwork: string
  artist: string
  description: string
  filename: string
  ytStreamingUrl: string
} 

export const MusicSchema =  {
  name: 'Music',
  primaryKey: 'id', 
  properties: {
    id: 'string',
    url: 'string', 
    isLocal: 'bool', 
    title: 'string',
    duration: 'int', 
    cid: 'string',
    artwork: 'string',
    artist: 'string',
    description: 'string',
    filename: 'string' ,
    ytStreamingUrl: 'string',
  }
}