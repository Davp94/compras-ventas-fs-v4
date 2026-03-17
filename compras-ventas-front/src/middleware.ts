import { NextResponse, NextRequest } from 'next/server'
 
const publicRoutes = ['/login', '/not-found']
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;  
  if(publicRoutes.some((route)=>pathname.startsWith(route))){
    return NextResponse.next();
  }
  const token = request.cookies.get('token')?.value;
  if(!token){
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
 
export const config = {
  matcher:  '/((?!api|_next/static|_next/image|favicon.ico).*)',
}