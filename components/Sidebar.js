import React, { useEffect, useState } from 'react'
import {
  HomeIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
  SearchIcon,
} from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import useSpotify from '../hooks/useSpotify'
import {playlistIdState} from '../atoms/playlistAtom'
import {useRecoilState} from 'recoil'

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession()
  const[playlists,setPlaylists] = useState([])
  const[playlistId,setPlaylistId] = useRecoilState(playlistIdState)

  useEffect(()=>{
    if(spotifyApi.getAccessToken()){
        spotifyApi.getUserPlaylists().then((data)=>{
          setPlaylists(data.body.items)
        });
    }
  },[session,spotifyApi])

  return (
    <div className="hidden md:inline-flex sm:max-w-[12rem] lg:max-w-[15rem] lg:text-sm h-screen overflow-y-scroll scrollbar-hide border-r border-gray-900 p-5 text-xs text-gray-500">
      <div className="space-y-4">
       
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5 text-white" />
          <p>Home</p>
        </button>
        <button className="flex items-center  space-x-2 hover:text-white">
          <SearchIcon className="h-5 w-5 text-purple-400" />
          <p>Search</p>
        </button>
        <button className="flex items-center  space-x-2 hover:text-white">
          <LibraryIcon className="h-5 w-5 text-yellow-500" />
          <p>Your library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900"></hr>

        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5 text-blue-500" />
          <p> Create Playlist</p>
        </button>
        <button className="flex items-center  space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5 text-red-600" />
          <p>Like Songs</p>
        </button>
        <button className="flex items-center  space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5 text-green-500" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900"></hr>
        <h1 className='text-white'>Your Playlists</h1>
        <hr className="border-t-[0.1px] border-gray-900"></hr>
        {playlists.map((playlist)=>(
  
            <p 
              key={playlist.id}
              onClick={()=> setPlaylistId(playlist.id)}
              className="cursor-pointer hover:text-white">
              {playlist.name}
            </p>
          
        ))}
        
      </div>
    </div>
  );
  
};


export default Sidebar
