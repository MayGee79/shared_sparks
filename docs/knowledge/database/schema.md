# Database Schema

## Overview
This document details the database schema for Shared Sparks, focusing on data models and their relationships.

## Models

### User
The User model represents platform users with different roles and permissions.

#### UserType Enum
The UserType enum defines the different types of users in the system:
- `PROBLEM_SUBMITTER`: Users who submit problems for solutions
- `DEVELOPER`: Users who develop solutions or contribute technical expertise
- `ADMIN`: Users with administrative privileges

```typescript
enum UserType {
  PROBLEM_SUBMITTER
  DEVELOPER
  ADMIN
}
```

#### User Fields
- `id`: Unique identifier (String)
- `email`: User email address (String, unique)
- `userType`: User role (UserType enum)
- `emailVerified`: Timestamp of email verification (DateTime)
- `hashedPassword`: Encrypted password (String)
- `image`: Profile image URL (String)
- `firstName` & `lastName`: User name components (String)
- `username`: Username for display (String, unique)
- `bio`: User biography (String)
- And other profile fields...

### Problem
Represents issues submitted by users seeking solutions.

#### ProblemStatus Enum
```typescript
enum ProblemStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
}
```

#### Problem Fields
- `id`: Unique identifier (String)
- `title`: Problem title (String)
- `description`: Detailed problem description (String)
- `category` & `industry`: Classification fields (String)
- `status`: Current state (ProblemStatus enum)
- `voteCount`: Number of votes (Int)
- `submitterId`: Reference to submitting user (String)
- `createdAt` & `updatedAt`: Timestamps (DateTime)

### SaaS
Represents software-as-a-service solutions listed on the platform.

#### SaaS Fields
- `id`: Unique identifier (String)
- `name`: SaaS product name (String)
- `description`: Product description (String)
- `website`: Product website URL (String)
- `logo`: Logo image URL (String)
- `category`: Product category (String)
- `tags`: Array of tags (String[])
- And other metadata fields...

## Relationships
- Users can submit multiple Problems (one-to-many)
- Users can review multiple SaaS products (one-to-many)
- Users can favorite multiple SaaS products (many-to-many)
- Problems can have multiple Comments (one-to-many)

## Authentication
User authentication is managed through NextAuth with the following related models:
- `Account`: External auth provider accounts
- `Session`: User sessions
- `VerificationToken`: Email verification tokens

Last Updated: 2025-03-20 