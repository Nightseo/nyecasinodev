import Link from "next/link"
import { MailIcon, PhoneIcon, MapPinIcon, ShieldIcon, TriangleAlertIcon, ExternalLinkIcon } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About & Contact */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-1">CasinoReviews.com</h2>
              <div className="w-12 h-0.5 bg-pink"></div>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              We provide you with updated information about the best online casinos in 2025, focusing on security,
              bonuses, and gaming experience.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <MailIcon className="h-4 w-4 text-pink mr-2" />
                <a href="mailto:contact@casinoreviews.com" className="text-gray-300 hover:text-white transition-colors">
                  contact@casinoreviews.com
                </a>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-4 w-4 text-pink mr-2" />
                <span className="text-gray-300">+1 234 567 890</span>
              </div>
              <div className="flex items-start">
                <MapPinIcon className="h-4 w-4 text-pink mr-2 mt-0.5" />
                <span className="text-gray-300">Las Vegas, USA</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative">
              Quick Links
              <div className="w-12 h-0.5 bg-pink mt-1"></div>
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pages/top-casinos" className="text-gray-300 hover:text-white transition-colors">
                  Top Casinos 2025
                </Link>
              </li>
              <li>
                <Link href="/pages/bonuses" className="text-gray-300 hover:text-white transition-colors">
                  Best Bonuses
                </Link>
              </li>
              <li>
                <Link href="/pages/payment-methods" className="text-gray-300 hover:text-white transition-colors">
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link href="/pages/slots" className="text-gray-300 hover:text-white transition-colors">
                  Slot Games
                </Link>
              </li>
              <li>
                <Link href="/pages/live-casino" className="text-gray-300 hover:text-white transition-colors">
                  Live Casino
                </Link>
              </li>
              <li>
                <Link href="/pages/guides" className="text-gray-300 hover:text-white transition-colors">
                  Casino Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative">
              Legal
              <div className="w-12 h-0.5 bg-pink mt-1"></div>
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pages/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/pages/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/pages/cookies" className="text-gray-300 hover:text-white transition-colors">
                  Cookies Policy
                </Link>
              </li>
              <li>
                <Link href="/pages/responsible-gambling" className="text-gray-300 hover:text-white transition-colors">
                  Responsible Gambling
                </Link>
              </li>
              <li>
                <Link href="/pages/complaints" className="text-gray-300 hover:text-white transition-colors">
                  Complaints
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Responsible Gambling */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative">
              Responsible Gambling
              <div className="w-12 h-0.5 bg-pink mt-1"></div>
            </h3>
            <div className="bg-[#1a2744] rounded-md p-4 border border-[#2a3a5a] text-sm">
              <div className="flex items-center mb-3">
                <ShieldIcon className="h-5 w-5 text-pink mr-2" />
                <h4 className="font-semibold">Play Responsibly</h4>
              </div>
              <p className="text-gray-300 mb-3">
                Gambling can be addictive. Always play responsibly and set limits for time and money.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/pages/helplines"
                  className="inline-flex items-center text-xs bg-[#1e2c4a] hover:bg-[#2a3a5a] px-3 py-1.5 rounded-md transition-colors"
                >
                  <TriangleAlertIcon className="h-3 w-3 mr-1" />
                  Helplines
                </Link>
                <Link
                  href="/pages/self-assessment"
                  className="inline-flex items-center text-xs bg-[#1e2c4a] hover:bg-[#2a3a5a] px-3 py-1.5 rounded-md transition-colors"
                >
                  <ExternalLinkIcon className="h-3 w-3 mr-1" />
                  Self-Assessment
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-[#1a2744] text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} CasinoReviews.com. All rights reserved.</p>
          <p className="mt-1">
            The information on this website is for informational purposes only. Gambling involves risk and should not be
            seen as a solution to financial problems.
          </p>
        </div>
      </div>
    </footer>
  )
}

