import { NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt";

 
export async function middleware(request) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    // console.log("middleware token", token);
    const url = request.nextUrl.clone();
    if(!token && 
        (
            url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/create-todo') || 
            url.pathname.startsWith('/update-todo'))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
        if(token && (
            url.pathname.startsWith('/login') || 
            url.pathname.startsWith('/signup'))) {
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }



    return NextResponse.next();

}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup','/forgot-password',
'/create-todo', '/update-todo/:id*'
  ],
}