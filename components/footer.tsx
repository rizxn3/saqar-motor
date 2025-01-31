import Link from "next/link"
import { AdminLoginDialog } from "./admin/admin-login-dialog"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">About Us</h3>
            <p className="text-sm text-muted-foreground">
              AutoParts B2B is your trusted platform for high-quality automobile parts,
              connecting manufacturers and wholesalers worldwide.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/engine-parts" className="text-muted-foreground hover:text-foreground">
                  Engine Parts
                </Link>
              </li>
              <li>
                <Link href="/category/brake-system" className="text-muted-foreground hover:text-foreground">
                  Brake System
                </Link>
              </li>
              <li>
                <Link href="/category/transmission" className="text-muted-foreground hover:text-foreground">
                  Transmission
                </Link>
              </li>
              <li>
                <Link href="/category/electrical" className="text-muted-foreground hover:text-foreground">
                  Electrical
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: info@autoparts-b2b.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Auto Street, Parts City, PC 12345</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AutoParts B2B. All rights reserved.
          </p>
          <div className="mt-2">
            <AdminLoginDialog />
          </div>
        </div>
      </div>
    </footer>
  )
} 