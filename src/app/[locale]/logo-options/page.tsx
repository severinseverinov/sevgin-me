import React from "react";

export default function LogoOptionsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-4 text-center">
          Samimi & Geometrik Logo Konseptleri
        </h1>
        <p className="text-[var(--color-text-muted)] text-center mb-16 max-w-2xl mx-auto">
          Gönderdiğiniz o harika, iç içe geçen sürekli çizgili yapıdan ilham
          aldım. Ancak keskin ve soğuk köşeler yerine,{" "}
          <strong>
            daha sıcak, samimi ve kişisel markanıza (Teal & Mavi tonları) uygun
          </strong>
          , aynı zamanda o geometrik "sağlamlığı" koruyan 5 yeni tasarım
          hazırladım.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Konsept 1 */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-[var(--color-border)] dark:border-[var(--color-border-dark)] flex flex-col items-center hover:shadow-2xl transition-all group">
            <div className="w-32 h-32 mb-8 relative flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-2xl group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 48 48" fill="none" className="w-20 h-20">
                {/* Altıgen yapı korunuyor ama köşeler yuvarlatılmış, renkler samimi */}
                <path
                  d="M 24 6 L 36 12 L 36 20 L 16 26 L 12 20 L 24 14"
                  stroke="#0D9488"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 24 42 L 12 36 L 12 28 L 32 22 L 36 28 L 24 34"
                  stroke="#1E40AF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 36 20 V 28"
                  stroke="#0D9488"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 12 28 V 20"
                  stroke="#1E40AF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-3 text-center">
              1. Yuvarlatılmış Altıgen (Bağlantı)
            </h3>
            <p className="text-sm text-center text-gray-500 leading-relaxed">
              Gönderdiğiniz geometrik altıgen formu aldım, fakat sivri uçları
              yumuşattım. İki akıcı çizginin (Teal ve Mavi) birbirine tutunduğu
              çok samimi ve sıcak bir kucaklaşma/bağlantı hissi veriyor.
            </p>
          </div>

          {/* Konsept 2 */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-[var(--color-border)] dark:border-[var(--color-border-dark)] flex flex-col items-center hover:shadow-2xl transition-all group">
            <div className="w-32 h-32 mb-8 relative flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-2xl group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 48 48" fill="none" className="w-20 h-20">
                {/* Tek, kesintisiz, kıvrımlı ve dostane bir S */}
                <path
                  d="M 34 14 C 34 8 28 6 24 6 C 16 6 12 10 12 16 C 12 24 36 24 36 32 C 36 38 32 42 24 42 C 18 42 14 38 14 34"
                  stroke="url(#grad-soft)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="grad-soft"
                    x1="12"
                    y1="6"
                    x2="36"
                    y2="42"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#14B8A6" />
                    <stop offset="1" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-3 text-center">
              2. Kesintisiz Akış & Gülümseme
            </h3>
            <p className="text-sm text-center text-gray-500 leading-relaxed">
              Tek bir çizginin hiç kopmadan, çok yumuşak ve tatlı kıvrımlarla
              çizdiği dolgun bir 'S'. Referanstaki tek parça mantığını alıp
              olabilecek en "dost canlısı" forma soktuk.
            </p>
          </div>

          {/* Konsept 3 */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-[var(--color-border)] dark:border-[var(--color-border-dark)] flex flex-col items-center hover:shadow-2xl transition-all group">
            <div className="w-32 h-32 mb-8 relative flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-2xl group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 48 48" fill="none" className="w-20 h-20">
                {/* Referanstaki labirentvari ama yuvarlak hatlı yapı */}
                <path
                  d="M 32 14 H 16 A 6 6 0 0 0 10 20 V 20 A 6 6 0 0 0 16 26 H 32 A 6 6 0 0 1 38 32 V 32 A 6 6 0 0 1 32 38 H 16"
                  stroke="#0D9488"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 24 14 V 26"
                  stroke="#1E40AF"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.4"
                />
                <path
                  d="M 24 38 V 26"
                  stroke="#1E40AF"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-3 text-center">
              3. Modern Geometrik Şerit
            </h3>
            <p className="text-sm text-center text-gray-500 leading-relaxed">
              Gönderdiğiniz resimdeki gibi "iç içe giren yollar" konsepti var,
              fakat boru gibi kıvrımlı. Hem teknolojik bir "devre" hissi veriyor
              hem de köşeleri olmadığı için insancıl ve sıcak.
            </p>
          </div>

          {/* Konsept 4 */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-[var(--color-border)] dark:border-[var(--color-border-dark)] flex flex-col items-center hover:shadow-2xl transition-all group">
            <div className="w-32 h-32 mb-8 relative flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-2xl group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 48 48" fill="none" className="w-20 h-20">
                {/* İki yarım ay formunun birbirine sarılması */}
                <path
                  d="M 26 12 A 10 10 0 0 0 12 22 A 10 10 0 0 0 22 32"
                  stroke="#0D9488"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <path
                  d="M 22 36 A 10 10 0 0 0 36 26 A 10 10 0 0 0 26 16"
                  stroke="#1E40AF"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <circle cx="24" cy="24" r="4" fill="#14B8A6" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-3 text-center">
              4. Sarılan Formlar (Sempatik)
            </h3>
            <p className="text-sm text-center text-gray-500 leading-relaxed">
              Merkezdeki bir çekirdek (fikir/proje) etrafında sarılan iki sıcak
              form. En organik ve "sıcakkanlı" logomuz. Kesinlikle iletişime
              açık bir karakter çiziyor.
            </p>
          </div>

          {/* Konsept 5 */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-[var(--color-border)] dark:border-[var(--color-border-dark)] flex flex-col items-center hover:shadow-2xl transition-all group lg:col-start-2">
            <div className="w-32 h-32 mb-8 relative flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-2xl group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 48 48" fill="none" className="w-20 h-20">
                {/* Katlanmış kurdele hissiyatı: hem geometrik hem sıcak */}
                <path
                  d="M 32 10 H 22 C 16.477 10 12 14.477 12 20 C 12 25.523 16.477 30 22 30 H 26 C 29.314 30 32 32.686 32 36 C 32 39.314 29.314 42 26 42 H 16"
                  stroke="#0D9488"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 12 20 L 22 20"
                  stroke="#1E40AF"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d="M 32 36 L 26 36"
                  stroke="#1E40AF"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-3 text-center">
              5. Katlanmış Kurdele (Kurumsal Sıcaklık)
            </h3>
            <p className="text-sm text-center text-gray-500 leading-relaxed">
              Gönderdiğiniz resimdeki iç içe hatların bir "kurdele" gibi
              katlandığı, hediye hissiyatı veren oldukça estetik ve cana yakın
              bir geometrik form.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
