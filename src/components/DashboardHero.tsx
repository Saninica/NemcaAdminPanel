import {
    Bars4Icon,
    CalendarIcon,
    PhotoIcon,
    GlobeAltIcon,
    DocumentMagnifyingGlassIcon,
    SpeakerWaveIcon,
    DocumentDuplicateIcon
} from '@heroicons/react/24/outline'
import useAuthStore from '../store/useAuthStore';
import { ROUTES } from '../constants/routes';



export default function DashboardHero() {

    const user = useAuthStore((state) => state.user);

    const items = [
        {
            title: 'Dil Oluştur',
            description: 'Web sitelerinin dil tercihleri oluşturun. TR, EN v.b.',
            icon: Bars4Icon,
            background: 'bg-pink-500',
            href: ROUTES.LANGUAGES,
        },
        {
            title: 'Sayfa Oluştur',
            description: 'Web sitelerindeki sayfalar. Home, About Us v.b.',
            icon: CalendarIcon,
            background: 'bg-yellow-500',
            href: ROUTES.PAGES,
        },
        
        {
            title: 'Sayfa İçerikleri Oluştur',
            description: 'Oluşturulan sayfalara ait içerikler.',
            icon: PhotoIcon,
            background: 'bg-green-500',
            href: ROUTES.CONTENTS,
        },

        {
            title: 'Websitesi Oluştur',
            description: 'Web sitelerinizi oluşturun.',
            icon: GlobeAltIcon,
            background: 'bg-red-500',
            href: ROUTES.WEBSITES,
        },
        {
            title: 'Metatags Oluştur',
            description: 'Web siteniz için meta tag oluşturun.',
            icon: DocumentMagnifyingGlassIcon,
            background: 'bg-indigo-500',
            href: ROUTES.METATAGS,
        },
        {
            title: 'Duyuru Oluştur',
            description: 'Web sitenizde görüntülenecek duyurulari oluşturun.',
            icon: SpeakerWaveIcon,
            background: 'bg-gray-500',
            href: ROUTES.ANNOUNCEMENTS
        },
        {
            title: 'Blog Oluştur',
            description: 'Web sitenizde yayınlanacak blogları oluşturun.',
            icon: DocumentDuplicateIcon,
            background: 'bg-blue-500',
            href: ROUTES.BLOGS
        }

    ]

    function classNames(...classes: any) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <div>
            <h2 className="text-base font-semibold text-white">Hoş Geldiniz, {user?.username}</h2>
            <p className="mt-1 text-sm text-gray-50">
                Aşağıda bulunan seçenekleri kullanarak websitenize dil, sayfa, içerik, metatag, duyuru ve blog oluşturabilirsiniz.
            </p>
            <ul role="list" className="mt-6 grid grid-cols-1 gap-6 border-b border-t border-gray-200 py-6 sm:grid-cols-2">
                {items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flow-root">
                        <div className="relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-gray-500 hover:bg-gray-600">
                            <div
                                className={classNames(item.background, 'flex size-16 shrink-0 items-center justify-center rounded-lg')}
                            >
                                <item.icon aria-hidden="true" className="size-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-50">
                                    <a href={item.href} className="focus:outline-none">
                                        <span aria-hidden="true" className="absolute inset-0" />
                                        <span>{item.title}</span>
                                        <span aria-hidden="true"> &rarr;</span>
                                    </a>
                                </h3>
                                <p className="mt-1 text-sm text-gray-50">{item.description}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            
        </div>
    )
}