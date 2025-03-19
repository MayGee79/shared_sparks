'use client'

import { Button } from "@/components/ui/button"
import { UserButton } from "./UserButton"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { MainNav } from "./MainNav"
import { ModeToggle } from "./ModeToggle"
import {
  Search,
} from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center">
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/search">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>
          {session ? (
            <>
              <ModeToggle />
              <UserButton
                user={{
                  name: session.user?.name || "User",
                  image: session.user?.image,
                  email: session.user?.email || "",
                }}
              />
            </>
          ) : (
            <>
              <ModeToggle />
              <Link href="/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
} 