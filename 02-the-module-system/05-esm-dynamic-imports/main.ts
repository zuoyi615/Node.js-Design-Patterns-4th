const SUPPORTED_LANGUAGES = ['el', 'en', 'es', 'it', 'pl']

const selectedLanguage = process.argv[2]
if (!selectedLanguage) {
  console.error(
    `Please specify a language
    Usage: node ${process.argv[1]} <language_code>
    Supported languages: ${SUPPORTED_LANGUAGES.join(',')}
`
  )

  process.exit(1)
}

if (!SUPPORTED_LANGUAGES.includes(selectedLanguage)) {
  console.error('The specified language is not supported')
  process.exit(1)
}

const translationModule = `./strings-${selectedLanguage}.ts`

export const string = await import(translationModule)

console.log(string.HELLO)
