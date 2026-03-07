# Branching Strategy (Git Flow)

To maintain a clean and organized codebase, we follow the **Git Flow** branching strategy:

- **Main**: Production-ready code. This branch contains the latest stable version of the project.
- **Develop**: Integration branch. All new features and bug fixes are merged here before release.
- **feature**: Used for developing new features. Branch naming: `feature/feature-name`.
- **Bugfix**: Used for fixing bugs. Branch naming: `bugfix/bug-name`.
- **Release**: Preparation for a new production release. Branch naming: `release/v1.0.0`.
- **hotfix**: Urgent production fixes. Branch naming: `hotfix/patch-name`.

# PR Process (Pull Request)

Please follow these steps when contributing:

1. **Create feature branch from develop**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```
2. **Make commits and push**:
   - Write clear, descriptive commit messages.
   - Push your branch to the remote repository.
   ```bash
   git push origin feature/your-feature-name
   ```
3. **Open PR with template**:
   - Create a Pull Request (PR) from your feature branch into `develop`.
   - Use the provided PR template to describe your changes.
4. **Code review by team member**:
   - At least one team member must review and approve the PR.
   - Address any feedback provided during the review.
5. **Merge when approved**:
   - Once approved and tests pass, the PR can be merged into `develop`.
6. **Delete branch after merge**:
   - Clean up by deleting the feature branch locally and remotely.
