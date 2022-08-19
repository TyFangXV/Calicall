// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  //get the token 
  const token = request.headers.get('authorization');
    //if token is not found return error
    if(!token) {
        return {
            statusCode: 401,
            headers: {
                'WWW-Authenticate': 'Bearer'
            },
            body: JSON.stringify({
                error: 'Missing authorization token'
            })
        }
    }
    //if token is found return the request
    return request;
}


