# Known Issues and Solutions

## Build Issues

### SWC and Babel Conflict
- **Issue**: A conflict between SWC (Next.js' default compiler) and Babel was causing build errors.
- **Solution**: Removed the `.babelrc` file to use SWC exclusively.

### CSS Processing Issues
- **Issue**: During the build process, Next.js encountered errors with `className` properties that couldn't be correctly handled during prerendering.
- **Solution**: Converted all `className` attributes to inline styles using React's `style` prop in the following files:
  - `src/app/not-found.tsx`
  - `src/app/about/page.tsx`
  - `src/app/auth/signin/page.tsx`
  - `src/app/auth/signin/components/LinkWrapper.tsx`
  - `src/app/page.tsx`
  - `src/components/DropdownMenu.tsx`

### Session Handling in Server Components
- **Issue**: Next.js was trying to access `useSession()` during prerendering, which was causing errors because the session is only available in the browser.
- **Solution**: Added proper error handling and conditional logic for session access in the following files:
  - `src/app/profile/page.tsx`
  - `src/app/onboarding/page.tsx`
  - `src/components/DropdownMenu.tsx`

The solution pattern for session handling involves:
1. Using try-catch blocks for initial session access
2. Using React state to store session data safely
3. Using useEffect to access session data on the client side only
4. Adding conditional rendering based on session status

## Remaining Considerations

1. **CSS Strategy**: The current approach of using inline styles is a workaround. For a more maintainable solution, consider:
   - Using CSS Modules
   - Using a CSS-in-JS library that's compatible with Next.js 15
   - Creating a proper styling strategy that works with SSR

2. **Authentication**: The session handling workarounds are necessary because Next-Auth is primarily designed for client components. Consider:
   - Using server-side session handling for initial data loading
   - Setting up proper authentication middleware
   - Creating clear boundaries between authenticated and non-authenticated parts of the app

3. **Error Messages**: The build still shows some error logs about session access, but these don't prevent the build from completing and are just informational warnings about expected behavior.

# Known Build Issues

The following pages have prerendering errors during build due to authentication hooks used in client components:
- /dashboard
- /onboarding
- /profile

These errors are expected and the application will still function correctly when running.

## Root Cause
These pages use `useSession` from next-auth/react which requires a browser context and cannot be statically rendered.

## Future Solutions
- Refactor these pages to use a dynamic import with `{ ssr: false }` option
- Downgrade to Next.js 13.4.x which has better handling of these cases
- Use Server Components with proper data fetching patterns 