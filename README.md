[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/k6kO_4Go)

# Moo Kra Ta News

A News Website for people to share their opinion on whether the news is fake or not!.

----

# Guideline
### Commit Message Guidelines
This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

#### **Formats**
##### Default
```
<type>(optional scope): <description>
<optional body>
<optional footer>
``` 

##### Merge Commit
```
Merge branch '<branch name>'
```

##### Revert Commit
```
Revert '<reverted commit name>'
```

##### Types
| Type      | Purpose                                                                 |
|-----------|-------------------------------------------------------------------------|
| `feat`    | Introduces a new feature                                                |
| `fix`     | Fixes a bug                                                             |
| `docs`    | Updates documentation                                                   |
| `style`   | Code style changes (no logic changes)                                   |
| `refactor`| Code restructuring (no behavior change)                                 |
| `test`    | Adds or modifies tests                                                  |
| `chore`   | Maintenance tasks (e.g., CI/CD, dependencies)                           |

##### Scope
The scope provides additional contextual information.
```
feat(api): add api for fetching all user
```
More example of the scope:
- navbar
- login
- cart
- image
- readme

##### Breaking Changes Indicator
Breaking change **MUST** be indicated by an `!` before `:` in this commit name
```
feat(api)!: change api endpoint for adding new product to cart
```
Information about the change **MUST** also be include in commit message footer.

##### Description
`Description` contains a concise description of the change.
- Use imperative, present tense: "change" not "changed" or "changes"
- Don't capitalize the first letter
- No dot (`.`) at the end

##### body
`Body` isn't mandatory but you should include it to explain complex commit or commit that fix bug.
```
fix(api): handle null values in user response

Previously, if a user had missing data, the API would return `null` without default values, causing frontend crashes. Now, we ensure a default structure in the response.
```

##### Footer
The `footer` should contain information about **Breaking Changes**(BREAKING CHANGES: ) you can also place **Reference Issues** that the commit refers to.
```
feat(api)!: change api endpoint for adding new product to cart

BREAKING CHANGES: use cart/add/[productID] instead of the old product/add/[productID]
```
```
fix(config): hide api key in the .env

Closes #69
```