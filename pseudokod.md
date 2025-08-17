1. Pseudokod za jednostavni račun smjese
text
Copy
Edit
POČETAK

Unesi a1 (intenzitet prve robe)
Unesi a2 (intenzitet druge robe)
Unesi m (željeni prosjek)
Unesi S (ukupna količina smjese)

Ako m NIJE između a1 i a2:
    Ispiši "Greška: Prosjek mora biti između intenziteta"
    ZAUSTAVI program

Izračunaj omjer1 = |a2 - m|
Izračunaj omjer2 = |m - a1|

Izračunaj zbroj = omjer1 + omjer2

Izračunaj k = S / zbroj

Izračunaj x1 = omjer1 * k
Izračunaj x2 = omjer2 * k

Ispiši "Potrebno je x1 jedinica robe 1 i x2 jedinica robe 2"

KRAJ
2. Funkcijski dijagram (opis elemenata)
Funkcijski dijagram (flowchart) ima sljedeće blokove:

Početak
Oblik: elipsa

Tekst: "Početak"

Ulaz podataka
Oblik: paralelogram

Tekst: "Unesi a1, a2, m, S"

Provjera uvjeta
Oblik: romb (decision)

Tekst: "Da li m između a1 i a2?"

Da → nastavlja na izračun
Ne → ispis greške i završetak

Izračun omjera
Oblik: pravokutnik

Tekst:

omjer1 = |a2 - m|

omjer2 = |m - a1|

zbroj = omjer1 + omjer2

Izračun količina
Oblik: pravokutnik

Tekst:

k = S / zbroj

x1 = omjer1 * k

x2 = omjer2 * k

Ispis rezultata
Oblik: paralelogram

Tekst: "Ispiši x1 i x2"

Kraj
Oblik: elipsa

Tekst: "Kraj"



PRIMJER ZA TUTORIJAL
Od kave K1 po cijeni 150.00 kn za 1 kilogram i kave K2 po cijeni 300.00 kn za 1 kilogram treba napraviti mješavinu od 6000kg koja će se prodavati po 200 kn/kg. Koliko kg kave svake vrste treba miješati? 
REZ 2:1
4000 kg kave 1 i 2000 kg kave 2 (str. 35)

ILI primjer iz završnog (ili oba?? )