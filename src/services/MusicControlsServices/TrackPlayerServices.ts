import TrackPlayer, { Capability, RepeatMode } from "react-native-track-player";
import { Music } from "../datasource";

// If music Player are not initialized it will initialize it
async function initializeMusicPlayer(): Promise<boolean> {
  try { 
    // if the Track Player is not initialized it will throw an error
    await TrackPlayer.getQueue()
    return true 

  } catch(err) {
    // initialize it 
    console.log('[TrackPlayerService] - Player not yet initialized. initializing it...')

    // setup player
    await TrackPlayer.setupPlayer();

    // configure all capabilities
    TrackPlayer.updateOptions({
      capabilities: [
        Capability.Pause,
        Capability.Play,
        Capability.PlayFromSearch,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
        Capability.Stop
      ]
    })

    console.log('[TrackPlayerService] - Player initialized')
    
    return true
  }
}

async function initilizeMusicQueue(musicLibrary: Music[] | undefined) {

  if (!musicLibrary) return; 

  console.log('[TrackPlayerService] - Initializing Queue...')
  await TrackPlayer.add(musicLibrary)
  await TrackPlayer.setRepeatMode(RepeatMode.Queue)
  console.log('[TrackPlayerService] - Finished Initializing Queue')

}


export default {
  initializeMusicPlayer,
  initilizeMusicQueue
}