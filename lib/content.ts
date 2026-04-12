interface NavigationItem {
  id: string
  label: string
  href: string
}

export interface ServiceItem {
  id: string
  name: string
  description: string
  duration: string
  price: string
  icon:
    | 'sparkles'
    | 'target'
    | 'align-center'
    | 'footprints'
    | 'droplet'
    | 'zap'
    | 'brain'
    | 'activity'
    | 'baby'
    | 'hand-metal'
    | 'heart'
    | 'scissors'
}

interface AboutStat {
  id: string
  value: number
  suffix: string
  label: string
}

export const siteContent = {
  brand: {
    name: 'Pohlazení po těle a duši',
    subtitle: 'Masáže v Hodoníně',
    therapistName: 'Mgr. Radka Šebestová',
    phone: '(+420) 605 579 643',
    phoneDigits: '420605579643',
    email: 'sebestovar@seznam.cz',
    addressLine1: 'Národní tř. 383/15',
    addressLine2: '695 01 Hodonín 1',
    facebook: 'https://www.facebook.com/radka6575',
    instagram: 'https://www.instagram.com/radka.sebestova.5?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    mapsLink: 'https://maps.app.goo.gl/AvXgEjyGb2r9R4qT7',
    mapsEmbed: 'https://www.google.com/maps?q=Pohlazení+po+těle+a+duši,+Hodonín&output=embed',
  },
  navigation: {
    homeAriaLabel: 'Přejít na úvodní sekci',
    openMenuAriaLabel: 'Otevřít navigaci',
    closeMenuAriaLabel: 'Zavřít navigaci',
    items: [
      { id: 'services', label: 'Služby', href: '#services' },
      { id: 'vouchers', label: 'Poukazy', href: '#vouchers' },
      { id: 'about', label: 'O mně', href: '#about' },
      { id: 'studio', label: 'Studio', href: '#studio' },
      { id: 'booking', label: 'Termíny', href: '#booking' },
      { id: 'contact', label: 'Kontakt', href: '#contact' },
    ] as NavigationItem[],
  },
  hero: {
    title: 'Dotek, který uleví a obnoví.',
    subtitle: 'Uvolnění ztuhlých svalů • Regenerace po sportu • Hluboká relaxace mysli.',
    cta: 'Vyberte si masáž',
    imageAlt: 'Masážní studio Pohlazení po těle a duši',
    scrollIndicatorAriaLabel: 'Posunout na další sekci',
  },
  services: {
    heading: 'Jak Vám můžu pomoci?',
    subtitle: 'Široká nabídka masáží pro vaše tělo i mysl',
    intro:
      'Nabízím širokou škálu masáží a terapií přizpůsobených vašim individuálním potřebám pro dosažení harmonie těla i mysli.',
    defaultDurationLabel: 'dle dohody',
    items: [
      {
        id: 'ayurvedic-head',
        name: 'Ájurvédská masáž hlavy',
        description:
          'Jemná, hluboce uvolňující technika s teplým olejem, harmonizující mysl, nervový systém i tok energie v těle.',
        duration: '50 min',
        price: 'od 800,-',
        icon: 'sparkles',
      },
      {
        id: 'trigger-points',
        name: 'Ošetření spoušťových bodů',
        description:
          'Terapeutická technika zaměřená na uvolnění svalových uzlů a zmírnění bolesti prostřednictvím tlaku na specifické body v těle.',
        duration: '50 min',
        price: 'od 800,-',
        icon: 'target',
      },
      {
        id: 'mbs-chiro',
        name: 'Náprava a korekce metodou z MBS s prvky chiropraxe',
        description:
          'Terapeutická technika, která pomocí cílených manuálních zásahů obnovuje správné postavení těla a pohybový aparát.',
        duration: '50 min',
        price: 'od 750,-',
        icon: 'align-center',
      },
      {
        id: 'thai-feet',
        name: 'Thajská masáž nohou',
        description:
          'Tradiční technika, která kombinuje akupresuru, stimulaci reflexních bodů a protahování pro uvolnění napětí a podporu celkového zdraví.',
        duration: '60 min',
        price: 'od 900,-',
        icon: 'footprints',
      },
      {
        id: 'honey-detox',
        name: 'Medová detoxikační masáž',
        description:
          'Relaxační technika, při které se pomocí teplého medu a speciálních hmatů odstraňují toxiny z těla a zlepšuje se prokrvení pokožky.',
        duration: '60 min',
        price: 'od 800,-',
        icon: 'droplet',
      },
      {
        id: 'deep-tissue',
        name: 'Deep tissue massage',
        description:
          'Hloubková masáž zaměřená na uvolnění chronického napětí ve svalech a pojivových tkáních pomocí pomalých, intenzivních tahů.',
        duration: '60 min',
        price: 'od 850,-',
        icon: 'zap',
      },
      {
        id: 'anti-migraine',
        name: 'Protimigrénová masáž',
        description:
          'Cílená relaxační technika zaměřená na uvolnění napětí v oblasti hlavy, krku a ramen s cílem zmírnit nebo předejít migrénám.',
        duration: '50 min',
        price: 'od 700,-',
        icon: 'brain',
      },
      {
        id: 'spinal',
        name: 'Spinální masáž',
        description:
          'Terapeutická masáž zaměřená na oblast páteře, která uvolňuje svalové napětí, podporuje správné držení těla a zlepšuje funkci nervového systému.',
        duration: '60 min',
        price: 'od 800,-',
        icon: 'activity',
      },
      {
        id: 'baby',
        name: 'Baby masáže (3x)',
        description:
          'Jemné dotykové techniky určené pro miminka, které podporují jejich zdravý vývoj, zlepšují spánek a posilují vazbu mezi rodičem a dítětem.',
        duration: '45 min',
        price: '950,-',
        icon: 'baby',
      },

      {
        id: 'pregnancy',
        name: 'Těhotenská masáž',
        description:
          'Jemná masáž určená těhotným ženám, která pomáhá uvolnit napětí, zlepšit prokrvení a zmírnit bolesti spojené s těhotenstvím.',
        duration: '60 min',
        price: 'od 850,-',
        icon: 'heart',
      },
      {
        id: 'kinesio',
        name: 'Kineziotaping',
        description:
          'Terapeutická metoda, při které se na pokožku aplikují elastické pásky s cílem podpořit hojení, zmírnit bolest a zlepšit funkci svalů a kloubů.',
        duration: '',
        price: '100,- (+2,- cm)',
        icon: 'scissors',
      },
    ] as ServiceItem[],
  },
  vouchers: {
    heading: 'Dárkové poukazy',
    subtitle: 'Darujte radost z uvolnění',
    title: 'Darujte chvíle klidu',
    description: 'Darujte svým blízkým chvíle plné relaxace a pohody. Ideální dárek pro každou příležitost.',
    benefits: [
      'Libovolná hodnota poukazu',
      'Flexibilní použití na všechny služby',
      'Okamžitá objednávka přes WhatsApp',
    ],
    cta: 'Objednat dárkový poukaz',
    whatsappMessage: 'Dobrý den, mám zájem o dárkový poukaz.',
    imageAlt: 'Dárkové poukazy',
  },
  about: {
    heading: 'O mně',
    subtitle: 'Terapeutka s dlouholetou zkušeností',
    role: 'Terapeutka a masérka',
    paragraphs: [
      'Jsem mladá žena s chutí žít život naplno. Cítím, že mým posláním je vykouzlit druhým na tváři úsměv.',
      'Ráda bych, abyste se mnou zapomněli na každodenní starosti a užili si chvíli určenou jen a jen vám.',
      'Ke každému člověku se snažím přistupovat jako k jedinečné bytosti.',
    ],
    stats: [
      { id: 'years', value: 16, suffix: '+', label: 'let zkušeností' },
      { id: 'clients', value: 1500, suffix: '+', label: 'spokojených klientů' },
      { id: 'massages', value: 12, suffix: '', label: 'druhů masáží' },
    ] as AboutStat[],
    credentials: [
      'Magisterské studium ošetřovatelství na VŠZaSP sv. Alžbety v Bratislavě',
      'Specializace v oboru geriatrie',
      'Dlouholetý masér pro zdravotnictví a terapeut',
      'Zkušenosti se zařízeními sociální a zdravotní péče',
      'Učitelka zdravotnických předmětů',
      'Lektor v sociální sféře',
    ],
    closingLine: 'Těším se na Vaši návštěvu.',
  },
  studio: {
    heading: 'Naše studio',
    subtitle: 'Autentické zázemí, kde si odpočinete',
    carouselAriaLabel: 'galerii studia',
    images: [
      {
        id: 'studio-1',
        alt: 'Interiér studia - detail',
        asset: '529868a68c329f2cd79b11f95989565412c07b61',
      },
      {
        id: 'studio-2',
        alt: 'Interiér studia - prostor',
        asset: '2d115fb3cb1c74e407bde90bbf7d740b4c3604f2',
      },
      {
        id: 'studio-3',
        alt: 'Interiér studia - atmosféra',
        asset: '669702bfa59a3e8017fcb4cb9cbf4fe49cedcddf',
      },
    ],
  },
  calendar: {
    heading: 'Volné termíny',
    subtitle: 'Najděte si termín, který vám vyhovuje',
    intro: 'Vyberte si termín, který vám vyhovuje, a rezervujte si masáž přes WhatsApp.',
    selectedServiceLabel: 'Vybraná služba',
    unavailableMessage: 'Kalendář není aktuálně dostupný.',
    unavailableHelp: 'Pro rezervaci mě prosím kontaktujte přímo.',
    carouselAriaLabel: 'termíny',
    dayNames: ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'],
    whatsappDefaultTemplate: 'Dobrý den, chtěl(a) bych si rezervovat masáž na {date} v čase {time}.',
    whatsappServiceTemplate: 'Dobrý den, mám zájem o: {service}\n\nRezervace na {date} v {time}',
    flexibilityNote: 'Termíny jsou flexibilní a ráda je přizpůsobím vašim možnostem.',
    whatsappCta: 'Rezervovat přes WhatsApp',
  },
  contact: {
    heading: 'Kontaktujte mě',
    subtitle: 'Ráda zodpovím všechny vaše dotazy',
    cards: {
      phoneLabel: 'Telefon',
      emailLabel: 'Email',
      addressLabel: 'Adresa',
      openingHoursLabel: 'Otevírací doba',
      flexibilityNote: 'Termíny jsou flexibilní a přizpůsobím se vašim potřebám',
    },
    openingHours: [
      { day: 'Po–Pá', hours: '15:00–21:00' },
      { day: 'So', hours: 'Zavřeno' },
      { day: 'Ne', hours: 'Zavřeno' },
    ],
    mapTitle: 'Pohlazení po těle a duši - mapa',
  },
  footer: {
    openingHoursHeading: 'Otevírací doba',
    contactHeading: 'Kontakt',
    cityLabel: 'Hodonín',
    description: 'Masáže a terapie těla',
    rights: 'Všechna práva vyhrazena.',
    facebookAriaLabel: 'Facebook',
    instagramAriaLabel: 'Instagram',
  },
  floatingButtons: {
    whatsappLabel: 'Rezervovat termín',
    whatsappDefaultMessage:
      'Dobrý den, chtěl(a) bych se informovat o masáži.\n\nMoje jméno: [Vyplňte prosím]\nTelefon: [Vyplňte prosím]',
    whatsappSelectedServiceMessage:
      'Dobrý den, mám zájem o: {service}\n\nMoje jméno: [Vyplňte prosím]\nTelefon: [Vyplňte prosím]',
    whatsappAriaLabel: 'Kontaktujte nás na WhatsApp',
    scrollTopLabel: 'Zpět nahoru',
  },
}
