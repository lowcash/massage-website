import { Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#2c2c2c] text-white py-16 px-6 md:px-16">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Business Info */}
          <div>
            <div className="mb-4">
              <span className="text-xl" style={{ fontFamily: 'Dancing Script' }}>
                Pohlazení po těle a duši
              </span>
            </div>
            <p className="text-[#e0e0e0] mb-4">Masáže a terapie těla</p>
            <p className="text-[#e0e0e0] text-sm">
              © 2025 Pohlazení po těle a duši.
              <br />
              Všechna práva vyhrazena.
            </p>
          </div>

          {/* Otevírací doba */}
          <div>
            <h3 className="text-xl mb-4" style={{ fontFamily: 'Dancing Script' }}>
              Otevírací doba
            </h3>
            <div className="space-y-2 text-[#e0e0e0]">
              <div className="flex justify-between">
                <span>Po-Pá:</span>
                <span>15:00 - 21:00</span>
              </div>
              <div className="flex justify-between">
                <span>So:</span>
                <span>Zavřeno</span>
              </div>
              <div className="flex justify-between">
                <span>Ne:</span>
                <span>Zavřeno</span>
              </div>
            </div>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-xl mb-4" style={{ fontFamily: 'Dancing Script' }}>
              Kontakt
            </h3>
            <div className="space-y-3 text-[#e0e0e0]">
              <p>
                <span className="text-[#c4a75f]">Email:</span>
                <br />
                <a
                  href="mailto:sebestovar@seznam.cz"
                  className="hover:text-[#de397e] transition-colors"
                >
                  sebestovar@seznam.cz
                </a>
              </p>
              <p>
                <span className="text-[#c4a75f]">Telefon:</span>
                <br />
                <a
                  href="tel:+420605579643"
                  className="hover:text-[#de397e] transition-colors"
                >
                  (+420) 605 579 643
                </a>
              </p>
              <p>
                <span className="text-[#c4a75f]">Adresa:</span>
                <br />
                Národní tř. 383/15
                <br />
                695 01 Hodonín 1
              </p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://www.facebook.com/radka6575"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 hover:scale-110 transition-all"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://www.instagram.com/radka.sebestova.5?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 hover:scale-110 transition-all"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}