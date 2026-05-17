import { type Article } from './article'
import { type Comment } from './comment'
import { type AdminUser } from './user'
import { type Visitor } from './visitor'

// Helper to generate users
const generateUsers = (count: number): AdminUser[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    username: `user_${i + 1}`,
    email: `user${i + 1}@example.com`,
    bio: `Bio for user ${i + 1}. They love RealWorld apps!`,
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + 1}`,
    role: i === 0 ? 'Admin' : 'User',
  }))
}

// Helper to generate articles
const generateArticles = (count: number, users: AdminUser[]): Article[] => {
  return Array.from({ length: count }, (_, i) => {
    const author = users[i % users.length]
    return {
      id: i + 1,
      slug: `article-slug-${i + 1}`,
      title: `Article Title ${i + 1}`,
      description: `This is a beautiful description for article ${i + 1}.`,
      body: `This is the body of article ${i + 1}. It contains lots of interesting information!`,
      tagList: ['tag1', 'tag2', 'mock'],
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - i * 3600000).toISOString(),
      favorited: i % 3 === 0,
      favoritesCount: i * 5,
      author: author,
    }
  })
}

// Helper to generate comments
const generateComments = (count: number, users: AdminUser[]): Comment[] => {
  return Array.from({ length: count }, (_, i) => {
    const author = users[i % users.length]
    return {
      id: i + 1,
      body: `This is a comment number ${i + 1}. It is very insightful!`,
      createdAt: new Date(Date.now() - i * 1800000).toISOString(),
      articleSlug: `article-slug-${(i % 10) + 1}`,
      authorUsername: author.username,
    }
  })
}

// Helper to generate visitors
const generateVisitors = (count: number): Visitor[] => {
  return Array.from({ length: count }, (_, i) => {
    return {
      id: i + 1,
      ip: `192.168.1.${i + 1}`,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      path: i % 2 === 0 ? '/api/articles' : '/api/users/login',
      timestamp: new Date(Date.now() - i * 900000).toISOString(),
    }
  })
}

export const mockUsers = generateUsers(50)
export const mockArticles = generateArticles(50, mockUsers)
export const mockComments = generateComments(50, mockUsers)
export const mockVisitors = generateVisitors(60)
