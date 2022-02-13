import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
export async function middleware(req) {
  //token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET })
  const { pathname } = req.nextUrl
  //allow thhe request if followinh is true..
  //1) its a request for next-auth session & provider fetching
  // 2) the token exists

  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }

  //redirect the to login if they dont have token AND are requsteing a proctected route
  if (!token && pathname !== '/login') {
    return NextResponse.redirect('/login')
  }
}
