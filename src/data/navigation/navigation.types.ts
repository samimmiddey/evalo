export interface NavigationItem {
   name: string
   href: string
}

export interface FooterColumn {
   title: string
   links: NavigationItem[]
}

export interface FooterDataTypes {
   description: string
   columns: FooterColumn[]
   copyright: string
   socials?: { icon: string, href: string }[]
}