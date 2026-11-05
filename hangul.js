// Aprender hangul: contenido fijo y PÚBLICO. Basado en el Hunminjeongeum (1446), la romanización oficial
// coreana (2000) y guías libres (How to Study Korean, Unidad 0; Nuri-Sejong Hakdang; cómic de Ryan Estrada).
// Los trucos para memorizar son propios. Pronunciación "a la española" = la misma que usa la app (pronuncia()).
// Letra: [letra, cómo suena, romanización oficial, ejemplo en hangul, qué significa, truco]
const HG_LEC = [
  { id: 'idea', ic: '💡', t: 'La idea: un alfabeto de bloques', puntos: [
    'Lo creó el rey **Sejong el Grande** en 1443 y lo publicó en 1446 con el nombre de **Hunminjeongeum**, «los sonidos correctos para instruir al pueblo». Hasta entonces se escribía con caracteres chinos, que casi nadie sabía leer.',
    'Es un **alfabeto**, como el nuestro: **14 consonantes y 10 vocales básicas**. Combinándolas salen 19 consonantes y 21 vocales.',
    'Las letras se agrupan en **bloques**, y cada bloque es **una sílaba**: 한 = ㅎ (j) + ㅏ (a) + ㄴ (n) = «jan». 한국 = «jan» + «guk» = Corea.',
    'Se lee como en español: de **izquierda a derecha** y, dentro del bloque, de **arriba abajo**.',
    'El prólogo del libro de 1446 presume de lo fácil que es: «un sabio lo aprende antes de que acabe la mañana; un torpe, en diez días».'],
    trucos: ['Las consonantes **dibujan la boca** al pronunciarlas: ㄱ es la lengua tocando el fondo del paladar, ㄴ la punta de la lengua en las encías, ㅁ la boca cerrada, ㅅ un diente y ㅇ la garganta. Si te acuerdas del dibujo, te acuerdas del sonido.',
      'Las vocales salen de solo tres trazos: **·** el cielo, **ㅡ** la tierra y **ㅣ** la persona.'] },
  { id: 'vocales', ic: '🅰️', t: 'Las vocales básicas', letras: [
    ['ㅏ', 'a', 'a', '아이', 'niño', 'Palito con la rayita hacia fuera (derecha): la boca se abre → «a».'],
    ['ㅓ', 'o abierta', 'eo', '어머니', 'madre', 'Rayita hacia dentro (izquierda): una «o» con la boca bien abierta, casi «a».'],
    ['ㅗ', 'o', 'o', '오이', 'pepino', 'Rayita hacia arriba: labios redondos como una O.'],
    ['ㅜ', 'u', 'u', '우유', 'leche', 'Rayita hacia abajo: la «u» se cae al suelo.'],
    ['ㅡ', 'u sonriendo', 'eu', '버스', 'autobús', 'Una raya plana = labios planos: di «u» sonriendo, sin redondear.'],
    ['ㅣ', 'i', 'i', '이', 'dos / diente', 'Un palito de pie, delgado como la «i».'],
    ['ㅐ', 'e', 'ae', '개', 'perro', 'ㅏ + ㅣ. Hoy suena igual que ㅔ: «e».'],
    ['ㅔ', 'e', 'e', '네', 'sí', 'ㅓ + ㅣ. Igual que ㅐ: «e».']],
    trucos: ['**Dónde va la vocal**: las de palo vertical (ㅏ ㅓ ㅣ ㅐ ㅔ) van a la **derecha** de la consonante (가); las de raya horizontal (ㅗ ㅜ ㅡ) van **debajo** (고).',
      'En los carteles con letras latinas: **eo** = o abierta (Seoul = «Soul»), **eu** = u sonriendo, **ae** = e.'],
    ojo: ['Una sílaba nunca empieza por vocal sola: delante se pone ㅇ, que ahí no suena. ㅏ sola se escribe 아.'] },
  { id: 'y', ic: '➕', t: 'Vocales con «y»: una rayita más', letras: [
    ['ㅑ', 'ya', 'ya', '야구', 'béisbol', 'ㅏ con dos rayitas → «ya».'],
    ['ㅕ', 'yo abierta', 'yeo', '여자', 'mujer', 'ㅓ con dos rayitas → «yo» con la o abierta.'],
    ['ㅛ', 'yo', 'yo', '요리', 'cocina (platos)', 'ㅗ con dos rayitas → «yo».'],
    ['ㅠ', 'yu', 'yu', '우유', 'leche', 'ㅜ con dos rayitas → «yu» (la segunda sílaba de 우유).'],
    ['ㅒ', 'ye', 'yae', '얘기', 'charla', 'ㅐ con dos rayitas → «ye». Muy poco frecuente.'],
    ['ㅖ', 'ye', 'ye', '시계', 'reloj', 'ㅔ con dos rayitas → «ye».']],
    trucos: ['**Dos rayitas = suena una «y» delante.** Es la misma regla para las seis.'] },
  { id: 'w', ic: '🔗', t: 'Vocales con «w»: se suman', letras: [
    ['ㅘ', 'ua', 'wa', '화장실', 'baño', 'ㅗ + ㅏ dichas muy rápido: «o-a» → «ua».'],
    ['ㅝ', 'uo', 'wo', '원', 'won (la moneda)', 'ㅜ + ㅓ: «u-o» → «uo».'],
    ['ㅙ', 'ue', 'wae', '왜', '¿por qué?', 'ㅗ + ㅐ → «ue».'],
    ['ㅚ', 'ue', 'oe', '회사', 'empresa', 'ㅗ + ㅣ, pero hoy suena «ue».'],
    ['ㅞ', 'ue', 'we', '웨이터', 'camarero', 'ㅜ + ㅔ → «ue». Las tres «ue» suenan casi igual.'],
    ['ㅟ', 'ui', 'wi', '위', 'arriba', 'ㅜ + ㅣ → «ui».'],
    ['ㅢ', 'ui (u sonriendo + i)', 'ui', '의사', 'médico', 'ㅡ + ㅣ. Tras consonante suena «i» (희 → «ji»).']],
    trucos: ['**Lee las dos vocales muy deprisa** y sale el sonido: o + a = «ua», u + o = «uo».'],
    ojo: ['ㅢ es la única caprichosa: al principio de palabra «ui» (의사), tras consonante «i» y como partícula «de» (의) muchas veces «e».'] },
  { id: 'cons', ic: '🔤', t: 'Las consonantes básicas', letras: [
    ['ㄱ', 'k / g', 'g, k', '가방', 'bolso', 'La lengua levantada tocando el fondo del paladar, como al decir «k». Al principio casi «k»; entre vocales, «g».'],
    ['ㄴ', 'n', 'n', '나무', 'árbol', 'La punta de la lengua pegada detrás de los dientes de arriba: «n».'],
    ['ㄷ', 't / d', 'd, t', '다리', 'puente / pierna', 'Una ㄴ con tapa: misma lengua que la n, pero cerrando el paso → «t/d».'],
    ['ㄹ', 'r / l', 'r, l', '라면', 'ramen', 'Un muelle: la lengua rebota. Entre vocales «r» suave (como en «pero»); al final, «l» (서울 = «Soul»).'],
    ['ㅁ', 'm', 'm', '물', 'agua', 'Un cuadrado = la boca cerrada: «m» de mamá.'],
    ['ㅂ', 'p / b', 'b, p', '밥', 'arroz / comida', 'Un balde: «b» de balde. Al principio casi «p».'],
    ['ㅅ', 's', 's', '사람', 'persona', 'Un diente: el aire silba entre los dientes → «s». Delante de i/y suena «sh» (시 = «shi»).'],
    ['ㅇ', 'muda / ng', '–, ng', '아이', 'niño', 'Un cero: al principio, cero sonido. Al final, «ng» como la n de «tengo».'],
    ['ㅈ', 'ch suave', 'j', '저', 'yo (formal)', 'Una ㅅ con techo: «ch» suave, casi «y» (como la j inglesa de «jeans»).'],
    ['ㅎ', 'j suave', 'h', '하나', 'uno', 'Una ㅇ con sombrero: es la «j» suave canaria o andaluza, solo aire.']],
    trucos: ['**ㄱ ㄷ ㅂ ㅈ suenan suaves**: al principio de palabra, casi k/t/p/ch; entre vocales, g/d/b/y. Por eso 부산 se escribe «Busan» y se oye «Pusan».',
      'ㅎ es la consonante «de casa» para un canario: vuestra j aspirada es justo ese sonido.'] },
  { id: 'aire', ic: '💨', t: 'Consonantes con aire: una raya más', letras: [
    ['ㅋ', 'k con aire', 'k', '커피', 'café', 'ㄱ con una raya más = la misma k, soltando aire.'],
    ['ㅌ', 't con aire', 't', '택시', 'taxi', 'ㄷ con una raya más.'],
    ['ㅍ', 'p con aire', 'p', '피자', 'pizza', 'Una ㅂ «tumbada» con rayas: p soltando aire.'],
    ['ㅊ', 'ch con aire', 'ch', '차', 'té / coche', 'ㅈ con una rayita encima: ch con aire.']],
    trucos: ['**Una raya más = un soplo de aire.** Prueba de la mano: ponla delante de la boca; con ㅋ ㅌ ㅍ ㅊ tienes que notar el aire.'] },
  { id: 'dobles', ic: '✌️', t: 'Consonantes dobles: tensas', letras: [
    ['ㄲ', 'k tensa', 'kk', '꽃', 'flor', 'Doble = apretada y sin aire: la «k» española de «casa».'],
    ['ㄸ', 't tensa', 'tt', '딸기', 'fresa', 'La «t» española de «taza».'],
    ['ㅃ', 'p tensa', 'pp', '빵', 'pan', 'La «p» española de «pan» (y además 빵 viene del portugués «pão»).'],
    ['ㅆ', 's fuerte', 'ss', '비싸요', 'es caro', 'Una s larga y apretada.'],
    ['ㅉ', 'ch tensa', 'jj', '짜요', 'está salado', 'Una «ch» seca, sin aire.']],
    trucos: ['**Cada consonante tiene tres versiones**: suave (ㄱ ㄷ ㅂ ㅈ), con aire (ㅋ ㅌ ㅍ ㅊ) y tensa (ㄲ ㄸ ㅃ ㅉ). Las tensas son las que mejor os salen: suenan como nuestras k, t, p.'],
    ojo: ['La app escribe igual k/kk, t/tt y p/pp en la pronunciación a la española: la diferencia es de aire y tensión, no de letra.'] },
  { id: 'bloques', ic: '🧱', t: 'Cómo se monta una sílaba', puntos: [
    '**Consonante + vocal** siempre. Si la sílaba suena con vocal, se pone delante la ㅇ muda: 아, 오, 이.',
    'Vocal de palo vertical → **a la derecha**: 가 (ka), 너 (no), 디 (di).',
    'Vocal de raya horizontal → **debajo**: 고 (ko), 누 (nu), 므 (mu).',
    'Vocal combinada (ㅘ, ㅟ…) → **debajo y a la derecha**: 과 (kua), 귀 (kui).',
    'La consonante final, el **batchim**, va **siempre abajo**: 각 (kak), 문 (mun), 한 (jan).',
    'A veces hay **dos finales** (닭, 앉다): normalmente se lee solo una. 닭 (pollo) = «tak».',
    'Escritura: los trazos van de arriba abajo y de izquierda a derecha; la ㅇ se traza en un solo giro, empezando arriba.'],
    trucos: ['Piensa en cada bloque como un cajón con huecos: arriba a la izquierda la consonante, la vocal donde quepa (derecha o debajo) y la final siempre en el suelo.'] },
  { id: 'finales', ic: '⏹️', t: 'Las consonantes finales: solo 7 sonidos', puntos: [
    'ㄱ ㄲ ㅋ → **k** (부엌, cocina = «buok»).',
    'ㄴ → **n** · ㄹ → **l** · ㅁ → **m** · ㅇ → **ng**.',
    'ㄷ ㅅ ㅆ ㅈ ㅊ ㅌ ㅎ → **t** (옷, ropa = «ot»; 꽃, flor = «kkot»).',
    'ㅂ ㅍ → **p** (앞, delante = «ap»).'],
    trucos: ['**Los 7 finales se recitan así: «Ka Na Ta La Ma Pa Nga».**',
      'Al final de sílaba, k, t y p **no explotan**: se cierra la boca como para decirlas y se corta, sin soltar aire. Como si fueras a decir «ka» y te frenaras.'] },
  { id: 'reglas', ic: '📏', t: 'Reglas de lectura que más oiréis', reglas: [
    ['Enlace: la final salta a la vocal siguiente', 'Si la sílaba siguiente empieza por ㅇ muda, la consonante final pasa a ocupar su sitio.', ['한국어', '음악']],
    ['Nasalización: k/t/p delante de n o m', 'ㄱ → ng, ㄷ → n, ㅂ → m. Por eso «gracias» no suena «kamsahapnida».', ['감사합니다', '입니다', '한국말']],
    ['La ㅎ débil', 'Entre vocales casi desaparece; junto a ㄱ ㄷ ㅈ las convierte en ㅋ ㅌ ㅊ.', ['좋아요', '괜찮아요', '축하해요']],
    ['ㄴ + ㄹ = «ll» (una l larga)', 'Ojo: «ll» es una l doble, no la ll española.', ['신라', '설날']],
    ['ㅅ delante de i suena «sh»', 'También delante de ya, yo, yu…', ['시청', '신발']],
    ['ㄷ/ㅌ + 이 → «chi»', 'Se suavizan delante de i.', ['같이', '굳이']],
    ['Tras k/t/p, la siguiente se tensa', 'La consonante de después suena apretada (ㄱ → ㄲ, ㄷ → ㄸ…).', ['학교', '식당']]],
    trucos: ['No hace falta memorizarlas: con el 🔊 de cada ejemplo se oyen. Fíjate en que la pronunciación a la española de la app ya las aplica.'] },
  { id: 'carteles', ic: '🪧', t: 'Truco final: muchos carteles son inglés', puntos: [
    'Muchas palabras vienen del inglés. Si no entiendes un cartel, **léelo en voz alta**: 커피 = «kopi» (coffee), 택시 = «tekshi» (taxi), 호텔 = «jotel» (hotel), 버스 = «bosu» (bus), 엘리베이터 = «elibeito» (elevator).',
    'La f y la v no existen: se escriben con ㅍ y ㅂ (피자 = pizza). La z tampoco: se usa ㅈ.',
    'Practica con la sección 🪧 Carteles: cada palabra viene descompuesta letra a letra.'] }
];

// Carteles y palabras que veréis en la calle: [hangul, significado, del inglés (true)]
const HG_CARTELES = [
  ['출구', 'Salida'], ['입구', 'Entrada'], ['화장실', 'Baños'], ['남자', 'Hombre'], ['여자', 'Mujer'],
  ['지하철', 'Metro'], ['역', 'Estación'], ['환승', 'Transbordo'], ['방면', 'Dirección (hacia…)'], ['비상구', 'Salida de emergencia'],
  ['버스', 'Autobús', true], ['택시', 'Taxi', true], ['공항', 'Aeropuerto'], ['호텔', 'Hotel', true], ['엘리베이터', 'Ascensor', true],
  ['시장', 'Mercado'], ['약국', 'Farmacia'], ['병원', 'Hospital'], ['편의점', 'Tienda 24 h'], ['매표소', 'Taquilla'],
  ['입장료', 'Precio de la entrada'], ['무료', 'Gratis'], ['할인', 'Descuento'], ['계산', 'Pagar / caja'], ['영업중', 'Abierto'],
  ['휴무', 'Cerrado (día de descanso)'], ['금연', 'Prohibido fumar'], ['주의', 'Atención / cuidado'], ['당기세요', 'Tire'], ['미세요', 'Empuje'],
  ['식당', 'Restaurante'], ['카페', 'Cafetería', true], ['커피', 'Café', true], ['메뉴', 'Menú', true], ['물', 'Agua'],
  ['맥주', 'Cerveza'], ['소주', 'Soju'], ['김치', 'Kimchi'], ['비빔밥', 'Bibimbap'], ['라면', 'Ramen'],
  ['서울', 'Seúl'], ['부산', 'Busan'], ['경주', 'Gyeongju'], ['안동', 'Andong'], ['전주', 'Jeonju'], ['한국', 'Corea']
];

// Para seguir aprendiendo: guías gratuitas y de libre acceso.
const HG_FUENTES = [
  ['Nuri-Sejong Hakdang (Instituto Rey Sejong)', 'https://nuri.iksi.or.kr', 'La escuela oficial de coreano del Gobierno, en línea y gratis con registro. Hay interfaz en español y empieza por el hangul.'],
  ['How to Study Korean · Unidad 0', 'https://www.howtostudykorean.com/unit0/', 'Tres lecciones gratis para leer hangul, con PDF descargable. En inglés. Muy clara con la pronunciación.'],
  ['Ryan Estrada · «Learn to Read Korean in 15 Minutes»', 'https://ryanestrada.com', 'El famoso cómic de un dibujante que vive en Busan: asocia cada letra a un dibujo. De él vienen muchos trucos que circulan.'],
  ['Talk To Me In Korean', 'https://talktomeinkorean.com', 'Lecciones y vídeos gratis en su web y en YouTube. Su libro «Hangeul Master» en español es de pago.'],
  ['Hunminjeongeum (Wikipedia)', 'https://en.wikipedia.org/wiki/Hunminjeongeum', 'La historia del libro de 1446 con el que el rey Sejong presentó el alfabeto y su lógica.']
];
