import {ChevronDoubleDownIcon} from '@heroicons/react/outline'
import {signOut, useSession} from 'next-auth/react'
import React, {useEffect, useState} from 'react'
import {shuffle} from 'lodash'
import Songs from './Songs'
import {playlistIdState, playlistState} from '../atoms/playlistAtom'
import {useRecoilState, useRecoilValue} from 'recoil'
import useSpotify from '../hooks/useSpotify';

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-red-500",
    "from-yellow-500",
    "from-green-500",
    "from-purple-500",
];

function Center() {
    const {data: session} = useSession()
    const spotifyApi = useSpotify()
    const [color, setcolor] = useState(null)
    const playlistId = useRecoilValue(playlistIdState)
    const [playlist, setplaylist] = useRecoilState(playlistState)

    useEffect(() => {
        setcolor(shuffle(colors).pop());
    }, [playlistId]);

    useEffect(() => {
        spotifyApi.getPlaylist(playlistId).then((data) => {
            setplaylist(data.body)
        }).catch((err) => console.log('something went wrong', err))
    }, [spotifyApi, playlistId])
    return (
        <div className=" flex-grow h-screen overflow-y-scroll scrollbar-hide">

            <header className='absolute top-5 right-8'>

                <div
                    className='bg-black flex items-center space-x-3 opacity-90 hover:opacity-70 cursor-pointer rounded-full p-1 pr-2 text-white'
                    onClick={signOut}>
                    <img className='rounded-full w-10 h-10' src={session?.user.image} alt=''/>
                    <h2 className='text-white'>{session?.user.name}</h2>
                    <ChevronDoubleDownIcon className='h-5 w-5 text-white'/>
                    <p>Logout</p>

                </div>
            </header>
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8 `}>
                {/* img */}
                <img className=' h-44 w-44 shadow-2xl' src={playlist?.images[0]?.url} alt=''/>
                <div>
                    <p>PLAYLIST</p>
                    <h1 className='text-2xl md:text-3xl xl:text-5xl'>{playlist?.name}</h1>
                </div>
            </section>
            <div>
                <Songs/>
            </div>
        </div>
    )
}

export default Center
