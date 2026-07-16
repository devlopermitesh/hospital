import NextAuth from 'next-auth/next'
import { Authoptions } from './option'
const handler = NextAuth(Authoptions)
export { handler as GET, handler as POST }