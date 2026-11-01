'use strict';
// Contenido fijo y PÚBLICO (nada personal). Solo hangul del que hay total seguridad;
// lo dudoso lleva verificar: true.

// Sitios conocidos por ciudad (alimentan "interés" en Ruta y tarjetas en Enseñar).
const CATALOGO = {
  seul: [
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
    { es: 'Academia Dosan Seowon', ko: '도산서원', romanizacion: 'Dosan Seowon' },
    { es: 'Estación de Andong', ko: '안동역', romanizacion: 'Andong-yeok' }
  ],
  gyeongju: [
    { es: 'Templo Bulguksa', ko: '불국사', romanizacion: 'Bulguksa' },
    { es: 'Gruta Seokguram', ko: '석굴암', romanizacion: 'Seokguram' },
    { es: 'Túmulos Daereungwon', ko: '대릉원', romanizacion: 'Daereungwon' },
    { es: 'Observatorio Cheomseongdae', ko: '첨성대', romanizacion: 'Cheomseongdae' },
    { es: 'Palacio Donggung y estanque Wolji', ko: '동궁과 월지', romanizacion: 'Donggung gwa Wolji' },
    { es: 'Calle Hwangridan-gil', ko: '황리단길', romanizacion: 'Hwangnidan-gil' },
    { es: 'Estación de Gyeongju (KTX)', ko: '경주역', romanizacion: 'Gyeongju-yeok', verificar: true, nota: 'Antes "Singyeongju"' }
  ],
  busan: [
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
  ]]
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
const ALIAS = { '전주한옥마을': ['hanok village'], 'N서울타워': ['n seoul tower', 'namsan'], '동궁과 월지': ['donggung', 'wolji'],
  '대릉원': ['daereungwon', 'cheonmachong'], '안동 하회마을': ['hahoe'], '하회마을': ['hahoe'], '해운대해수욕장': ['playa de haeundae'], '전동성당': ['jeondong'],
  '황리단길': ['hwangnidan'], '국립경주박물관': ['museo nacional de gyeongju'] };
