'use strict';
// Contenido fijo y PÚBLICO (nada personal). Solo hangul del que hay total seguridad;
// lo dudoso lleva verificar: true.

// Sitios conocidos por ciudad (alimentan "interés" en Ruta y tarjetas en Enseñar).
const CATALOGO = {
  seul: [
    { es: 'Ikseon-dong', ko: '익선동', romanizacion: 'Ikseon-dong' },
    { es: 'Barrio Seochon', ko: '서촌', romanizacion: 'Seochon' },
    { es: 'Mercado Namdaemun', ko: '남대문시장', romanizacion: 'Namdaemun Sijang' },
    { es: 'Hongdae', ko: '홍대', romanizacion: 'Hongdae' },
    { es: 'Coex', ko: '코엑스', romanizacion: 'Koekseu' },
    { es: 'Starfield Library', ko: '별마당 도서관', romanizacion: 'Byeolmadang Doseogwan' },
    { es: 'Parque y muralla de Naksan', ko: '낙산공원', romanizacion: 'Naksan Gongwon' },
    { es: 'Palacio Gyeongbokgung', ko: '경복궁', romanizacion: 'Gyeongbokgung' },
    { es: 'Palacio Changdeokgung', ko: '창덕궁', romanizacion: 'Changdeokgung' },
    { es: 'Barrio Bukchon Hanok', ko: '북촌한옥마을', romanizacion: 'Bukchon Hanok Maeul' },
    { es: 'Insadong', ko: '인사동', romanizacion: 'Insadong' },
    { es: 'Myeongdong', ko: '명동', romanizacion: 'Myeongdong' },
    { es: 'Mercado Gwangjang', ko: '광장시장', romanizacion: 'Gwangjang Sijang' },
    { es: 'Dongdaemun Design Plaza', ko: '동대문디자인플라자', romanizacion: 'Dongdaemun Dijain Peullaja' },
    { es: 'Torre N Seúl (Namsan)', ko: 'N서울타워', romanizacion: 'En Seoul Tawo' },
    { es: 'Estación de Seúl', ko: '서울역', romanizacion: 'Seoul-yeok' },
    { es: 'Aeropuerto de Incheon', ko: '인천국제공항', romanizacion: 'Incheon Gukje Gonghang' }
  ],
  andong: [
    { es: 'Templo Bongjeongsa', ko: '봉정사', romanizacion: 'Bongjeongsa' },
    { es: 'Acantilado Buyongdae', ko: '부용대', romanizacion: 'Buyongdae' },
    { es: 'Academia Dosan Seowon', ko: '도산서원', romanizacion: 'Dosan Seowon' },
    { es: 'Estación de Andong', ko: '안동역', romanizacion: 'Andong-yeok' }
  ],
  gyeongju: [
    { es: 'Aldea Gyochon', ko: '교촌마을', romanizacion: 'Gyochon Maeul' },
    { es: 'Puente Woljeonggyo', ko: '월정교', romanizacion: 'Woljeonggyo' },
    { es: 'Templo Bulguksa', ko: '불국사', romanizacion: 'Bulguksa' },
    { es: 'Gruta Seokguram', ko: '석굴암', romanizacion: 'Seokguram' },
    { es: 'Túmulos Daereungwon', ko: '대릉원', romanizacion: 'Daereungwon' },
    { es: 'Observatorio Cheomseongdae', ko: '첨성대', romanizacion: 'Cheomseongdae' },
    { es: 'Palacio Donggung y estanque Wolji', ko: '동궁과 월지', romanizacion: 'Donggung gwa Wolji' },
    { es: 'Calle Hwangridan-gil', ko: '황리단길', romanizacion: 'Hwangnidan-gil' },
    { es: 'Estación de Gyeongju (KTX)', ko: '경주역', romanizacion: 'Gyeongju-yeok', verificar: true, nota: 'Antes "Singyeongju"' }
  ],
  busan: [
    { es: 'Isla Dongbaekseom', ko: '동백섬', romanizacion: 'Dongbaekseom' },
    { es: 'Playa de Songdo', ko: '송도해수욕장', romanizacion: 'Songdo Haesuyokjang' },
    { es: 'Cheongsapo', ko: '청사포', romanizacion: 'Cheongsapo' },
    { es: 'BIFF Square', ko: 'BIFF광장', romanizacion: 'BIFF Gwangjang' },
    { es: 'Playa Haeundae', ko: '해운대해수욕장', romanizacion: 'Haeundae Haesuyokjang' },
    { es: 'Playa Gwangalli', ko: '광안리해수욕장', romanizacion: 'Gwangalli Haesuyokjang' },
    { es: 'Aldea cultural Gamcheon', ko: '감천문화마을', romanizacion: 'Gamcheon Munhwa Maeul' },
    { es: 'Mercado Jagalchi', ko: '자갈치시장', romanizacion: 'Jagalchi Sijang' },
    { es: 'Mercado Gukje', ko: '국제시장', romanizacion: 'Gukje Sijang' },
    { es: 'Templo Haedong Yonggungsa', ko: '해동용궁사', romanizacion: 'Haedong Yonggungsa' },
    { es: 'Estación de Busan', ko: '부산역', romanizacion: 'Busan-yeok' }
  ],
  jeonju: [
    { es: 'Aldea Hanok de Jeonju', ko: '전주한옥마을', romanizacion: 'Jeonju Hanok Maeul' },
    { es: 'Santuario Gyeonggijeon', ko: '경기전', romanizacion: 'Gyeonggijeon' },
    { es: 'Catedral de Jeondong', ko: '전동성당', romanizacion: 'Jeondong Seongdang' },
    { es: 'Mercado Nambu', ko: '남부시장', romanizacion: 'Nambu Sijang' },
    { es: 'Estación de Jeonju', ko: '전주역', romanizacion: 'Jeonju-yeok' }
  ]
};

// Frases útiles (pantalla completa).
// Frases útiles agrupadas por situación (pantalla completa). Solo frases de uso común y seguras.
const FRASES_SIT = [
  ['Básicas', [
    ['Hola', '안녕하세요', 'annyeonghaseyo'], ['Gracias', '감사합니다', 'gamsahamnida'],
    ['Perdón / lo siento', '죄송합니다', 'joesonghamnida'], ['¡Perdone! (llamar a alguien)', '저기요', 'jeogiyo'],
    ['Sí / No', '네 / 아니요', 'ne / aniyo'], ['No hablo coreano', '한국어를 못해요', 'hangugeoreul motaeyo'],
    ['¿Habla inglés?', '영어 하세요?', 'yeongeo haseyo?'], ['Más despacio, por favor', '천천히 말해 주세요', 'cheoncheonhi malhae juseyo'],
    ['Soy de España', '스페인 사람이에요', 'seupein saramieyo'], ['¿Dónde está el baño?', '화장실 어디예요?', 'hwajangsil eodiyeyo?']]],
  ['Taxi', [
    ['A esta dirección, por favor', '이 주소로 가 주세요', 'i jusoro ga juseyo'], ['Pare aquí, por favor', '여기 세워 주세요', 'yeogi sewo juseyo'],
    ['Me bajo aquí', '여기서 내릴게요', 'yeogiseo naerilgeyo'], ['Abra el maletero, por favor', '트렁크 열어 주세요', 'teureongkeu yeoreo juseyo'],
    ['¿Cuánto se tarda?', '얼마나 걸려요?', 'eolmana geollyeoyo?'], ['Más despacio, por favor (conducir)', '천천히 가 주세요', 'cheoncheonhi ga juseyo'],
    ['¿Aceptan tarjeta?', '카드 돼요?', 'kadeu dwaeyo?'], ['El recibo, por favor', '영수증 주세요', 'yeongsujeung juseyo']]],
  ['Hotel', [
    ['Quiero hacer el check-in', '체크인 할게요', 'chekeuin halgeyo'], ['Tengo una reserva', '예약했어요', 'yeyakhaesseoyo'],
    ['¿Puedo dejar el equipaje?', '짐 맡길 수 있어요?', 'jim matgil su isseoyo?'], ['¿A qué hora es el check-out?', '체크아웃은 몇 시예요?', 'chekeuauseun myeot siyeyo?'],
    ['¿Cuál es la contraseña del wifi?', '와이파이 비밀번호가 뭐예요?', 'waipai bimilbeonhoga mwoyeyo?'], ['No sale agua caliente', '뜨거운 물이 안 나와요', 'tteugeoun muri an nawayo'],
    ['Más toallas, por favor', '수건 더 주세요', 'sugeon deo juseyo'], ['¿Me pide un taxi?', '택시 불러 주세요', 'taeksi bulleo juseyo']]],
  ['Restaurante', [
    ['Somos dos', '두 명이요', 'du myeongiyo'], ['¿Tienen carta en inglés?', '영어 메뉴 있어요?', 'yeongeo menyu isseoyo?'],
    ['¿Qué está bueno aquí?', '뭐가 맛있어요?', 'mwoga masisseoyo?'], ['Esto, por favor', '이거 주세요', 'igeo juseyo'],
    ['Menos picante, por favor', '덜 맵게 해 주세요', 'deol maepge hae juseyo'], ['No puedo comer picante', '매운 거 못 먹어요', 'maeun geo mot meogeoyo'],
    ['Sin carne, por favor', '고기 빼 주세요', 'gogi ppae juseyo'], ['Tengo alergia', '알레르기가 있어요', 'allereugiga isseoyo'],
    ['Agua, por favor', '물 주세요', 'mul juseyo'], ['Más acompañamientos, por favor', '반찬 더 주세요', 'banchan deo juseyo'],
    ['Para llevar', '포장해 주세요', 'pojanghae juseyo'], ['Para tomar aquí', '여기서 먹을게요', 'yeogiseo meogeulgeyo'],
    ['¡Está rico!', '맛있어요', 'masisseoyo'], ['La cuenta, por favor', '계산해 주세요', 'gyesanhae juseyo'],
    ['Pagar por separado', '따로 계산해 주세요', 'ttaro gyesanhae juseyo'], ['He comido muy bien (al salir)', '잘 먹었습니다', 'jal meogeotseumnida']]],
  ['Compras', [
    ['¿Cuánto cuesta?', '얼마예요?', 'eolmayeyo?'], ['¿Aceptan tarjeta?', '카드 돼요?', 'kadeu dwaeyo?'],
    ['Rebájemelo, por favor', '깎아 주세요', 'kkakka juseyo'], ['No necesito bolsa', '봉투 필요 없어요', 'bongtu piryo eopseoyo'],
    ['¿Me lo puedo probar?', '입어 봐도 돼요?', 'ibeo bwado dwaeyo?'], ['¿Hacen devolución de impuestos?', '택스 리펀 돼요?', 'taekseu ripeon dwaeyo?']]],
  ['Transporte', [
    ['Un billete, por favor', '표 한 장 주세요', 'pyo han jang juseyo'], ['Dos billetes, por favor', '표 두 장 주세요', 'pyo du jang juseyo'],
    ['¿Qué número de salida es?', '몇 번 출구예요?', 'myeot beon chulguyeyo?'], ['¿Dónde se compra el billete?', '표는 어디서 사요?', 'pyoneun eodiseo sayo?'],
    ['Recargue la tarjeta de transporte, por favor', '교통카드 충전해 주세요', 'gyotongkadeu chungjeonhae juseyo']]],
  ['Farmacia', [
    ['¿Dónde hay una farmacia?', '약국 어디예요?', 'yakguk eodiyeyo?'], ['Me duele aquí', '여기 아파요', 'yeogi apayo'],
    ['Tengo fiebre', '열이 나요', 'yeori nayo'], ['Medicina para el resfriado, por favor', '감기약 주세요', 'gamgiyak juseyo'],
    ['Un analgésico, por favor', '진통제 주세요', 'jintongje juseyo'], ['Algo para la diarrea, por favor', '지사제 주세요', 'jisaje juseyo'],
    ['Tengo alergia', '알레르기가 있어요', 'allereugiga isseoyo'], ['Tengo que ir al hospital', '병원에 가야 해요', 'byeongwone gaya haeyo']]],
  ['Emergencia', [
    ['¡Ayuda!', '도와주세요', 'dowajuseyo'], ['Llame a la policía', '경찰 불러 주세요', 'gyeongchal bulleo juseyo'],
    ['Llame a una ambulancia', '구급차 불러 주세요', 'gugeupcha bulleo juseyo'], ['Estoy perdido/a', '길을 잃었어요', 'gireul ireosseoyo'],
    ['He perdido el pasaporte', '여권을 잃어버렸어요', 'yeogwoneul ireobeoryeosseoyo'], ['He perdido la cartera', '지갑을 잃어버렸어요', 'jigabeul ireobeoryeosseoyo']]]
];
const FRASES = FRASES_SIT.flatMap(([, fs]) => fs);

// Guía de Corea: [título, [puntos]]. "VERIFICAR" = comprobar antes de fiarse.
const GUIA = [
  ['T-money y transporte', [
    'Tarjeta recargable para metro, bus y muchos taxis. Se compra y recarga en tiendas 24 h (GS25, CU, 7-Eleven) y máquinas del metro.',
    'La recarga suele ser solo en efectivo. VERIFICAR.',
    'Pásala al entrar y también al salir del bus: así se aplica el descuento de transbordo.',
    'Bus: se sube por delante; para bajar pulsa el timbre y sal por la puerta central.'
  ]],
  ['Taxis', [
    'Enséñale al taxista la tarjeta en hangul (pestaña Enseñar).',
    'Taxis normales: naranjas, plateados o blancos. Los negros (de lujo) son más caros. VERIFICAR tarifas.',
    'Se paga con tarjeta o T-money en la mayoría. Cinturón obligatorio.'
  ]],
  ['Propinas', ['No se dejan propinas. No es costumbre y puede extrañar.']],
  ['Zapatos', [
    'Quítatelos en casas, hanok, algunos alojamientos, templos y restaurantes donde se come en el suelo.',
    'Señal: zapatos en la entrada o un escalón. Lleva calcetines decentes.'
  ]],
  ['Enchufes', ['Tipo C/F y 220 V, como en España. No hace falta adaptador.']],
  ['Apps', [
    'Mapas: Naver Map o KakaoMap (Google Maps funciona mal para rutas a pie o en coche).',
    'Taxis: Kakao T. Traductor: Papago. Trenes: Korail Talk.',
    'Las apps cambian: VERIFICAR que funcionan con número y tarjeta extranjeros antes de ir.'
  ]],
  ['Pagos', [
    'La tarjeta se acepta casi en todas partes, incluso para importes pequeños.',
    'Lleva algo de efectivo para mercados, puestos callejeros y recargar la T-money.',
    'Algunas máquinas y apps no aceptan tarjetas extranjeras.'
  ]],
  ['Comida', [
    'Los banchan (platitos de acompañamiento) son gratis y se pueden repetir.',
    'El agua suele ser gratis y de autoservicio.',
    'No claves los palillos de pie en el arroz. El cuenco de arroz se deja en la mesa (no se levanta).',
    'Algunos platos (p. ej., barbacoa) piden mínimo 2 raciones.',
    'Sonarse la nariz en la mesa está mal visto.'
  ]],
  ['Etiqueta', [
    'Saludo con una ligera inclinación de cabeza.',
    'Da y recibe cosas (dinero, tarjetas) con las dos manos.',
    'Habla bajo en el metro. Respeta los asientos prioritarios (los rosas, para embarazadas).',
    'Hay pocas papeleras: guarda la basura hasta encontrar una.'
  ]],
  ['Seguridad y emergencias', [
    'País muy seguro, incluso de noche. Ojo con patinetes y bicis por la acera.',
    'Policía: 112. Ambulancia y bomberos: 119.',
    'Línea turística con atención en varios idiomas: 1330.',
    'Teléfono del seguro: pestaña Seguro.'
  ]],
  ['Entrada al país', [
    'K-ETA y tarjeta de llegada: comprobar si hacen falta para tu fecha. VERIFICAR en la web oficial.'
  ]],
  ['Leer hangul en 10 minutos', [
    'El hangul es un alfabeto, no ideogramas: 14 consonantes y 10 vocales básicas que se agrupan en bloques de sílaba (consonante + vocal + consonante final opcional).',
    'Vocales verticales (a la derecha de la consonante): ㅏ a, ㅓ eo (una o abierta), ㅣ i. Horizontales (debajo): ㅗ o, ㅜ u, ㅡ eu (una u sin redondear).',
    'Consonantes clave: ㄱ g/k, ㄴ n, ㄷ d/t, ㄹ r/l, ㅁ m, ㅂ b/p, ㅅ s, ㅇ muda al inicio y "ng" al final, ㅈ j, ㅎ h.',
    'Ejemplos: 서울 = 서 (s+eo) + 울 (u+l) = Seo-ul. 부산 = Bu-san. 김치 = Kim-chi.',
    'Truco: rótulos útiles que verás mucho: 출구 (salida), 입구 (entrada), 화장실 (baño), 역 (estación), 약국 (farmacia).'
  ]],
  ['Metro y KTX', [
    'Cada línea tiene número y color. Las estaciones tienen número de salida (출구): Naver Map te dice cuál usar y ahorra muchos paseos.',
    'Los últimos metros salen hacia medianoche. VERIFICAR en Naver Map la víspera si volvéis tarde.',
    'En el andén se hace cola en las marcas del suelo, a los lados de las puertas.',
    'KTX: el billete indica coche (호차) y asiento. Los coches están numerados en el andén; hay sitio para maletas al final de cada coche. Sed puntuales: no esperan.'
  ]],
  ['Clima en noviembre', [
    'Otoño frío y seco: en Seúl, de unos 3-5 °C por la mañana a 12-14 °C por la tarde; Busan es más templado. VERIFICAR la previsión.',
    'Principios de noviembre es aún época de hojas rojas y doradas (danpung) en palacios y templos.',
    'Ropa por capas: los interiores (metro, tiendas, suelos con calefacción ondol) están calientes y la calle fría.'
  ]],
  ['Tiendas 24 h', [
    'GS25, CU, 7-Eleven y Emart24 están por todas partes: comida preparada, gimbap triangular, ramyeon con máquina de agua caliente, café, cajero, recarga T-money.',
    'Muchas tienen mesas para comer allí mismo, incluso fuera. Ofertas 1+1 y 2+1 en bebidas y snacks.'
  ]],
  ['Baños', [
    'Hay baños públicos gratis y limpios en metro, estaciones, parques y centros comerciales.',
    'En algunos baños antiguos el papel se tira a la papelera, no al váter: fíjate en el cartel.',
    'Lleva pañuelos: en algunos baños de mercados no hay papel.'
  ]],
  ['Internet y móvil', [
    'Wifi gratis en metro, cafés y muchas calles; aun así, la eSIM con datos es muy útil para Naver Map y Papago.',
    'Algunas apps coreanas piden número coreano para registrarse: tenedlas probadas antes del viaje.'
  ]],
  ['Compras y tax free', [
    'En tiendas con el cartel "Tax Free" se puede pedir la devolución del IVA con el pasaporte; en muchas te lo descuentan en el momento.',
    'El importe mínimo y el límite cambian: VERIFICAR en la tienda. Guarda los recibos; en el aeropuerto hay quioscos de devolución.'
  ]],
  ['Salud y farmacias', [
    'Farmacia = 약국 (yakguk). Hay muchas, pero cierran pronto y algunos domingos; en zonas turísticas suele haber alguna abierta.',
    'Los medicamentos básicos (analgésicos, resfriado) se piden en el mostrador: frases en Corea → Frases → Farmacia.',
    'Para algo serio: llamar al seguro (pestaña Seguro) antes de pagar. Urgencias: 119.'
  ]],
  ['Beber a la coreana', [
    'Soju (aguardiente suave, unos 16-17 %), makgeolli (vino de arroz turbio, ideal con tortitas pajeon) y cerveza con pollo frito (chimaek).',
    'Se sirve a los demás con las dos manos y no a uno mismo; no se rellena un vaso que no está vacío.',
    'Ante alguien mayor, se bebe girando un poco la cabeza a un lado: es un gesto de respeto.'
  ]],
  ['Templos', [
    'Ropa discreta, hablar bajo y no pisar el umbral de las salas. Si entras, descálzate y no te pongas delante del Buda central.',
    'Las fotos dentro de las salas suelen estar mal vistas: mira si hay cartel.',
    'Muchos templos ofrecen templestay (dormir y vivir la rutina monástica) con reserva.'
  ]],
  ['Fechas de vuestro viaje', [
    '11 de noviembre: Pepero Day, el "día de San Valentín" de los palitos de chocolate Pepero (11/11 parecen cuatro palitos). Tiendas llenas de cajas de regalo.',
    'Mediados de noviembre: Suneung, el examen de acceso a la universidad. Ese día se retrasa la entrada al trabajo, hay policía llevando a estudiantes rezagados y se evitan despegues y aterrizajes durante la prueba de comprensión oral de inglés. La fecha exacta de 2026: VERIFICAR.',
    'Noviembre es temporada de kimjang: las familias preparan el kimchi para el invierno. Verás montañas de coles en los mercados.'
  ]],
  ['Lo básico (Lonely Planet)', [
    'Moneda: won (₩). Idioma: coreano. Hora: 9 horas más que el meridiano de Greenwich (8 más que la España peninsular en noviembre).',
    'Cajeros: busca los que dicen "Global"; aceptan tarjetas extranjeras. Pocos abren 24 h.',
    'Las tarjetas se aceptan casi en todas partes, salvo en el campo.',
    'Noviembre es temporada baja: frío y, a final de mes, puede nevar. Buena época para museos.',
    'Teléfonos: policía 112, ambulancia y bomberos 119, información turística en inglés 1330.',
    'Visado: la guía dice 90 días de estancia al llegar para la mayoría de europeos. VERIFICAR (K-ETA / e-Arrival).']],
  ['Consejos de la Lonely Planet', [
    'La tarjeta T-money sirve para metro, bus y también para pagar muchos taxis.',
    'En las oficinas de turismo hay visitas guiadas gratuitas con voluntarios que hablan otros idiomas.',
    'Compras de más de 30.000 ₩ en tiendas "Global Refund" / "Tax Free": se puede recuperar el IVA al salir del país. VERIFICAR el importe actual.',
    'Las guesthouses en hanok tienen pocas habitaciones: mejor reservar.',
    'Los fines de semana las rutas de montaña se llenan: mejor entre semana.']],
  ['Qué llevar (Lonely Planet)', [
    'Zapatos fáciles de quitar (te descalzarás a menudo).',
    'Tarjeta de crédito, diccionario o frases (están en esta app).',
    'Analgésicos, botiquín y protector solar.',
    'Linterna y candado (para taquillas de hostales).',
    'Enchufe: en Corea es igual que en España, no hace falta adaptador.']],
  ['En la mesa (Lonely Planet)', [
    'Muchas veces se come en el suelo: descálzate en la entrada y siéntate en cojines.',
    'Los platos principales vienen con arroz, sopa, kimchi y banchan incluidos; no hace falta acabarlos todos.',
    'La cuchara es para el arroz, la sopa y lo líquido; los palillos para lo demás. No se toca la comida con los dedos, salvo al hacer ssam (envolver en hojas).',
    'Nunca dejes los palillos ni la cuchara clavados en el arroz: solo se hace con la comida ofrecida a los difuntos.',
    'Empiezan a comer los mayores. Se sirve la bebida a los demás, nunca a uno mismo, y con las dos manos.',
    'Para llamar al camarero: "jeogiyo" (저기요) o "yeogiyo" (여기요). No hay propina; los sitios caros pueden añadir un 10 % de servicio.']],
  ['Saber estar (Lonely Planet)', [
    'Saludo: una inclinación breve al llegar y al irse.',
    'Da y recibe cosas (dinero, tarjetas, regalos) con las dos manos.',
    'Evita discusiones o situaciones que hagan "perder la cara" a alguien; si cambian de tema, síguelo.']]
];

// Recomendaciones de la guía Lonely Planet Korea (2016). Nombre y hangul de la guía;
// descripciones resumidas. top = "elección del autor". Restaurantes y cafés: en data/comer.json (pestaña Comer).
const R = (es, ko, tipo, nota, extra = {}) => ({ es, ko, tipo, nota, lp: true, ...extra });
const LP = {
  seul: [
    R('Santuario Jongmyo', '종묘', 'Santuario', 'Santuario real de la dinastía Joseon (Unesco).', { top: true }),
    R('Templo Jogye-sa', '조계사', 'Templo', 'Templo budista principal, en pleno centro.', { top: true }),
    R('Arroyo Cheonggyecheon', '청계천', 'Paseo', 'Arroyo urbano recuperado para pasear.', { top: true }),
    R('Palacio Deoksugung', '덕수궁', 'Palacio', 'Palacio junto al Ayuntamiento; cambio de guardia.', { top: true }),
    R('Museo Nacional de Corea', '국립중앙박물관', 'Museo', 'El gran museo de historia y arte del país.', { top: true }),
    R('Memorial de la Guerra de Corea', '전쟁 기념관', 'Museo', 'Historia militar y de la Guerra de Corea.', { top: true }),
    R('Templo Gilsang-sa', '길상사', 'Templo', 'Templo tranquilo en una ladera del norte.', { top: true }),
    R('Templo Bongeun-sa', '봉은사', 'Templo', 'Templo budista en medio de Gangnam.', { top: true }),
    R('Museo del Mueble Coreano', '한국가구박물관', 'Museo', 'Casas y muebles tradicionales; visita guiada con reserva.', { top: true, verificar: true }),
    R('Mercado de Dongdaemun', '동대문시장', 'Mercado', 'Enorme zona de mercados y tiendas, abierta hasta tarde.', { top: true }),
    R('Palacio Changgyeonggung', '창경궁', 'Palacio', 'Palacio real junto a Changdeokgung, con invernadero.'),
    R('Aldea hanok de Namsangol', '남산골한옥마을', 'Aldea', 'Casas tradicionales restauradas al pie de Namsan.'),
    R('Museo Nacional del Folclore', '국립민속박물관', 'Museo', 'Vida tradicional coreana, dentro de Gyeongbokgung.'),
    R('Plaza Gwanghwamun', '광화문광장', 'Plaza', 'Gran plaza con las estatuas del rey Sejong y el almirante Yi.'),
    R('Catedral de Myeongdong', '명동성당', 'Iglesia', 'Catedral católica neogótica de 1898.'),
    R('Barrio de murales Ihwa', '이화 벽화 마을', 'Barrio', 'Calles en cuesta con murales, junto a la muralla.'),
    R('Prisión de Seodaemun', '서대문형무소역사관', 'Museo', 'Antigua cárcel de la ocupación japonesa.'),
    R('Museo de Historia de Seúl', '서울역사박물관', 'Museo', 'La historia de la ciudad, con gran maqueta.'),
    R('Ayuntamiento de Seúl', '서울시청사', 'Arquitectura', 'Edificio moderno en forma de ola junto al antiguo.'),
    R('Seoul Forest', '서울숲', 'Parque', 'Gran parque junto al río Han.'),
    R('Santuario de mártires de Jeoldusan', '절두산 순교성지', 'Museo', 'Memorial de los mártires católicos, junto al río.'),
    R('Museo de la Guerra y los Derechos de la Mujer', '전쟁과여성인권박물관', 'Museo', 'Sobre las mujeres de consuelo.'),
    R('Santuario Inwangsan Guksadang', '인왕산 국사당', 'Santuario', 'Santuario chamánico en la montaña Inwang.'),
    R('Parque Olímpico', '올림픽 공원', 'Parque', 'Parque de los Juegos de 1988 con esculturas.'),
    R('Tumbas reales de Seonjeongneung', '선정릉', 'Tumbas', 'Tumbas Joseon en un parque en pleno Gangnam.'),
    R('Lotte World', '롯데월드', 'Ocio', 'Parque de atracciones cubierto.'),
    R('Parque infantil de Seúl', '서울 어린이대공원', 'Parque', 'Gran parque con zoo pequeño.'),
    R('Dragon Hill Spa', '드래곤힐스파', 'Sauna', 'Jjimjilbang (sauna coreana) grande en Yongsan.'),
    R('Silloam Sauna', '실로암사우나찜질방', 'Sauna', 'Jjimjilbang 24 h junto a la estación de Seúl.'),
    R('Spa Lei', '스파레이', 'Sauna', 'Spa solo para mujeres en Gangnam.'),
    R('Centro Cultural Sejong', '세종문화회관', 'Teatro', 'Gran sala de espectáculos en Gwanghwamun.'),
    R('Seoul Arts Center', '서울 예술의전당', 'Teatro', 'Ópera, conciertos y exposiciones.'),
    R('Mercado de electrónica de Yongsan', '용산전자랜드', 'Mercado', 'Electrónica y componentes.'),
    R('Rastro popular de Seúl', '서울풍물시장', 'Mercado', 'Antigüedades y objetos curiosos.'),
    R('Tercer túnel de infiltración (DMZ)', '제3땅굴', 'Excursión', 'Túnel norcoreano en la zona desmilitarizada; solo con tour organizado.')
  ],
  andong: [
    R('Aldea Hahoe', '안동 하회마을', 'Aldea', 'Lo mejor de la zona (Unesco). Ve temprano por la mañana.', { top: true }),
    R('Museo de Máscaras de Hahoe', '', 'Museo', 'Máscaras tradicionales coreanas y del mundo, a 2 km de la aldea.'),
    R('Academia Byeongsan Seowon', '병산서원', 'Academia', 'Antigua escuela confuciana (1572) junto al río.'),
    R('Aldea folclórica de Andong', '안동민속촌', 'Aldea', 'Casas tradicionales trasladadas, en una ladera sobre la ciudad.'),
    R('Museo del Folclore de Andong', '안동 민속박물관', 'Museo', 'Vida y costumbres tradicionales de la región.'),
    R('Museo del Soju', '소주 박물관', 'Museo', 'Sobre el soju de Andong (45 %), patrimonio cultural.'),
    R('Buda de Jebiwon', '제비원', 'Santuario', 'Gran Buda tallado en la roca, a las afueras.')
  ],
  gyeongju: [
    R('Museo Nacional de Gyeongju', '국립경주박물관', 'Museo', 'Quizá el mejor museo de historia de Corea: coronas de oro Silla y la gran campana.'),
    R('Fortaleza Banwolseong', '반월성', 'Ruinas', 'Restos del palacio Silla junto al observatorio.'),
    R('Pagoda de Bunhwang-sa', '분황사', 'Pagoda', 'La pagoda fechada más antigua de Corea, de ladrillo.'),
    R('Tumbas de Noseo-dong', '노서동 고분', 'Tumbas', 'Túmulos Silla gratuitos junto a la zona comercial.'),
    R('Templo Golgul-sa', '골굴사', 'Templo', 'Buda tallado en la roca y arte marcial budista (sunmudo).'),
    R('Tumbas reales de Samneung', '삼릉', 'Tumbas', 'Tres tumbas en un bosque de pinos, al pie de Namsan.'),
    R('Aldea de Yangdong', '경주 양동마을', 'Aldea', 'Aldea tradicional (Unesco), menos turística que Hahoe.'),
    R('Lago Bomun', '보문 단지', 'Zona', 'Lago con hoteles y paseo, a 5 km del centro.'),
    R('Museo de Arte Woomyang', '우양미술관', 'Museo', 'Arte contemporáneo junto al lago Bomun.'),
    R('Templo Girim-sa', '기림사', 'Templo', 'Templo tranquilo cerca de Golgul-sa.'),
    R('Dongnakdang', '독락당', 'Histórico', 'Casa de un erudito Joseon, cerca de la aldea de Yangdong.'),
    R('Templo Bogyeong-sa', '보경사', 'Templo', 'Templo con cascadas, ya en Pohang (1 h).')
  ],
  busan: [
    R('Templo Beomeo-sa', '범어사', 'Templo', 'Gran templo en la montaña Geumjeong.'),
    R('Fortaleza de Geumjeong', '금정산성', 'Fortaleza', 'Murallas en la montaña; se combina con el teleférico.'),
    R('Parque costero Igidae', '이기대', 'Paseo', 'Sendero junto a los acantilados con vistas al puente Gwangan.'),
    R('Parque Taejongdae', '태종대유원지', 'Parque', 'Acantilados y faro en el extremo sur de la isla Yeongdo.'),
    R('Cementerio de la ONU', '재한 유엔 기념공원', 'Memorial', 'Cementerio de soldados de la ONU caídos en la guerra.'),
    R('Parque Yongdusan', '용두산 공원', 'Parque', 'Parque con la Torre de Busan, en el centro.'),
    R('Museo de Historia Moderna de Busan', '부산 근대역사관', 'Museo', 'Historia de la ciudad en el siglo XX.'),
    R('Mercado Bujeon', '부전시장', 'Mercado', 'Gran mercado local, muy auténtico.'),
    R('Teleférico del parque Geumgang', '금강공원 케이블카', 'Teleférico', 'Sube a la montaña Geumjeong.'),
    R('Templo Seokbul-sa', '석불사', 'Templo', 'Budas tallados en la roca en la montaña.'),
    R('Museo de Arte de Busan', '부산 시립 미술관', 'Museo', 'Arte coreano moderno, en Haeundae.'),
    R('Bus turístico City Tour Busan', '부산 시티 투어버스', 'Tour', 'Bus turístico por la ciudad.'),
    R('Muelle de Mipo (barcos)', '미포 선착장', 'Barco', 'Paseos en barco desde Haeundae.')
  ],
  jeonju: [
    R('Escuela confuciana Jeonju Hyanggyo', '전주향교', 'Histórico', 'Antigua escuela confuciana con árboles enormes (ginkgos).'),
    R('Museo del Vino Tradicional', '전통술박물관', 'Museo', 'Licores tradicionales coreanos; a veces con cata.'),
    R('Puerta Pungnammun', '풍남문', 'Puerta', 'Antigua puerta de la muralla, junto al mercado Nambu.'),
    R('Mirador Omokdae', '오목대', 'Mirador', 'Pabellón en una colina con vistas a toda la aldea hanok.'),
    R('Aldea Jaman (murales)', '자만마을', 'Barrio', 'Callejuelas llenas de murales de colores.'),
    R('Jeonju Gaeksa', '전주 객사', 'Histórico', 'Antigua casa de huéspedes oficial, en el centro.'),
    R('Museo del Hanji', '전주한지박물관', 'Museo', 'El papel tradicional coreano, especialidad de Jeonju.'),
    R('Sala de Artesanía', '공예품전시관', 'Artesanía', 'Artesanía local en la aldea hanok.'),
    R('Parque provincial Moaksan', '모악산도립공원', 'Parque', 'Montaña con el templo Geumsan-sa.')
  ]
};


// Imprescindibles: descripción breve (resumida de la Lonely Planet 2016 cuando la trae; "LP")
// y artículo de Wikipedia en inglés del que la app toma la foto (con conexión; luego se guarda).
const I = (es, ko, desc, wiki, lp = true) => ({ es, ko, desc, wiki, lp });
const IMPRES = {
  seul: [
    I('Palacio Gyeongbokgung', '경복궁', 'El gran palacio de la dinastía Joseon, destruido y reconstruido varias veces. Cambio de guardia en la puerta Gwanghwamun; dedícale al menos medio día.', 'Gyeongbokgung'),
    I('Palacio Changdeokgung', '창덕궁', 'El más bonito de los palacios de Seúl, Patrimonio de la Humanidad. El jardín secreto (Huwon) solo se ve en visita guiada, con entrada aparte.', 'Changdeokgung'),
    I('Barrio Bukchon Hanok', '북촌한옥마을', 'Unas 900 casas tradicionales entre los dos palacios: la mayor concentración de hanok de Seúl. Es zona residencial: hablar bajo.', 'Bukchon_Hanok_Village'),
    I('Santuario Jongmyo', '종묘', 'Santuario confuciano rodeado de bosque donde se veneran las tablillas de los reyes Joseon. Patrimonio de la Humanidad.', 'Jongmyo'),
    I('Torre N Seúl (Namsan)', 'N서울타워', 'La torre de la colina de Namsan, en pleno centro: vistas de toda la ciudad, mejor al atardecer.', 'N_Seoul_Tower', false)],
  andong: [
    I('Aldea Hahoe', '안동 하회마을', 'Aldea tradicional Patrimonio de la Humanidad donde aún viven unas 230 personas con costumbres antiguas. Llega temprano; el museo de máscaras está a 2 km.', 'Hahoe_Folk_Village'),
    I('Academia Dosan Seowon', '도산서원', 'Academia confuciana fundada en honor al sabio Yi Hwang (Toegye), en un paraje tranquilo junto al río. Forma parte de las academias Patrimonio de la Humanidad.', 'Dosan_Seowon', false),
    I('Puente Woryeonggyo', '월영교', 'Puente peatonal de madera sobre el lago de la presa de Andong; muy bonito iluminado al anochecer.', 'Woryeonggyo', false)],
  gyeongju: [
    I('Templo Bulguksa', '불국사', 'La joya de la arquitectura Silla: terrazas de piedra entre pinos y jardines, Patrimonio de la Humanidad. A unos 16 km del centro.', 'Bulguksa'),
    I('Gruta Seokguram', '석굴암', 'Gruta en la montaña sobre Bulguksa con un gran Buda sedente que mira hacia el mar del Este, rodeado de guardianes. Patrimonio de la Humanidad.', 'Seokguram'),
    I('Túmulos Daereungwon', '대릉원', 'Parque amurallado con 23 túmulos de reyes Silla, como colinas de hierba. Se puede entrar en la tumba Cheonmachong (del Caballo Celestial).', 'Daereungwon'),
    I('Observatorio Cheomseongdae', '첨성대', 'El observatorio astronómico más antiguo de Asia oriental (siglo VII). Sus 366 piedras y 30 hileras evocan el calendario.', 'Cheomseongdae'),
    I('Palacio Donggung y estanque Wolji', '동궁과 월지', 'Antiguo jardín de recreo del palacio Silla junto a un estanque. Precioso de noche, con los pabellones iluminados.', 'Donggung_Palace_and_Wolji_Pond')],
  busan: [
    I('Aldea cultural Gamcheon', '감천문화마을', 'Antiguo barrio humilde en la ladera que en 2009 se llenó de arte: casas de colores, cafés y galerías. Compra el mapa y sigue la ruta.', 'Gamcheon_Culture_Village'),
    I('Templo Haedong Yonggungsa', '해동용궁사', 'Templo budista sobre las rocas junto al mar, algo poco habitual en Corea, donde casi todos están en la montaña.', 'Haedong_Yonggungsa', false),
    I('Playa Haeundae', '해운대해수욕장', 'La playa más famosa de Corea: unos 2 km de arena con paseo y rascacielos.', 'Haeundae_Beach')],
  jeonju: [
    I('Aldea Hanok de Jeonju', '전주한옥마을', 'Más de 800 casas tradicionales en pleno centro, con teterías, talleres y tiendas. Mejor a primera hora o al atardecer.', 'Jeonju_Hanok_Village'),
    I('Catedral de Jeondong', '전동성당', 'Iglesia de ladrillo rojo (1908-1914) levantada donde fueron ejecutados católicos coreanos; mezcla estilos románico y bizantino.', 'Jeondong_Catholic_Church')]
};

// Artículo de Wikipedia (en inglés) por hangul, para poner foto a más sitios. Si no existe, la app lo ignora.
const WIKI = {
  '인사동': 'Insadong', '명동': 'Myeong-dong', '광장시장': 'Gwangjang_Market', '동대문디자인플라자': 'Dongdaemun_Design_Plaza',
  '덕수궁': 'Deoksugung', '조계사': 'Jogyesa', '청계천': 'Cheonggyecheon', '국립중앙박물관': 'National_Museum_of_Korea',
  '전쟁 기념관': 'War_Memorial_of_Korea', '길상사': 'Gilsangsa', '봉은사': 'Bongeunsa', '동대문시장': 'Dongdaemun_Market',
  '창경궁': 'Changgyeonggung', '남산골한옥마을': 'Namsangol_Hanok_Village', '국립민속박물관': 'National_Folk_Museum_of_Korea',
  '광화문광장': 'Gwanghwamun_Plaza', '명동성당': 'Myeongdong_Cathedral', '이화 벽화 마을': 'Ihwa_Mural_Village',
  '서대문형무소역사관': 'Seodaemun_Prison', '서울역사박물관': 'Seoul_Museum_of_History', '서울시청사': 'Seoul_City_Hall',
  '서울숲': 'Seoul_Forest', '올림픽 공원': 'Olympic_Park,_Seoul', '선정릉': 'Seonjeongneung', '롯데월드': 'Lotte_World',
  '세종문화회관': 'Sejong_Center', '서울 예술의전당': 'Seoul_Arts_Center', '제3땅굴': 'Third_Tunnel_of_Aggression',
  '서울역': 'Seoul_station', '익선동': 'Ikseon-dong', '남대문시장': 'Namdaemun_Market',
  '병산서원': 'Byeongsan_Seowon', '봉정사': 'Bongjeongsa', '안동역': 'Andong_station',
  '국립경주박물관': 'Gyeongju_National_Museum', '분황사': 'Bunhwangsa', '골굴사': 'Golgulsa', '경주 양동마을': 'Yangdong_Folk_Village',
  '반월성': 'Wolseong_(palace)', '삼릉': 'Samneung', '보문 단지': 'Bomun_Lake_Resort', '황리단길': 'Hwangnidan-gil',
  '범어사': 'Beomeosa', '금정산성': 'Geumjeongsanseong', '이기대': 'Igidae', '태종대유원지': 'Taejongdae',
  '재한 유엔 기념공원': 'United_Nations_Memorial_Cemetery', '용두산 공원': 'Yongdusan_Park', '광안리해수욕장': 'Gwangalli_Beach',
  '자갈치시장': 'Jagalchi_Market', '국제시장': 'Gukje_Market', '부산역': 'Busan_station', '부산 시립 미술관': 'Busan_Museum_of_Art',
  '경기전': 'Gyeonggijeon', '전주향교': 'Jeonju_Hyanggyo', '풍남문': 'Pungnammun', '오목대': 'Omokdae', '모악산도립공원': 'Moaksan'
};
// Alias para reconocer sitios en el texto del itinerario cuando el nombre no basta.
const ALIAS = { '서울역사박물관': ['museo de historia'], '전주한옥마을': ['hanok village'], 'N서울타워': ['n seoul tower', 'namsan'], '동궁과 월지': ['donggung', 'wolji'],
  '대릉원': ['daereungwon', 'cheonmachong'], '안동 하회마을': ['hahoe'], '하회마을': ['hahoe'], '해운대해수욕장': ['playa de haeundae'], '전동성당': ['jeondong'],
  '황리단길': ['hwangnidan'], '국립경주박물관': ['museo nacional de gyeongju'] };

// Historia breve de cada ciudad (resumida de la Lonely Planet 2016 —LP— y completada con datos generales).
const HISTORIA = {
  seul: { lp: true, txt: [
    'En 1392 el general Yi Seong-gye derrocó a la dinastía Goryeo y fundó la dinastía Joseon, la más larga de Corea (1392-1910). (LP)',
    'En 1394 eligió Hanyang, la actual Seúl, como capital, siguiendo la geomancia (pungsu), y adoptó el neoconfucianismo como doctrina oficial. (LP)',
    'En 1396 rodeó la ciudad con una gran muralla; aún queda en pie cerca del 70 %, con puertas como Namdaemun y Dongdaemun. (LP)',
    'Tras la ocupación japonesa (1910-1945) y la destrucción de la guerra de Corea (1950-1953), la ciudad se reconstruyó y creció a toda velocidad hasta ser la gran metrópoli de hoy.'] },
  andong: { lp: true, txt: [
    'Andong es el corazón de la cultura confuciana de los yangban, la aristocracia de la época Joseon.',
    'Aquí vivió y enseñó el sabio Yi Hwang (Toegye); la academia Dosan Seowon se fundó en su honor.',
    'La aldea Hahoe es el hogar del clan Ryu desde hace siglos y conserva la danza de máscaras, de origen ritual.',
    'En 1976 la presa de Andong inundó parte del valle: muchas casas tradicionales se trasladaron a la aldea folclórica. (LP)',
    'Hoy es famosa por su caballa salada, su soju fuerte y sus máscaras de madera. (LP)'] },
  gyeongju: { lp: true, txt: [
    'En el año 57 a. C., más o menos cuando Julio César conquistaba la Galia, Gyeongju se convirtió en la capital del reino Silla, y lo fue durante casi mil años. (LP)',
    'En el siglo VII, con el rey Munmu, Silla conquistó los reinos vecinos de Goguryeo y Baekje y Gyeongju pasó a ser la capital de casi toda la península. (LP)',
    'Llegó a tener cerca de un millón de habitantes, pero Silla cayó por divisiones internas e invasiones. (LP)',
    'El reino terminó en el año 935.',
    'Por eso la llaman "el museo sin muros": tiene más tumbas, templos y ruinas que ningún otro lugar de Corea. Se restauró mucho a partir de los años 70. (LP)'] },
  busan: { lp: true, txt: [
    'Segunda ciudad del país y su gran puerto, encajada entre montañas y playas. (LP)',
    'Durante la guerra de Corea (1950-1953) fue uno de los pocos sitios que no cayó: capital provisional y refugio de cientos de miles de desplazados.',
    'De esa época vienen barrios como Gamcheon, levantado en la ladera por refugiados, y el mercado Gukje; el Cementerio de la ONU recuerda a los soldados caídos.',
    'Hoy es una ciudad animada de mercados de pescado, playas y festival de cine internacional (BIFF). (LP)'] },
  jeonju: { lp: true, txt: [
    'Jeonju es la cuna de la dinastía Joseon: de aquí procedía el clan Yi del rey fundador. (LP)',
    'El santuario Gyeonggijeon guarda el retrato del rey Taejo, fundador de la dinastía.',
    'También es la cuna del bibimbap, el plato coreano más conocido. (LP)',
    'Su aldea hanok, con más de 800 casas tradicionales, y el papel hanji son su seña de identidad. (LP)',
    'La catedral de Jeondong se levantó donde fueron ejecutados católicos coreanos en 1781 y 1801. (LP)'] }
};

// ---------- Más contenido de la Lonely Planet 2016 (resumido con palabras propias) ----------
// Introducción de cada ciudad según la guía, y su propuesta de visita cuando la trae.
const INTRO_LP = {
  seul: { txt: 'La capital lo tiene todo: palacios Joseon y barrios de hanok junto a rascacielos, mercados que no cierran y una vida nocturna enorme en Hongdae e Itaewon. Namsan, con la Torre N Seúl, es la colina verde del centro, entre Myeong-dong e Itaewon.',
    plan: ['Día 1: paseo por Bukchon, compras y comida en Insa-dong, cambio de guardia en Gyeongbokgung (o la última visita guiada de Changdeokgung) y cena en el mercado Gwangjang.',
      'Día 2: Museo Nacional de Corea o Memorial de la Guerra, sauna en Dragon Hill Spa, teleférico a la Torre N Seúl y cena en Itaewon.',
      'Con más días: la muralla hasta Bukak-san y el templo Gilsang-sa, Dongdaemun Design Plaza, la prisión de Seodaemun y el santuario de Inwangsan, y de noche, Hongdae.'] },
  andong: { txt: 'Famosa por su caballa salada, su soju fuerte y sus máscaras de madera, Andong es una base estupenda para ver los sitios históricos de los alrededores. La ciudad es tranquila y muy amable, con buenos sitios para comer.' },
  gyeongju: { txt: 'La llaman "el museo sin muros": tiene más tumbas, templos, tallas en roca, pagodas y ruinas de palacios que ningún otro sitio de Corea. Bulguksa y Seokguram están a las afueras pero se llega en transporte público; el centro es compacto y se recorre a pie.' },
  busan: { txt: 'La segunda ciudad del país es un puerto lleno de vida entre montañas y playas, con aguas termales y marisco. Desde los puestos de carpa hasta cafés de diseño y mercados de pescado con todas las especies imaginables: hay de todo. El Festival Internacional de Cine (BIFF) la ha hecho famosa.' },
  jeonju: { txt: 'Capital provincial, cuna de la dinastía Joseon y del bibimbap. Su aldea hanok, con casas tradicionales convertidas en museos, teterías y talleres de artesanos, es lo mejor; además es un buen nudo de buses y trenes para moverse por la región.' }
};

// Glosario de platos (hangul de la Lonely Planet; descripción en español).
const PLATOS = [
  ['Arroz', [
    ['bibimbap', '비빔밥', 'Arroz con huevo, carne, verduras y salsa picante para mezclar'],
    ['dolsot bibimbap', '돌솥비빔밥', 'Bibimbap en cuenco de piedra caliente (con costra crujiente)'],
    ['sanchae bibimbap', '산채비빔밥', 'Bibimbap con verduras de montaña'],
    ['gimbap', '김밥', 'Rollo de arroz con aceite de sésamo envuelto en alga'],
    ['ssambap', '쌈밥', 'Ingredientes variados con arroz para envolver en hojas'],
    ['boribap', '보리밥', 'Arroz con cebada'],
    ['juk', '죽', 'Gachas de arroz'],
    ['jeonbokjuk', '전복죽', 'Gachas de arroz con oreja de mar'],
    ['bokkeumbap', '볶음밥', 'Arroz frito al estilo chino']]],
  ['Carne', [
    ['bulgogi', '불고기', 'Ternera en láminas a la parrilla, para envolver en lechuga'],
    ['galbi', '갈비', 'Costillas de ternera'],
    ['dwaeji galbi', '돼지갈비', 'Costillas de cerdo'],
    ['samgyeopsal', '삼겹살', 'Panceta de cerdo a la parrilla'],
    ['dakgalbi', '닭갈비', 'Pollo picante salteado con verduras y pasteles de arroz'],
    ['jjimdak', '찜닭', 'Pollo guisado picante con fideos (el de Andong)'],
    ['bossam', '보쌈', 'Cerdo cocido con kimchi y hojas para envolver'],
    ['tteokgalbi', '떡갈비', 'Hamburguesa grande de carne picada'],
    ['yukhoe', '육회', 'Ternera cruda aliñada'],
    ['galbijjim', '갈비찜', 'Costillas de ternera estofadas']]],
  ['Sopas y guisos', [
    ['samgyetang', '삼계탕', 'Sopa de pollo con ginseng'],
    ['galbitang', '갈비탕', 'Sopa de costilla de ternera'],
    ['seolleongtang', '설렁탕', 'Sopa de ternera con arroz'],
    ['haejangguk', '해장국', 'Sopa de brotes de soja ("sopa para la resaca")'],
    ['gamjatang', '감자탕', 'Huesos con carne y patata'],
    ['maeuntang', '매운탕', 'Sopa picante de pescado'],
    ['haemultang', '해물탕', 'Sopa picante de marisco variado'],
    ['manduguk', '만두국', 'Sopa con empanadillas de carne'],
    ['kimchi jjigae', '김치찌개', 'Guiso de kimchi'],
    ['doenjang jjigae', '된장찌개', 'Guiso de pasta de soja'],
    ['sundubu', '순두부', 'Tofu sedoso (en guiso picante)'],
    ['budae jjigae', '부대찌개', '"Guiso del ejército" con salchichas, Spam y verduras']]],
  ['Fideos', [
    ['mul naengmyeon', '물냉면', 'Fideos de trigo sarraceno en caldo frío'],
    ['bibim naengmyeon', '비빔냉면', 'Fideos fríos con verduras, carne y salsa'],
    ['kalguksu', '칼국수', 'Fideos de trigo en caldo de almejas y verduras'],
    ['kongguksu', '콩국수', 'Fideos en sopa fría de soja'],
    ['japchae', '잡채', 'Fideos de cristal salteados con verduras'],
    ['jajangmyeon', '자장면', 'Fideos con salsa negra de soja fermentada (estilo chino)'],
    ['ramyeon', '라면', 'Fideos instantáneos en sopa']]],
  ['Pescado y marisco', [
    ['modeumhoe', '모듬회', 'Surtido de pescado crudo'],
    ['saengseongui', '생선구이', 'Pescado a la parrilla'],
    ['jangeogui', '장어구이', 'Anguila a la parrilla'],
    ['kkotgejjim', '꽃게찜', 'Cangrejo azul al vapor'],
    ['nakji', '낙지', 'Pulpo pequeño'],
    ['ojingeo', '오징어', 'Calamar'],
    ['saeugui', '새우구이', 'Gambas a la parrilla']]],
  ['Picoteo y calle', [
    ['tteokbokki', '떡볶이', 'Pasteles de arroz en salsa picante'],
    ['hotteok', '호떡', 'Tortita de trigo con relleno dulce'],
    ['bungeoppang', '붕어빵', 'Gofre con forma de pez relleno de alubia roja'],
    ['dakkochi', '닭꼬치', 'Brocheta de pollo picante'],
    ['twigim', '튀김', 'Rebozados de marisco o verdura'],
    ['sundae', '순대', 'Morcilla coreana'],
    ['beondegi', '번데기', 'Larvas de gusano de seda cocidas'],
    ['patbingsu', '팥빙수', 'Hielo raspado con alubia roja y pastel de arroz']]],
  ['Otros', [
    ['kimchi', '김치', 'Col fermentada picante (el acompañamiento básico)'],
    ['kkakdugi', '깍두기', 'Kimchi de rábano en dados'],
    ['pajeon', '파전', 'Tortita de cebolleta'],
    ['bindaetteok', '빈대떡', 'Tortita de soja verde'],
    ['mandu', '만두', 'Empanadillas rellenas'],
    ['hanjeongsik', '한정식', 'Banquete coreano de muchos platos'],
    ['jeongsik', '정식', 'Menú con muchos acompañamientos'],
    ['dotorimuk', '도토리묵', 'Gelatina de bellota']]],
  ['Bebidas', [
    ['nokcha', '녹차', 'Té verde'], ['boricha', '보리차', 'Té de cebada'], ['daechucha', '대추차', 'Té de dátiles rojos'],
    ['soju', '소주', 'Licor de arroz (fuerte)'], ['makgeolli', '막걸리', 'Vino de arroz turbio'], ['maekju', '맥주', 'Cerveza']]]
];

// Lo que amplía la Lonely Planet 2016 de los sitios del itinerario (resumen propio).
// Clave = hangul (o nombre si no hay). Sale en Hoy, en "Sitios de hoy".
// Horarios y precios son de 2016: VERIFICAR.
const DIA_LP = {
  '경복궁': 'Ver el cambio de guardia en la puerta Gwanghwamun y reservar al menos medio día: dentro hay museos (el Folclórico Nacional merece una hora) y jardines. En 2016 cerraba los martes.',
  '창덕궁': 'El palacio más bonito de los cuatro grandes. En 2016 solo se veía con visita guiada (en inglés 10:30 y 14:30). El jardín secreto Huwon va en grupos de 50: reservar o llegar pronto. Truco: la entrada combinada de los 4 palacios (Gyeongbokgung, Changdeokgung, Changgyeonggung y Deoksugung) con Huwon costaba 10.000 ₩ y valía un mes.',
  '북촌한옥마을': 'Unas 900 hanok entre los dos palacios. Para orientarse antes de perderse por sus cuestas: el Centro de Cultura Tradicional de Bukchon (gratis).',
  '인사동': 'La Lonely propone comer y comprar aquí después de pasear por Bukchon: artesanía y casas de té.',
  '익선동': 'Ya en 2016 sus hanok se estaban convirtiendo en cafés-bar con encanto (por ejemplo Ikdong Dabang).',
  '청계천': 'Se derribó una autopista elevada para recuperar el arroyo: paseos, puentes, cascadas y arte, como la gran concha rosa y azul "Spring" en la plaza Cheonggye.',
  '명동성당': 'Catedral neogótica de ladrillo de 1898: entrar a ver bóvedas y vidrieras. Fue refugio de estudiantes y sindicalistas durante la dictadura y es símbolo de la democracia.',
  '광화문광장': 'Gran avenida hacia Gyeongbokgung con las estatuas del almirante Yi Sun-sin y del rey Sejong. Bajo la de Sejong hay una exposición gratuita sobre los dos.',
  '조계사': 'Su sala de madera Daeungjeon (1938) es la mayor sala budista de Seúl, con tres budas gigantes: Amitabha, el Buda histórico y el Buda de la Medicina. Abierto 24 h.',
  'N서울타워': '236 m sobre Namsan, la montaña guardiana. Al atardecer la ciudad se convierte en "una galaxia de luces". Candados de enamorados en las barandillas. Subir andando no es difícil (también hay teleférico).',
  '봉은사': 'Fundado en el año 794, en una ladera con árboles en pleno Gangnam, frente a los rascacielos. Se entra por la Puerta de la Verdad, guardada por los cuatro reyes celestiales.',
  '남대문시장': 'Junto al mercado está Sungnyemun (Namdaemun), la Gran Puerta del Sur, una de las cuatro puertas originales del siglo XIV; se cruza desde la puerta 1 del mercado. Reconstruida tras un incendio en 2008.',
  '덕수궁': 'El único palacio que se visita de noche, iluminado (en 2016 hasta las 21 h, cerrado los lunes). Mezcla edificios coreanos y neoclásicos. Cambio de guardia a las 11, 14 y 15:30.',
  '서울역사박물관': 'Gratis. Cuenta cómo cambió Seúl desde los Joseon; dentro hay una enorme maqueta de la ciudad que se recorre andando y fuera un tranvía de los años 30.',
  '남산골한옥마을': 'Cinco casas nobles (yangban) de la época Joseon trasladadas al pie de Namsan. Gratis, con visitas guiadas de una hora. En Namsan Gugakdang hay música tradicional casi cada tarde (cerrado los martes).',
  '이화벽화마을': 'Antigua "aldea de la luna", donde vivían refugiados tras la guerra, hoy llena de murales y esculturas en sus escaleras. Ir pronto. En el Museo del Candado dan un mapa en inglés.',
  '서대문형무소역사관': 'Cárcel de 1908, símbolo de la represión japonesa (1910-1945), usada por las dictaduras hasta 1987. Se ven las celdas originales; aquí murió la estudiante Ryu Gwan-sun. En 2016 cerraba los lunes y en noviembre a las 17 h.',
  '광장시장': 'El mayor callejón de comida de Seúl, unos 200 puestos. Especialidad: bindaetteok (tortita de judía mungo), mejor con makgeolli.',
  '안동하회마을': 'Patrimonio Unesco y lo mejor de la región: unos 230 vecinos mantienen la vida tradicional. Llegar temprano. En la entrada prestan audioguía gratis (piden documento). Respetar la intimidad de las casas. La danza de máscaras Byeolsingut Talnori, en 2016, en noviembre era solo los domingos a las 15 h y gratis (piden donativo): VERIFICAR la hora, el plan dice 14:00.',
  'p:museodemascarasdehahoe': 'A 2 km de la aldea hacia Andong: máscaras coreanas y de medio mundo (Nigeria, Italia, México). Según la leyenda, un artesano talló la cara de un noble engreído y así nació esta tradición satírica.',
  '대릉원': 'Túmulos reales de Silla que parecen colinas de hierba. Solo se entra en Cheonmachong (Tumba del Caballo Celeste, siglo V): 13 m de alto, con réplicas de la corona de oro y las joyas. En días fríos cierra al anochecer.',
  '첨성대': 'El observatorio más antiguo de Extremo Oriente (632-646). Las 12 piedras de la base son los meses, sus 30 hiladas los días del mes y sus 366 piedras, más o menos, los días del año. Gratis.',
  '동궁과월지': 'Jardín de recreo que celebraba la unificación de la península por Silla. Los edificios ardieron en el 935 y muchas piezas cayeron al estanque; se hallaron al vaciarlo en 1975 y están en el Museo Nacional.',
  '국립경주박물관': 'Para la Lonely, quizá el mejor museo de historia de Corea: joyas, armas y una corona de oro del siglo V. Fuera, la campana Emille, de las mayores y más sonoras de Asia (dicen que se oye a 3 km). Gratis.',
  '분황사': 'La pagoda fechada más antigua de Corea (siglo VII, reina Seondeok), de ladrillo, con guardianes y leones de piedra. Desde el museo, unos 20-25 min a pie.',
  '불국사': 'Cumbre de la arquitectura de Silla, sobre terrazas de piedra entre pinos. Fijarse en los dos puentes, uno de 33 escalones (las 33 etapas hacia la iluminación), y en las pagodas Dabotap y Seokgatap. En 2016, de noviembre a febrero cerraba a las 17 h.',
  '석굴암': 'Gruta del siglo VIII a 740 m: un Buda rodeado de guardianes mira al Mar del Este (se ve si está despejado). Mágica con niebla. En 2016 el bus 12 salía cada hora del aparcamiento de Bulguksa (20 min); del aparcamiento se sigue a pie.',
  '해운대해수욕장': 'La playa más famosa del país, de 2 km. La Lonely avisa de que lo de "resort de categoría mundial" es exagerado; en noviembre estará tranquila.',
  '광안리해수욕장': 'Para la Lonely, la mejor playa de la ciudad. De día los edificios le restan; brilla de noche con las luces del puente Gwangan (Diamond Bridge).',
  '감천문화마을': 'Barrio de ladera transformado con arte en 2009: casas como piezas de Lego, cafés y galerías. 1-2 h. Comprar el mapa (2.000 ₩ en 2016) y hacer la búsqueda de sellos. Calzado cómodo. Desde el metro, minibús 2 o 2-2, o taxi.',
  '자갈치시장': 'El mayor mercado de pescado del país. Se compra el pescado en la planta 1 y te lo preparan en la 2 (cobran un pequeño servicio). En 2016 cerraba el 1.º y el 3.er martes de cada mes.',
  '국제시장': 'Cientos de puestos con de todo, desde cuero hasta tambores coreanos.',
  '청사포': 'La Lonely recomienda Noran Mahura, junto al faro: marisco a la brasa (jogae gui) para ver el atardecer.',
  '전주한옥마을': 'Más de 800 hanok, hoy casas de huéspedes, galerías, restaurantes y casas de té. Turístico, pero encantador temprano o al anochecer. Hay talleres de papel hanji o licor con reserva (mínimo 2 personas).',
  '경기전': 'De 1410, reconstruido en 1614: guarda el retrato del fundador de la dinastía Joseon, Yi Seong-gye, cuya familia era de Jeonju, y el Museo de Retratos Reales. En 2016 había visitas en inglés a las 11 y 14 h.',
  '전주향교': 'Escuela confuciana de 1603, muy bien conservada: aquí se preparaban los hijos de los nobles para los exámenes del Estado. Gratis; de octubre a febrero cerraba a las 17 h.',
  '풍남문': 'Lo único que queda de la muralla de Jeonju (1398, muy restaurada); hoy está en medio de una rotonda.',
  '오목대': 'Pabellón en la colina sobre la aldea, donde Yi Seong-gye celebró una victoria contra piratas japoneses en 1380. Cruzando el puente, Imokdae.',
  '자만마을': 'Murales de colores en un antiguo barrio de chabolas sobre la aldea hanok. La Lonely recomienda el café-terraza Kkojittappong.',
  '남부시장': 'Dentro del laberíntico mercado está Hyundai-ok, "el restaurante más querido de Jeonju": kongnamul gukbap (sopa de brotes de soja y arroz), con o sin calamar; pedirla suave si no os gusta el picante. En 2016 abría de 6 a 14 h.',
  '종묘': 'Rodeado de bosque, este santuario confuciano guarda las "tablillas del espíritu" de los reyes y reinas Joseon y de sus funcionarios más leales; se cree que el espíritu vive en un agujero tallado en la tablilla. Patrimonio Mundial por su arquitectura y sus ceremonias (la más famosa, el Jongmyo Daeje, a primeros de mayo). En 2016 cerraba los martes.',
  '국립중앙박물관': 'Gran edificio moderno de mármol que aprovecha la luz natural para lucir los tesoros antiguos de Corea. Imprescindible en la planta baja: el incensario de Baekje, una obra maestra del siglo VI-VII. Gratis.',
  '전쟁기념관': 'Enorme museo sobre la Guerra de Corea (1950-53), con muchas películas documentales en blanco y negro (comentadas en inglés), fotos, mapas y objetos. Fuera, tanques, helicópteros, misiles y aviones. De mediados de octubre a finales de noviembre, los viernes a las 14 h, desfile de la Guardia de Honor (2016: VERIFICAR). Gratis.',
  '길상사': 'Precioso templo en una ladera, bonito todo el año. Tiene una pequeña casa de té y programa de templestay un fin de semana al mes. Bus lanzadera cada hora desde el metro Hansung University.',
  '한국가구박물관': 'Joya de museo: diez edificios tradicionales como aperitivo y una colección de muebles (arcones, estanterías, mesas) de caqui, arce o paulonia, algunos con laca o nácar. Solo con visita guiada de una hora y reserva previa.',
  '동대문시장': 'El pulso comercial de Seúl: un mercado mayorista y minorista colosal a ambos lados del Cheonggyecheon. Ropa al por mayor en el Pyoung Hwa (de noche) y callejones de comida muy animados.',
  '창경궁': 'Palacio construido por el rey Sejong para sus padres a principios del siglo XV. Lo más antiguo es el puente de piedra Okcheongyo (1483); la sala principal Myeongjeongjeon (1616) tiene un techo tallado y pintado precioso.',
  '국립민속박물관': 'Dentro del recinto de Gyeongbokgung. Merece al menos una hora: tres salas sobre la historia del pueblo coreano, la vida agrícola y la de los nobles (yangban) Joseon. No te pierdas el colorido carro fúnebre que parece un arca de Noé. Gratis.',
  '서울시청사': 'El nuevo Ayuntamiento (2013) parece un tsunami de cristal y acero; la ola reinterpreta los aleros de palacios y templos y da sombra al antiguo ayuntamiento de piedra de 1926. En el sótano, el Citizens Hall con exposiciones gratis.',
  '서울숲': 'Antiguo coto de caza Joseon convertido en un gran parque. Lo mejor es alquilar una bici junto a la puerta 2. Hay ciervos, lagos, zonas ecológicas y fuentes.',
  '절두산순교성지': '"Colina de las decapitaciones": en 1866 hasta 2.000 católicos coreanos fueron ejecutados aquí, muchos arrojados al río Han desde el acantilado. Santuario y museo (donativo).',
  '전쟁과여성인권박물관': 'Museo muy emotivo sobre las "mujeres de consuelo", esclavas sexuales del ejército japonés en la Segunda Guerra Mundial, llamadas con respeto halmoni (abuela). Al entrar te dan la historia de una de ellas.',
  '인왕산국사당': 'El santuario chamánico más famoso de Seúl, donde a veces se ven rituales gut de las chamanas (mudang). Los japoneses derribaron el original de Namsan en 1925 y se reconstruyó aquí.',
  '올림픽공원': 'El gran parque de los Juegos de 1988: estadios, estanques, esculturas al aire libre, una galería de arte moderno, museos de la dinastía Baekje y restos de la fortaleza de tierra Mongchon. Gratis.',
  '선정릉': 'Parque con tumbas reales Joseon, entre ellas la del rey Seongjong (1469-1494), que tuvo 28 hijos con 12 esposas y concubinas. Se puede subir a ver la tumba de cerca. Un remanso verde en Gangnam.',
  '롯데월드': 'Enorme complejo con parque de atracciones cubierto (una "Disneyland coreana"), pista de hielo, cines, museo folclórico y centro comercial. La parte exterior, Magic Island, está en el lago Seokchon y puede cerrar con mal tiempo.',
  '서울어린이대공원': 'Gran parque gratuito con atracciones, zoo, jardín botánico, humedal y una fuente musical gigante.',
  '드래곤힐스파': 'Uno de los jjimjilbang (sauna coreana) más grandes y acostumbrados a extranjeros: mezcla de Las Vegas y estética asiática, piscina exterior, saunas, baños de ginseng y cedro, cine y restaurantes. 24 h.',
  '실로암사우나찜질방': 'Jjimjilbang limpio y acostumbrado a extranjeros frente a Seoul Station: muchos baños y salas de sauna. También sirve para pasar una noche barata. 24 h.',
  '스파레이': 'Spa de lujo solo para mujeres, impecable y elegante, con personal acostumbrado a extranjeros. 24 h.',
  '세종문화회관': 'Uno de los grandes centros artísticos de Seúl: musicales, teatro, música tradicional (gugak) y orquestas.',
  '서울예술의전당': 'Sede del ballet y la ópera nacionales; la ópera tiene un tejado con forma de sombrero de noble coreano. Al lado, el Centro Nacional de Gugak con música y danza tradicionales.',
  '용산전자랜드': 'Universo friki de electrónica en varios edificios. Mira los precios en internet antes de ir, como hacen los coreanos. Buen sitio para móviles de segunda mano.',
  '서울풍물시장': 'Rastro en un edificio de dos plantas: máscaras de madera, dibujos a tinta, discos de los Beatles, radios antiguas y todo tipo de cachivaches.',
  '제3땅굴': 'Uno de los cuatro túneles excavados por Corea del Norte bajo la DMZ para un ataque sorpresa. Se recorren 265 m a 73 m de profundidad, encorvado y con casco: no apto para claustrofóbicos ni para muy altos. Solo con excursión organizada.',
  '안동민속촌': 'Casas trasladadas aquí para salvarlas de la presa de Andong (1976), desde granjas humildes hasta mansiones con varios patios. Tan auténtica que la KBS la usa para dramas históricos. A 4 km del centro (bus 3 o taxi).',
  '안동민속박물관': 'Junto a la aldea folclórica: tradiciones populares coreanas del nacimiento a la muerte, muy bien explicadas.',
  '소주박물관': 'El soju de Andong (45 %) es patrimonio inmaterial. En la destilería se explican el proceso, la ceremonia de beber y la historia de las etiquetas; al final dan a probar un dedal. Al sur del río; mejor en taxi.',
  '제비원': 'Buda tallado en una roca de más de 12 m, con la cabeza y el pelo esculpidos en dos piezas aparte. Impresiona verlo surgir entre la vegetación. Bus 54.',
  '병산서원': 'Academia confuciana de 1572 junto al río, en la carretera de tierra que va a Hahoe; los buses de Hahoe paraban aquí 10 minutos (2016). Gratis.',
  '반월성': '"Fortaleza de la media luna", a unos minutos a pie al sur de Cheomseongdae. Hoy es un parque con restos de murallas; el único edificio entero es Seokbinggo, un almacén de hielo de piedra del siglo XVIII.',
  '노서동고분': 'Tumbas de Silla en pleno centro. Seobongchong y Geumgwanchong (siglos IV-V) dieron dos coronas de oro. Enfrente, Bonghwadae, la mayor tumba de Silla conservada (22 m de alto). Hasta 1984 había casas encima.',
  '골굴사': 'Templo con un Buda tallado en la roca (siglo VI). Lo especial es que aquí no solo se mira: es el centro del sunmudo, el arte marcial budista, y ofrece templestay con comidas.',
  '삼릉': 'Pinar al pie del monte Namsan con los túmulos de tres reyes de Silla; buen punto de partida para subir a Namsan, lleno de budas tallados y templos.',
  '경주양동마을': 'Aldea Joseon nada comercial, de las mejores de Corea: unas 180 casas de nobles con muros de piedra y tejados de paja, aún habitadas. Reserva medio día y respeta la intimidad; algunas mansiones se visitan.',
  '보문단지': 'Lago con hoteles de lujo, parques y paseos para andar o ir en bici; le falta el encanto del centro.',
  '우양미술관': 'Museo de arte moderno detrás del Hilton, en Bomun, con exposiciones temporales y colección propia. Cierra los lunes.',
  '기림사': 'Uno de los grandes templos de la zona, casi tan grande como Bulguksa pero mucho menos visitado. Sin transporte público desde Golgulsa (3,5 km a pie).',
  '독락당': 'Bonito conjunto de 1515 que fue residencia del sabio Yi Eon-jeok; parte sigue habitada por sus descendientes. Hay que pedir cita (en las oficinas de turismo).',
  '보경사': 'A 30 km de Pohang: puerta a un valle con 12 cascadas, puentes y ermitas. Excursión de día completo; la sexta cascada mide 72 m.',
  '범어사': 'Para la Lonely, lo mejor de Busan: arquitectura preciosa con la montaña de fondo, a un mundo de la ciudad. Desde aquí salen los senderos de Geumjeong-san. Al volver, tortitas pajeon junto a la parada del bus.',
  '금정산성': 'No esperes un castillo: son 17 km de murallas y cuatro puertas en lo alto de la montaña. Ofrece el mejor senderismo de la ciudad. Se empieza en Beomeosa o en el teleférico de Geumgang.',
  '이기대': 'Parque natural para un paseo de dos horas por la costa, con vistas de Haeundae al otro lado de la bahía.',
  '태종대유원지': 'En la punta sur de la isla de Yeongdo: costa escarpada con un paseo bien cuidado. Bus 8, 30 u 88 desde Nampo, o taxi.',
  '재한유엔기념공원': 'El único cementerio de la ONU del mundo: 2.300 soldados de 11 países que lucharon por el Sur en la Guerra de Corea. Exposición de fotos muy emotiva y voluntarios que cuentan sus historias.',
  '용두산공원': 'Parque junto a las compras de Nampo-dong con la Torre de Busan (118 m): vistas del puerto y su tráfico de portacontenedores.',
  '부산근대역사관': 'Pequeño museo (una hora) con mucho material en inglés sobre el puerto, la influencia japonesa y la Guerra de Corea. Gratis.',
  '부전시장': 'Enorme mercado tradicional de verduras, marisco y cachivaches para perderse una hora.',
  '금강공원케이블카': 'Teleférico con vistas espectaculares de valles y montañas; en días claros se ve el puente Gwangan. Arriba, puestos de comida (cabra a la brasa) y caminos a la fortaleza de Geumjeong y a Seokbulsa.',
  '석불사': 'Ermita difícil de alcanzar con budas enormes tallados en la piedra: de los que hacen exclamar "¡guau!". El camino más corto empieza en el teleférico de Geumgang.',
  '부산시립미술관': 'Galería modesta, no imprescindible, pero buena opción si llueve. Gratis.',
  '부산시티투어버스': 'Bus turístico con seis rutas de día (sube y baja todo el día con el billete Loop) y tres de noche hacia Haeundae y el puente Gwangan. Salen de Busan Station.',
  '미포선착장': 'Pequeño muelle al este de la playa de Haeundae con paseos de 50 minutos a las islas Oryukdo y al puente Gwangan.',
  '전동성당': 'Iglesia de ladrillo rojo (1908-1914) levantada donde se ejecutó a católicos coreanos en 1781 y 1801; mezcla estilos asiático, bizantino y románico. Solo abre en misa: dentro, vidrieras con los primeros mártires. El cercano Monte de los Mártires es el mejor atardecer de Jeonju.',
  '전통술박물관': 'En una bonita hanok: un alambique tradicional (gosori), paneles sobre cómo se hacen los licores tradicionales y una tiendecita. Gratis.',
  '전주객사': 'Antigua sede de gobierno reconstruida, punto de referencia que da nombre al barrio comercial de Gaeksa.',
  '전주한지박물관': 'Junto a una fábrica de papel: historia y elaboración del hanji (papel tradicional coreano) y lo que se puede hacer con él. Al final, puedes hacer tu propia hoja. Gratis.',
  '공예품전시관': 'Gran complejo de artesanía en la aldea hanok: papel, farolillos, lacados y más.',
  '모악산도립공원': 'Parque con el monte Moaksan (794 m), muy popular entre senderistas los fines de semana; su gran atractivo es el templo Geumsansa.'
};

// Sitios del itinerario que la Lonely 2016 no describe: frase general propia (sin marca LP).
const DIA_INFO = {
  '명동': 'Barrio de compras y cosmética; por la tarde se llena de puestos de comida callejera.',
  '홍대': 'Barrio universitario: arte callejero, tiendas, música en directo y vida nocturna.',
  '서촌': 'Barrio tranquilo al oeste de Gyeongbokgung: hanok, callejones, cafés y restaurantes pequeños.',
  '코엑스': 'Gran centro de convenciones y centro comercial subterráneo en Gangnam, junto a Bongeunsa.',
  '별마당도서관': 'La biblioteca abierta del Coex, con estanterías gigantes de varios pisos. Gratis y muy fotogénica.',
  '낙산공원': 'Parque sobre Ihwa con un tramo de la antigua muralla de Seúl; buenas vistas al atardecer.',
  '봉정사': 'Templo de montaña cerca de Andong. Su sala Geungnakjeon es de los edificios de madera más antiguos de Corea.',
  '부용대': 'Acantilado al otro lado del río frente a Hahoe: desde arriba se ve el meandro que rodea la aldea. Se llega en barca (comprobar si funciona).',
  '교촌마을': 'Aldea de hanok junto al río, donde vivió la familia Choi, famosa por su riqueza y su generosidad.',
  '월정교': 'Puente cubierto de madera reconstruido sobre el río; muy bonito iluminado de noche.',
  '황리단길': 'Calle de moda junto a Daereungwon: cafés, tiendas y restaurantes en casas tradicionales.',
  '동백섬': 'Pequeña península al final de Haeundae con un paseo costero entre camelias y pinos, y el edificio Nurimaru APEC.',
  '송도해수욕장': 'La primera playa pública de Corea (1913), con pasarela sobre el mar y teleférico sobre la bahía.',
  'BIFF광장': 'Plaza del Festival de Cine de Busan, en Nampo-dong, con huellas de actores y puestos de ssiat hotteok (tortita rellena de semillas).'
};

// Planes (pestaña ⭐ Planes): League of Legends y cosmética. Público; datos de webs (nov 2026),
// horarios cambiantes: VERIFICAR. Coordenadas aproximadas en data/coords.json (clave = id).
const PLANES = [
  { id: 'pl-lolpark', ciudad: 'seul', cat: 'lol', es: 'LoL Park (CHZZK LoL Park)', ko: '롤파크', romanizacion: 'Rol Pakeu',
    direccion_en: 'Gran Seoul, Torre 1, planta 3 · 33 Jong-ro, Jongno-gu (metro Jonggak, línea 1)',
    desc: 'El estadio de la liga coreana (LCK), donde juegan T1 y Faker. Además: cibercafé de Riot, cafetería y Riot Store con merchandising. En noviembre no hay liga, pero la tienda y el cibercafé suelen abrir.',
    nota: 'Algunas webs dan otra dirección y el horario cambia según la temporada: VERIFICAR antes de ir.' },
  { id: 'pl-t1-hongdae', ciudad: 'seul', cat: 'lol', es: 'T1 Base Camp Hongdae', ko: 'T1 베이스캠프 홍대', romanizacion: 'T1 Beiseukaempeu Hongdae',
    direccion_en: 'B1, 147 Yanghwa-ro, Mapo-gu (metro Hongik Univ., salida 1)',
    desc: 'El cibercafé oficial de T1 (2023): ordenadores de gama alta, exposición de camisetas e historia del equipo, figura de Faker a tamaño real, tienda oficial y platos con nombres de jugadores. Unos 2.000 ₩ la hora.',
    nota: 'Cibercafé 24 h; tienda 11-22 h según una web: VERIFICAR.' },
  { id: 'pl-t1-gangnam', ciudad: 'seul', cat: 'lol', es: 'T1 Base Camp Gangnam', ko: 'T1 베이스캠프 강남', romanizacion: 'T1 Beiseukaempeu Gangnam',
    direccion_en: 'Junto al metro Sinnonhyeon (líneas 9 y Sinbundang)',
    desc: 'El T1 Base Camp más grande (abierto en octubre de 2026): cibercafé, sala de trofeos, tienda y el restaurante "Hide on Bouche".',
    nota: 'Recién abierto: dirección exacta y horario, VERIFICAR.' },
  { id: 'pl-t1-busan', ciudad: 'busan', cat: 'lol', es: 'T1 Base Camp Busan', ko: 'T1 베이스캠프 부산', romanizacion: 'T1 Beiseukaempeu Busan',
    direccion_ko: '부산 해운대구 구남로 37, 2층', direccion_en: '2F, 37 Gunam-ro, Haeundae-gu (metro Haeundae, salida 3)',
    desc: 'Cibercafé, tienda y pub de T1 en la calle que baja de la estación de Haeundae a la playa. La final del Mundial (Worlds 2026) se juega en Nueva York el 14 nov: en Corea es la mañana del 15, antes de vuestro bus a Jeonju.',
    nota: 'Cibercafé 24 h, tienda 11-22 h, pub 16-24 h según su cuenta oficial: VERIFICAR. Comprobar la hora de la final.' },
  { id: 'pl-oy-myeongdong', ciudad: 'seul', cat: 'cosme', es: 'Olive Young Myeongdong Town', ko: '올리브영 명동타운', romanizacion: 'Olibeuyeong Myeongdong Taun',
    direccion_en: 'Myeongdong (calle principal)',
    desc: 'La tienda más grande de Olive Young para turistas: muchísimo surtido, personal que habla idiomas, devolución de impuestos en el momento (llevar pasaporte) y regalo de muestras para turistas.',
    nota: 'Hay varias Olive Young en Myeongdong y las webs no coinciden en la dirección de la grande: VERIFICAR en Naver.' },
  { id: 'pl-daiso-myeongdong', ciudad: 'seul', cat: 'cosme', es: 'Daiso Myeongdong', ko: '다이소 명동역점', romanizacion: 'Daiso Myeongdong-yeok-jeom',
    direccion_en: 'Junto al metro Myeongdong (línea 4)',
    desc: 'Todo a 5.000 ₩ o menos (unos 3 €), con varias plantas. Hay líneas de cosmética exclusivas de marcas conocidas (VT, Medipeel…); son más baratas, pero no iguales a la gama normal de esas marcas.',
    nota: 'Una web da 10-22 h: VERIFICAR.' },
  { id: 'pl-lotte-sogong', ciudad: 'seul', cat: 'cosme', es: 'Lotte Department Store (central)', ko: '롯데백화점 본점', romanizacion: 'Lotte Baekhwajeom Bonjeom',
    direccion_en: 'Sogong-dong, junto a Myeongdong (metro Euljiro 1-ga)',
    desc: 'Grandes almacenes con las marcas de cosmética premium y de dermatología que no tiene Olive Young, y el duty free de Lotte.',
    nota: 'Precios más altos que Olive Young.' },
  { id: 'pl-shinsegae', ciudad: 'seul', cat: 'cosme', es: 'Shinsegae Department Store (central)', ko: '신세계백화점 본점', romanizacion: 'Sinsegye Baekhwajeom Bonjeom',
    direccion_en: 'Hoehyeon, junto a Namdaemun (metro Hoehyeon)',
    desc: 'Grandes almacenes de lujo en un edificio histórico; cosmética premium y duty free. A un paso del mercado Namdaemun.',
    nota: 'Precios más altos que Olive Young.' },
  { id: 'pl-oy-gangnam', ciudad: 'seul', cat: 'cosme', es: 'Olive Young Gangnam', ko: '올리브영 강남타운', romanizacion: 'Olibeuyeong Gangnam Taun',
    direccion_en: 'Junto al metro Gangnam (línea 2)',
    desc: 'Otra Olive Young grande, en Gangnam. Útil si vais al T1 Base Camp de Gangnam o al Coex.',
    nota: 'Nombre y dirección exactos: VERIFICAR en Naver.' },
  { id: 'pl-oy-gwangbok', ciudad: 'busan', cat: 'cosme', es: 'Olive Young Gwangbok', ko: '올리브영 광복본점', romanizacion: 'Olibeuyeong Gwangbok Bonjeom',
    direccion_en: '36 BIFF Gwangjang-ro, Jung-gu (metro Nampo)',
    desc: 'Olive Young grande de Nampo-dong, con devolución de impuestos. Os pilla el 13 nov, entre BIFF Square, Jagalchi y el mercado Gukje.',
    nota: 'VERIFICAR horario.' },
  { id: 'pl-lav-jungdong', ciudad: 'busan', cat: 'servicio', es: 'Lavandería Cleantopia Coin Wash Haeundae Jung-dong', ko: '크린토피아 코인워시 해운대중동점', romanizacion: 'Keurintopia Koinwosi Haeundae Jungdong-jeom', aprox: true,
    direccion_en: 'Barrio de Jung-dong (el del hotel y la estación de Haeundae). Buscar en Naver Map por el nombre en hangul.',
    desc: 'Lavandería de autoservicio de una cadena muy común (lavadoras y secadoras con monedas o tarjeta; detergente en máquina). Lavar y secar: hora y media aprox. Idea para el 12 nov: ponerla y cenar en el mercado de Haeundae.',
    nota: '24 h según una web de listados: VERIFICAR. Ubicación exacta sin confirmar: la distancia es aproximada. Antes de ir, preguntad en el hotel: "세탁기 있어요?" (¿tienen lavadora?); una reseña dice que tiene.' },
  { id: 'pl-lav-jwadong', ciudad: 'busan', cat: 'servicio', es: 'Lavandería Coin Wash 365 Jwadong', ko: '크린토피아 코인워시365 좌동대승점', romanizacion: 'Koinwosi 365 Jwadong Daeseung-jeom', aprox: true,
    direccion_ko: '부산 해운대구 세실로 31', direccion_en: '31 Sesil-ro, Jwa-dong, Haeundae-gu · tel. 051-704-3337',
    desc: 'Otra lavandería de autoservicio de la misma cadena, en Jwa-dong (barrio residencial al este de Haeundae): alternativa si la de Jung-dong no os encaja.',
    nota: '365 días, 24 h según su ficha: VERIFICAR. Coordenadas aproximadas.' }
];

// Mundial de League of Legends 2026 (Worlds), en hora de Corea (KST). Datos de webs a 1 nov 2026:
// el orden de los cuartos varía entre fuentes y las semis dependen de los cuartos: VERIFICAR en lolesports.com.
const WORLDS = {
  nota: 'Cuartos y semis en Allen (Texas), a las 16:00 de allí = 07:00 del día siguiente en Corea. Final en el Barclays Center de Nueva York a las 14:00 de allí = 04:00 del 15 en Corea. Al mejor de 5 (pueden durar 3-4 h).',
  partidos: [
    { f: '2026-11-04', h: '07:00', fase: 'Cuartos', p: 'Top Esports vs Invictus Gaming' },
    { f: '2026-11-05', h: '07:00', fase: 'Cuartos', p: 'Gen.G vs LYON' },
    { f: '2026-11-06', h: '07:00', fase: 'Cuartos', p: 'Dplus KIA vs Bilibili Gaming' },
    { f: '2026-11-07', h: '07:00', fase: 'Cuartos', p: 'T1 vs Karmine Corp', t1: true },
    { f: '2026-11-08', h: '07:00', fase: 'Semifinal 1', p: 'Por decidir' },
    { f: '2026-11-09', h: '07:00', fase: 'Semifinal 2', p: 'Por decidir' },
    { f: '2026-11-15', h: '04:00', fase: 'Final', p: 'Por decidir', final: true }
  ]
};
