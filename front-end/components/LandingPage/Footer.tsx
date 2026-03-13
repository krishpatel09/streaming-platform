import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#0f1014] border-t border-white/10 px-8 md:px-16 py-12 text-gray-400">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Press
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4">View Website in</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                English
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Hindi
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4">Social</h3>
          <div className="flex gap-4">
            {/* Social icons could go here */}
            <span className="text-sm">Twitter</span>
            <span className="text-sm">Facebook</span>
            <span className="text-sm">Instagram</span>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs">
        <p>© 2026 STREAMVERSE. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
