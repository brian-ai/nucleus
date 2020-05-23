import logger from 'hoopa-logger'
// Capabilities
import Speak from '@brian-ai/brain/communication'
// Methods
import startDay from './start-day'
// Helpers
import Scheduler from '../helpers'

export default async (
  cronTime = '30 5 * * 1-5',
  jobName,
  { player, instance }
) => {
  // Scheduler(cronTime, jobName, async () => {
    /*
     * Runs every week days
     * at 5:30:00 AM.
     */
    const playlists = await player.findPlaylists('Jazz', instance)
    const playlistNumber = Math.floor(Math.random() * (playlists.length - 1))

    player.controls.setVoiceVolume(50, instance)

    await startDay()

    player.controls.startPlaylist(playlists[playlistNumber], instance)
    
  //   return Speak(
  //       `
  //       <break time="1s"/>Now playing ${playlists[playlistNumber].name}
  //       from spotify! <emphasis level="reduced">enjoy!</emphasis>
  //       <break time="1s"/>
  //     `,
  //       { player, instance }
  //     )
  //     .then(() =>
  //       player.controls.startPlaylist(playlists[playlistNumber], instance)
  //     )
  //     .catch(err => logger.error(err))
  // })
}
