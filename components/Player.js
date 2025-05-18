import {
    FastForwardIcon,
    PauseIcon,
    PlayIcon,
    ReplyIcon,
    RewindIcon,
    SwitchHorizontalIcon,
    VolumeOffIcon,
    VolumeUpIcon
} from '@heroicons/react/outline'
import {useSession} from 'next-auth/react'
import React, {useCallback, useEffect, useState} from 'react'
import {useRecoilState} from 'recoil'
import {currentTrackIdState, isPlayingState} from '../atoms/songAtom'
import useSpotify from '../hooks/useSpotify'
import useSongInfo from './useSongInfo'
import {debounce} from 'lodash'

function Player() {
    const spotifyApi = useSpotify()
    const {data: session, status} = useSession()
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isplaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [volume, setVolume] = useState(50)

    const songInfo = useSongInfo()

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrenPlayTrack().then((data) => {
                setCurrentTrackId(data.body?.item?.id)
                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing)
                })
            })
        }
    }
    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong;
            setVolume(50)
        }
    }, [currentTrackId, spotifyApi, session])

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if (data.body.is_playing) {
                spotifyApi.pause()
                setIsPlaying(false)
            } else {
                spotifyApi.play();
                setIsPlaying(true)
            }
        })
    }


    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debounceadJustvolume(volume)
        }
    }, [volume])

    const debounceadJustvolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => {
            })
        }, 500), []
    )
    return (
        <div
            className='h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-sm md:text-base px-2 md:px-8'>
            {/*left*/}
            <div className='flex items-center space-x-4'>
                <img alt={"songinfo"} className='hidden md:inline h-10 w-10' src={songInfo?.album.images?.[0]?.url}
                />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>

            {/* Center */}
            <div className='flex items-center justify-evenly'>
                <SwitchHorizontalIcon className='button'/>
                <RewindIcon className='button'/>
                {isplaying ? (
                    <PauseIcon className='button w-10 h-10' onClick={handlePlayPause}/>
                ) : (<PlayIcon className='button w-10 h-10' onClick={handlePlayPause}/>)
                }


                <FastForwardIcon className='button'/>
                <ReplyIcon className='button'/>
            </div>

            <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
                <VolumeOffIcon className='button' onClick={() => volume > 0 && setVolume(volume - 10)}/>
                <input className='w-14 md:w-28' type="range" value={volume} min={0} max={100}
                       onChange={(e) => setVolume(Number(e.target.value))}/>
                <VolumeUpIcon onClick={() => volume < 100 && setVolume(volume + 10)} className='button'/>
            </div>
        </div>
    )
}

export default Player