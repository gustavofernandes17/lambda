import { NativeModules } from 'react-native'

export interface LoadAllMusicDirectoryResult {
  filename: string;
  path: string;
  absolutePath: string
}


interface IFileManager {
  downloadMusicFromURL: (url: string, filename: string, titleForManager: string, descriptionForManager: string) => {}
  loadAllMusicsInMusicDirectory: () => Promise<LoadAllMusicDirectoryResult[]>
  getBaseDirectory: () => Promise<string>

  // Não testadas
  changeBaseDownloadDirectory: () => Promise<Boolean>
  deleteMusicFile: (path: string) => Promise<boolean>

  // Not Working
  downloadMusicFromURLUsingFetch: (url: string, path: string) => Promise<boolean> 

  // TODO - Essa (Essas) função(s) ainda não foi(ram) implementada(s)



}

const { FileManagerModule } = NativeModules

const FileManager = FileManagerModule as IFileManager 

export default FileManager as IFileManager