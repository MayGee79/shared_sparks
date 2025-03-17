import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-[var(--primary)] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Column 1: Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--accent)]">Navigation</h3>
            <ul className="space-y-2">
              {[
                { name: 'Register', href: '/auth/register' },
                { name: 'Log In', href: '/auth/login' },
                { name: 'About Us', href: '/about' },
                { name: 'FAQs', href: '/faqs' },
                { name: 'Blog / Insights', href: '/blog' }
              ].map(({ name, href }) => (
                <motion.li
                  key={name}
                  whileHover={{ x: 3 }}
                >
                  <a href={href} className="text-sm text-white/70 hover:text-white">
                    {name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
          
          {/* Column 2: Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--accent)]">Legal</h3>
            <ul className="space-y-2">
              {[
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Cookie Policy', href: '/cookies' }
              ].map(({ name, href }) => (
                <motion.li
                  key={name}
                  whileHover={{ x: 3 }}
                >
                  <a href={href} className="text-sm text-white/70 hover:text-white">
                    {name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: Follow Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--accent)]">Follow Us</h3>
            <ul className="space-y-2">
              {[
                { name: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
                { name: 'Twitter/X', href: 'https://twitter.com', icon: 'twitter' },
                { name: 'Discord', href: 'https://discord.com', icon: 'discord' }
              ].map(({ name, href }) => (
                <motion.li
                  key={name}
                  whileHover={{ x: 3 }}
                >
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-white/70 hover:text-white flex items-center"
                  >
                    {name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Footer - Centered */}
        <div className="border-t border-white/10 pt-8 text-center">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="inline-block mb-4"
          >
            <a href="/" className="text-xl font-bold text-white">
              Shared Sparks
            </a>
          </motion.div>
          
          <p className="text-sm text-white/70 mb-4">
            Connecting problems with solutions in the SaaS ecosystem.
          </p>
          
          <p className="text-sm text-white/50">
            © 2025 Shared Sparks | Powered by mAIven
          </p>
        </div>
      </div>
    </footer>
  );
} 