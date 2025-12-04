Propozycje funkcjonalności dla aplikacji Karta Łodzianina
Ten projekt zawiera gotowe moduły, które możesz zintegrować z aplikacją Karta Łodzianina:

1. Zakładka „Ładowarki EV”
Pełna mapa wszystkich stacji ładowania EV w Łodzi

Status dostępności w czasie rzeczywistym (wolne/zajęte)

Aktualne ceny za kWh i sesje

Filtry (operator, moc, typ złącza, cena, dostępność)

Lista ulubionych stacji i historia ładowań

2. Moduł gamifikacji i aktywacji użytkowników
Codzienne losowanie zniżek i promocji (1 gra/24h)

Interaktywna „zdrapka" z nagrodami

Historia wygranych z kodami QR

Timer do następnej gry

Repozytorium GitHub zawiera kompletny kod źródłowy obu modułów – gotowy do integracji z Twoją aplikacją.

Witaj w projekcie
Ten projekt jest aplikacją frontendową opartą na nowoczesnym stosie technologii webowych. Poniżej znajdziesz instrukcję uruchomienia, rozwijania i wdrażania projektu w swoim środowisku.

Jak edytować ten kod?
Praca lokalna w swoim IDE
Możesz pracować nad projektem lokalnie, korzystając z dowolnego ulubionego edytora/IDE.
Wymagania wstępne: zainstalowany Node.js oraz npm.

text
# Sklonuj repozytorium
git clone <TWÓJ_GIT_URL>

# Wejdź do katalogu projektu
cd <NAZWA_PROJEKTU>

# Zainstaluj zależności
npm i

# Uruchom serwer deweloperski z automatycznym przeładowywaniem
npm run dev
Po uruchomieniu aplikacja będzie dostępna pod adresem wyświetlonym w konsoli (zwykle http://localhost:5173 lub podobnym).

Edycja plików bezpośrednio w GitHub
Jeśli nie chcesz pracować lokalnie:

Wejdź do interesującego Cię pliku w repozytorium

Kliknij ikonę ołówka („Edit")

Wprowadź zmiany

Zapisz je, wykonując commit (z opisem zmian)

Praca w GitHub Codespaces
Jeśli korzystasz z GitHub Codespaces:

Wejdź na stronę główną repozytorium

Kliknij przycisk „Code"

Przejdź do zakładki „Codespaces"

Wybierz „New codespace", aby utworzyć środowisko

Edytuj pliki w przeglądarce i commituj/pushuj zmiany

Wykorzystane technologie
Projekt wykorzystuje:

Vite – szybki bundler i narzędzie deweloperskie

TypeScript – typowany nadzbiór JavaScriptu

React – biblioteka do budowy interfejsów użytkownika

shadcn-ui – zestaw komponentów UI opartych na Radix + Tailwind

Tailwind CSS – narzędzie do stylowania oparte na klasach utility

Jak wdrożyć projekt?
Ogólny proces wdrożenia (np. na dowolny hosting statyczny/platformę dla aplikacji React):

text
# Zbuduj projekt produkcyjny
npm run build

# Przetestuj lokalnie build (opcjonalnie)
npm run preview
Wdróż zawartość katalogu dist na:

wybrany hosting statyczny (np. GitHub Pages)

platformę obsługującą projekty Vite/React

Szczegółowe kroki zależą od dostawcy hostingu – zwykle wskazujesz repozytorium lub wgrywasz folder dist i ustawiasz komendę build.
