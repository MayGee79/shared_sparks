# Changelog

All notable changes to Shared Sparks will be documented in this file.

## [Unreleased]

### Added
- Knowledge documentation structure in docs/knowledge
- README.md for knowledge documentation with guidelines
- GitHub OAuth authentication setup
- Environment variables configuration (.env.local)
- Security: Added .env.local to .gitignore
- Security: Protected OAuth client secrets
- Security: Implemented secure callback URLs
- Security: Added NEXTAUTH_SECRET for session encryption
- AuthProvider component for client-side auth handling
- Proper server/client component separation
- Working GitHub sign-in functionality
- Google OAuth authentication setup
- Multi-provider authentication support
- Account linking between GitHub and Google
- Extended session handling with proper TypeScript types
- Custom error and sign-in pages
- Debug mode for authentication flow
- Database schema documentation in docs/knowledge/database

### Fixed
- UserType enum inconsistencies in changes.log
- Documentation for UserType enum values
- Tailwind CSS configuration issues
- Header image responsiveness
- Favicon implementation
- Button hover states
- Security: Protected sensitive environment variables

## [1.0.0] - 2024-03-19

### Added
- Initial project setup with Next.js
- Custom logo and header design
- Responsive navigation
- Hero section with main messaging
- Search Solutions and Showcase Solutions buttons
- Community section
- Footer with social links
- Tailwind CSS integration
- Custom color scheme implementation
- Responsive design for all screen sizes

### Changed
- Updated button styles with hover effects
- Enhanced header image sizing
- Improved navigation layout
- Styled Sign In and Register buttons
- Updated About Us link to mAIven website
