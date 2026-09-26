import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Language, Translations } from './translations'
import { languages } from './translations'

interface LangContextValue {
  lang: Language
  t: Translations
  toggleLang: () => void
}

const LangContext = createContext<LangContextValue>({
  lang: 'ar',
  t: languages.ar,
  toggleLang: () => {},
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('ar')

  const toggleLang = () => setLang((l) => (l === 'ar' ? 'en' : 'ar'))

  return (
    <LangContext.Provider value={{ lang, t: languages[lang], toggleLang }}>
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
        {children}
      </div>
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
