import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-emerald-900/20 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500">
                <span className="text-lg font-bold text-white">P</span>
              </div>
              <span className="text-xl font-bold text-white">PostUp</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Premium guest posting service connecting you with high-authority websites.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-white">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#sites" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Browse Sites
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-emerald-900/20 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} PostUp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
