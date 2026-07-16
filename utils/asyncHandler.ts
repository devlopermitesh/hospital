import { NextRequest, NextResponse } from 'next/server'

type RouteContext<T extends Record<string, string> = Record<string, string>> = {
  params: Promise<T>
}

type AsyncRouteHandler<T extends Record<string, string> = Record<string, string>> = (
  req: NextRequest,
  context?: { params: T }
) => Promise<NextResponse>

export const asyncHandler = <T extends Record<string, string> = Record<string, string>>(
  fn: AsyncRouteHandler<T>
) => {
  return async (req: NextRequest, context: RouteContext<T>): Promise<NextResponse> => {
    try {
      const params = await context.params
      return await fn(req, { params })
    } catch (error) {
      console.error('Route handler error:', error)

 
      return NextResponse.json(
        {
          success: false,
          error: 'An unexpected error occurred',
        },
        { status: 500 }
      )
    }
  }
}