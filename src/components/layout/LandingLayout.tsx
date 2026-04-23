import { motion } from "framer-motion";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function LandingLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <img src="/logo.jpeg" alt="LuxeResolve" className="h-16 w-16 rounded-lg shadow-lg object-cover" />
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold text-gradient-primary">LuxeResolve</span>
                <span className="text-xs text-primary font-semibold">Luxury, Verified</span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <div className="flex items-center gap-4">
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90"
                onClick={() => navigate('/cases')}
              >
                View Demo
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-background border-t border-border"
          >
            <div className="px-6 py-4 space-y-4">
              <Button 
                size="sm" 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => navigate('/cases')}
              >
                View Demo
              </Button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-24">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/logo.jpeg" alt="LuxeResolve" className="h-12 w-12 rounded-lg shadow-lg object-cover" />
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold text-gradient-primary">LuxeResolve</span>
                <span className="text-xs text-primary font-semibold">Luxury, Verified</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              AI-powered fraud detection for luxury marketplaces. 
              Protect your business with enterprise-grade intelligence.
            </p>
            <div className="text-xs text-muted-foreground">
              © 2024 LuxeResolve Intelligence. Demo system for evaluation purposes.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}