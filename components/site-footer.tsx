import Link from "next/link";
import { Linkedin, Facebook, Twitter } from "lucide-react";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t border-emerald-900/20 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20">
                <Image
                  src="/logo/logo.png"
                  alt="GUEST POST UP Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl font-bold text-white">
                GUEST POST UP
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Premium guest posting service connecting you with high-authority
              websites.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-white">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#sites"
                  className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Browse Sites
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-slate-400 hover:text-emerald-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-slate-400 hover:text-emerald-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/guest-post-up"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
                aria-label="Follow us on LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/guestpostup/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
                aria-label="Follow us on Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/guestpostup/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
                aria-label="Follow us on X (Twitter)">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Stay connected for updates and news
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-emerald-900/20 text-center text-sm text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} GUEST POST UP. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
