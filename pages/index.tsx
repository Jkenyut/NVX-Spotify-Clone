import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import Center from '../components/Center'
import Player from '../components/Player'
import { getSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'


export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-black">
      <Head>
        <title>spotify 2.0</title>
      </Head>

      <main className="flex">
        {/* sidebar */}
        <Sidebar />
        {/* Center */}
        <Center />
      </main>

      {/* player */}
      <div className='sticky bottom-0'>
        <Player/>
      </div>
      
    </div>
  )
}

export async function getServerSideProps(context){
  const session = await getSession(context)
  return{
    props:{
      session,
    }
  }
}