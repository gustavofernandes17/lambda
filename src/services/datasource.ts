import { Track } from "react-native-track-player";
import Realm from "realm";
import FileManager from "../native_modules/FileManager";
import { ConfigurationSchema, configurationSchemaProperties } from "../schemas/Configuration";
import { MusicSchema, MusicSchemaProperties } from "../schemas/MusicSchema";
import { API_DEFAULT_BASE_URL } from "./api";

export interface Music extends Track {
  id: string;
}


export class Datasource {

  defaultArtworkImageURL = 'https://images.unsplash.com/photo-1575931953324-fcac7094999e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'

 
  async connectToDatabase() {
    console.log('[datasource] Connecting to local database...')
  
    try {
      const database = await Realm.open({
        schema: [
          MusicSchema,
          ConfigurationSchema,
        ],
        onFirstOpen: async (realm) => {

          console.log('[datasource] Loading configuration for the first time (setting up default config)')
          const defaultConfiguration: configurationSchemaProperties = {
            download_directory_path: await FileManager.getBaseDirectory(),
            web3proxy_api_base_url: 'DO NOT CONFIGURED', 
            yt_api_base_url: API_DEFAULT_BASE_URL,
            id: 'MAIN'
          }

          console.log('[datasource] Config being loaded' + defaultConfiguration)

          realm.write(() => {
            realm.create('Configuration', defaultConfiguration); 
          })

          
        }
      })
  
      console.log('[datasource] Successfuly connected to database')
  
  
      return database
  
    } catch(err) {
      console.log('[datasource] Error while connecting to database')
      console.log(err)
    }
  
  }

  async getAllMusics() {
    const realm = await this.connectToDatabase(); 

    const musics = realm?.objects<MusicSchemaProperties>('Music');

    console.log(musics)

    return musics
  }

  async save(music: MusicSchemaProperties) {
    const connection = await this.connectToDatabase();

    connection?.write(() => {
      connection?.create<MusicSchemaProperties>('Music', music, 'modified');
    })
  }

  async loadApplicationSettings() {

    const connection = await this.connectToDatabase();

    const ConfigurationObject = connection?.objects<configurationSchemaProperties>('Configuration')[0]

    console.log('[datasource] Config: ' + ConfigurationObject)

    return ConfigurationObject;

  }


  async getAllMusicsInTrackPlayerFormat() {
    const musics = await this.getAllMusics()
     
    const convertedList: Music[] = []
    
    musics?.forEach((item) => {
      convertedList.push({
        id: item.id, 
        url: item.url,
        artist: item.artist,
        artwork: item.artwork,
        duration: item.duration,
        title: item.title, 
        description: item.description
      });
    })

    return convertedList;
  }

  // Ta dando pau isso daqui arruma pa nois depois ;)

  // async getMusicById(id: string) {
  //   const database = await this.connectToDatabase(); 
  //   const musics = database?.objects<MusicSchemaProperties>('Music')
  //   const music = musics?.filtered(`id = ${id}`);

  //   if (music) {
  //     return music[0]; 
  //   }
  // }

  async getMusicByFilename(filename: string) {
    const musics = await this.getAllMusics(); 

    const music = musics?.filtered(`filename = ${filename}`)

    return music
  }

  // Use This when switching from local to Web3 Streaming
  // async syncLocalLibraryWithRealmDB() {
    
  //   const localMusicLibrary = await FileManager.loadAllMusicsInMusicDirectory(); 

  //   const databaseMusicLibrary = await this.getAllMusics();

  //   databaseMusicLibrary?.forEach((music) => {

  //   })

  // }

  // Careful this can sometimes lead to loss of metadata
  async loadAllLocalFilesToDatabase() {

    const localMusicLibrary = await FileManager.loadAllMusicsInMusicDirectory(); 
    const database = await this.connectToDatabase(); 

    database?.write(() => {
      localMusicLibrary.forEach((music) => {

        const id = music.filename.split('-')[1]; 

        database.create('Music', {
          id, 
          filename: music.filename, 
          artist: 'Unknown', 
          artwork: this.defaultArtworkImageURL, 
          cid: '',
          description: '', 
          duration: 0, 
          isLocal: true, 
          title: music.filename, 
          url: `file://${music.path}`
        }, 
        "modified"
        )
      })
    })
  }

}

