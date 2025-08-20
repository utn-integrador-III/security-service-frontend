# Git Workflow - Security Service Frontend

## Branch Strategy

### Main Branches
- `main` - Production-ready code
- `Aaron-dev` - Development branch for Aaron's features

### Feature Branches
Create feature branches from `Aaron-dev` for each endpoint integration:
- `feature/auth-endpoints`
- `feature/roles-endpoints`
- `feature/users-endpoints`
- `feature/screens-endpoints`
- etc.

## Development Workflow

### 1. Starting a New Feature
```bash
# Ensure you're on Aaron-dev branch
git checkout Aaron-dev
git pull origin Aaron-dev

# Create feature branch
git checkout -b feature/[endpoint-name]-endpoints

# Example:
git checkout -b feature/auth-endpoints
```

### 2. Development Process
```bash
# Make your changes
# Test your code
# Commit with conventional commits
git add .
git commit -m "feat: add authentication endpoints integration"
git commit -m "fix: resolve CORS issues in auth service"
git commit -m "docs: update API integration documentation"
```

### 3. Conventional Commits Format
```
type(scope): description

Types:
- feat: new feature
- fix: bug fix
- docs: documentation changes
- style: formatting, missing semicolons, etc.
- refactor: code refactoring
- test: adding tests
- chore: maintenance tasks
```

### 4. Pushing Feature Branch
```bash
git push -u origin feature/[endpoint-name]-endpoints
```

### 5. Creating Pull Request
1. Go to GitHub repository
2. Click "Compare & pull request"
3. Set base branch: `Aaron-dev`
4. Set compare branch: `feature/[endpoint-name]-endpoints`
5. Add description:
   ```
   ## Changes
   - Added authentication endpoints integration
   - Implemented login/logout functionality
   - Added token management
   
   ## Testing
   - [ ] Tested login flow
   - [ ] Tested token refresh
   - [ ] Tested logout functionality
   
   ## API Endpoints Added
   - POST /auth/login
   - POST /auth/refresh
   - POST /auth/verify_auth
   - PUT /auth/logout
   ```

### 6. After PR Approval
```bash
# Merge PR on GitHub
# Delete feature branch on GitHub
# Update local Aaron-dev
git checkout Aaron-dev
git pull origin Aaron-dev
```

## Current Endpoints Integration Status

### ✅ Completed
- [x] Authentication endpoints (login, logout, verify, refresh)
- [x] Roles endpoints (GET /rol)
- [x] Basic API configuration
- [x] Error handling

### 🔄 In Progress
- [ ] Users endpoints
- [ ] Apps endpoints
- [ ] Admin endpoints
- [ ] Screen assignments

### 📋 Planned
- [ ] User enrollment
- [ ] Password management
- [ ] User verification
- [ ] Health check integration

## File Structure for Endpoints

```
src/
├── config/
│   └── api.ts                    # API configuration
├── services/
│   ├── authService.ts           # Authentication endpoints
│   ├── roleService.ts           # Roles endpoints
│   ├── userService.ts           # Users endpoints (planned)
│   ├── appService.ts            # Apps endpoints (planned)
│   └── adminService.ts          # Admin endpoints (planned)
├── pages/
│   ├── Roles.tsx                # Roles management UI
│   ├── screensPost.tsx          # Screen assignments UI
│   └── [other-pages].tsx        # Other UI components
└── components/
    └── [reusable-components]    # Reusable UI components
```

## API Integration Checklist

For each endpoint integration:

- [ ] Create service file (`src/services/[name]Service.ts`)
- [ ] Define TypeScript interfaces
- [ ] Implement CRUD operations
- [ ] Add error handling
- [ ] Add authentication headers
- [ ] Create/update UI components
- [ ] Add loading states
- [ ] Add error states
- [ ] Test with real API
- [ ] Update documentation
- [ ] Create feature branch
- [ ] Commit changes
- [ ] Create PR
- [ ] Get approval
- [ ] Merge to Aaron-dev

## Useful Commands

```bash
# Check current branch
git branch

# See commit history
git log --oneline

# See changes in working directory
git diff

# Stash changes temporarily
git stash
git stash pop

# Reset to last commit
git reset --hard HEAD

# See remote branches
git branch -r
```

## Next Steps

1. **Complete current endpoints**: Finish roles and screens integration
2. **Add user management**: Implement user enrollment and management
3. **Add app management**: Implement app creation and management
4. **Add admin features**: Implement admin-specific functionality
5. **Testing**: Add comprehensive testing for all endpoints
6. **Documentation**: Complete API integration documentation
