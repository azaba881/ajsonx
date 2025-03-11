import Link from "next/link"
import { CalendarIcon, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  slug: string
}

export default function BlogPage() {
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Getting Started with RESTful APIs",
      excerpt: "Learn the basics of RESTful APIs and how to make your first API call using our service.",
      date: "2025-03-01",
      readTime: "5 min read",
      category: "Tutorials",
      slug: "getting-started-with-restful-apis",
    },
    {
      id: 2,
      title: "Building a React App with Our API",
      excerpt: "A step-by-step guide to integrating our API with a React application for dynamic data.",
      date: "2025-02-15",
      readTime: "8 min read",
      category: "Tutorials",
      slug: "building-react-app-with-our-api",
    },
    {
      id: 3,
      title: "Advanced API Techniques: Pagination and Filtering",
      excerpt: "Take your API usage to the next level with pagination, filtering, and sorting techniques.",
      date: "2025-02-01",
      readTime: "10 min read",
      category: "Advanced",
      slug: "advanced-api-techniques",
    },
  ]

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-3">Our Blog</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Tutorials, guides, and updates about our API service and best practices for developers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Card key={post.id} className="flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{post.category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              <CardTitle className="text-xl">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-3 w-3" />
                {formatDate(post.date)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{post.excerpt}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center text-sm">
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/blog/${post.slug}`}>Read more</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Button variant="outline" size="lg">
          Load More Articles
        </Button>
      </div>
    </div>
  )
}

