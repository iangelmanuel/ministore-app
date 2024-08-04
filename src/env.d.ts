/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />

interface User {
  email: string
  name: string
}

declare namespace App {
  interface Locals {
    isLoggedIn: boolean
    isAdmin: boolean
    user: User | null
  }
}
