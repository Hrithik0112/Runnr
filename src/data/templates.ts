import { Workflow } from '../types/workflow'

export interface Template {
  id: string
  name: string
  description: string
  category: string
  workflow: Workflow
}

export const templates: Template[] = [
  {
    id: 'node-ci',
    name: 'Node.js CI',
    description: 'Build and test a Node.js application',
    category: 'CI',
    workflow: {
      name: 'Node.js CI',
      on: {
        push: {
          branches: ['main', 'develop']
        },
        pull_request: {
          branches: ['main']
        }
      },
      jobs: {
        build: {
          id: 'build',
          name: 'Build and Test',
          'runs-on': 'ubuntu-latest',
          steps: [
            {
              id: 'checkout',
              uses: 'actions/checkout@v4'
            },
            {
              id: 'setup-node',
              name: 'Setup Node.js',
              uses: 'actions/setup-node@v4',
              with: {
                'node-version': '20'
              }
            },
            {
              id: 'install',
              name: 'Install dependencies',
              run: 'npm ci'
            },
            {
              id: 'test',
              name: 'Run tests',
              run: 'npm test'
            }
          ]
        }
      }
    }
  },
  {
    id: 'python-ci',
    name: 'Python CI',
    description: 'Build and test a Python application',
    category: 'CI',
    workflow: {
      name: 'Python CI',
      on: {
        push: {
          branches: ['main']
        },
        pull_request: {
          branches: ['main']
        }
      },
      jobs: {
        test: {
          id: 'test',
          name: 'Test',
          'runs-on': 'ubuntu-latest',
          steps: [
            {
              id: 'checkout',
              uses: 'actions/checkout@v4'
            },
            {
              id: 'setup-python',
              name: 'Setup Python',
              uses: 'actions/setup-python@v4',
              with: {
                'python-version': '3.11'
              }
            },
            {
              id: 'install',
              name: 'Install dependencies',
              run: 'pip install -r requirements.txt'
            },
            {
              id: 'test',
              name: 'Run tests',
              run: 'pytest'
            }
          ]
        }
      }
    }
  },
  {
    id: 'docker-build',
    name: 'Docker Build',
    description: 'Build and push a Docker image',
    category: 'Deploy',
    workflow: {
      name: 'Docker Build',
      on: {
        push: {
          branches: ['main'],
          tags: ['v*']
        }
      },
      jobs: {
        build: {
          id: 'build',
          name: 'Build and Push',
          'runs-on': 'ubuntu-latest',
          steps: [
            {
              id: 'checkout',
              uses: 'actions/checkout@v4'
            },
            {
              id: 'setup-buildx',
              name: 'Set up Docker Buildx',
              uses: 'docker/setup-buildx-action@v3'
            },
            {
              id: 'login',
              name: 'Login to Docker Hub',
              uses: 'docker/login-action@v3',
              with: {
                username: '${{ secrets.DOCKER_USERNAME }}',
                password: '${{ secrets.DOCKER_PASSWORD }}'
              }
            },
            {
              id: 'build-push',
              name: 'Build and push',
              uses: 'docker/build-push-action@v5',
              with: {
                context: '.',
                push: 'true',
                tags: 'user/app:latest'
              }
            }
          ]
        }
      }
    }
  },
  {
    id: 'node-build-deploy',
    name: 'Node.js Build & Deploy',
    description: 'Build, test, and deploy a Node.js application',
    category: 'CI/CD',
    workflow: {
      name: 'Node.js Build & Deploy',
      on: {
        push: {
          branches: ['main']
        }
      },
      jobs: {
        build: {
          id: 'build',
          name: 'Build and Test',
          'runs-on': 'ubuntu-latest',
          steps: [
            {
              id: 'checkout',
              uses: 'actions/checkout@v4'
            },
            {
              id: 'setup-node',
              name: 'Setup Node.js',
              uses: 'actions/setup-node@v4',
              with: {
                'node-version': '20'
              }
            },
            {
              id: 'install',
              name: 'Install dependencies',
              run: 'npm ci'
            },
            {
              id: 'test',
              name: 'Run tests',
              run: 'npm test'
            },
            {
              id: 'build',
              name: 'Build',
              run: 'npm run build'
            }
          ]
        },
        deploy: {
          id: 'deploy',
          name: 'Deploy',
          'runs-on': 'ubuntu-latest',
          needs: ['build'],
          steps: [
            {
              id: 'checkout',
              uses: 'actions/checkout@v4'
            },
            {
              id: 'deploy',
              name: 'Deploy to production',
              run: 'echo "Deploying..."'
            }
          ]
        }
      }
    }
  }
]

export function getTemplateById(id: string): Template | undefined {
  return templates.find(t => t.id === id)
}

export function getTemplatesByCategory(category: string): Template[] {
  return templates.filter(t => t.category === category)
}

export function getAllCategories(): string[] {
  return Array.from(new Set(templates.map(t => t.category)))
}

