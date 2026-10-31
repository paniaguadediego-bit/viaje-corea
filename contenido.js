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
const FRASES = [
  ['Hola', '안녕하세요', 'annyeonghaseyo'],
  ['Gracias', '감사합니다', 'gamsahamnida'],
  ['Perdón / lo siento', '죄송합니다', 'joesonghamnida'],
  ['¡Perdone! (llamar al camarero)', '저기요', 'jeogiyo'],
  ['Sí / No', '네 / 아니요', 'ne / aniyo'],
  ['No hablo coreano', '한국어를 못해요', 'hangugeoreul motaeyo'],
  ['¿Habla inglés?', '영어 하세요?', 'yeongeo haseyo?'],
  ['Más despacio, por favor', '천천히 말해 주세요', 'cheoncheonhi malhae juseyo'],
  ['Soy de España', '스페인 사람이에요', 'seupein saramieyo'],
  ['¿Cuánto cuesta?', '얼마예요?', 'eolmayeyo?'],
  ['Esto, por favor', '이거 주세요', 'igeo juseyo'],
  ['¿Aceptan tarjeta?', '카드 돼요?', 'kadeu dwaeyo?'],
  ['La cuenta, por favor', '계산해 주세요', 'gyesanhae juseyo'],
  ['El recibo, por favor', '영수증 주세요', 'yeongsujeung juseyo'],
  ['Agua, por favor', '물 주세요', 'mul juseyo'],
  ['No puedo comer picante', '매운 거 못 먹어요', 'maeun geo mot meogeoyo'],
  ['Menos picante, por favor', '덜 맵게 해 주세요', 'deol maepge hae juseyo'],
  ['Tengo alergia', '알레르기가 있어요', 'allereugiga isseoyo'],
  ['Para llevar', '포장해 주세요', 'pojanghae juseyo'],
  ['Para tomar aquí', '여기서 먹을게요', 'yeogiseo meogeulgeyo'],
  ['¡Está rico!', '맛있어요', 'masisseoyo'],
  ['¿Dónde está el baño?', '화장실 어디예요?', 'hwajangsil eodiyeyo?'],
  ['Pare aquí, por favor (taxi)', '여기 세워 주세요', 'yeogi sewo juseyo'],
  ['Quiero hacer el check-in', '체크인 할게요', 'chekeuin halgeyo'],
  ['¿Puedo dejar el equipaje?', '짐 맡길 수 있어요?', 'jim matgil su isseoyo?'],
  ['¡Ayuda!', '도와주세요', 'dowajuseyo'],
  ['Tengo que ir al hospital', '병원에 가야 해요', 'byeongwone gaya haeyo']
];

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
// descripciones resumidas. top = "elección del autor". Restaurantes: pueden haber cerrado (verificar).
const R = (es, ko, tipo, nota, extra = {}) => ({ es, ko, tipo, nota, lp: true, ...extra });
const COMER = { verificar: true };
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
    R('Woo Rae Oak', '우래옥', 'Restaurante', 'Clásico de naengmyeon (fideos fríos) y barbacoa.', { top: true, ...COMER }),
    R('Jaha Sonmandoo', '자하손만두', 'Restaurante', 'Mandu (empanadillas) caseros.', { top: true, ...COMER }),
    R('Casa de té Suyeon Sanbang', '수연산방', 'Casa de té', 'Casa de té en un hanok antiguo.', { top: true, ...COMER }),
    R('Casa de té Dawon', '다원', 'Casa de té', 'Té tradicional en un patio de Insadong.', { top: true, ...COMER })
  ],
  andong: [
    R('Aldea Hahoe', '안동 하회마을', 'Aldea', 'Lo mejor de la zona (Unesco). Ve temprano por la mañana.', { top: true }),
    R('Museo de Máscaras de Hahoe', '', 'Museo', 'Máscaras tradicionales coreanas y del mundo, a 2 km de la aldea.'),
    R('Academia Byeongsan Seowon', '병산서원', 'Academia', 'Antigua escuela confuciana (1572) junto al río.'),
    R('Aldea folclórica de Andong', '안동민속촌', 'Aldea', 'Casas tradicionales trasladadas, en una ladera sobre la ciudad.'),
    R('Museo del Folclore de Andong', '안동 민속박물관', 'Museo', 'Vida y costumbres tradicionales de la región.'),
    R('Museo del Soju', '소주 박물관', 'Museo', 'Sobre el soju de Andong (45 %), patrimonio cultural.'),
    R('Buda de Jebiwon', '제비원', 'Santuario', 'Gran Buda tallado en la roca, a las afueras.'),
    R('Andong jjimdak (plato)', '안동찜닭', 'Comida', 'Pollo estofado con fideos: el plato típico de Andong.'),
    R('Yangban Bapsang', '양반 밥상', 'Restaurante', 'Comida tradicional de la zona.', COMER),
    R('Jaerim Galbi', '재림 갈비', 'Restaurante', 'Barbacoa de costillas de cerdo y bulgogi a buen precio.', COMER)
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
    R('Dosolmaeul', '도솔마을', 'Restaurante', 'Comida coreana casera en una casa tradicional.', { top: true, ...COMER }),
    R('Kuro Ssambap', '구로쌈밥', 'Restaurante', 'Ssambap: decenas de platillos para envolver en hojas.', COMER)
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
    R('Noran Mahura', '청사포 노란 마후라', 'Restaurante', 'Marisco en el puerto pesquero de Cheongsapo.', { top: true, ...COMER }),
    R('Sulbing', '설빙', 'Postres', 'Cadena de bingsu (hielo raspado con toppings).', { top: true, ...COMER }),
    R('Casa de té Maru', '마루', 'Casa de té', 'Casa de té tradicional.', { top: true, ...COMER })
  ],
  jeonju: [
    R('Escuela confuciana Jeonju Hyanggyo', '전주향교', 'Histórico', 'Antigua escuela confuciana con árboles enormes (ginkgos).'),
    R('Museo del Vino Tradicional', '전통술박물관', 'Museo', 'Licores tradicionales coreanos; a veces con cata.'),
    R('Puerta Pungnammun', '풍남문', 'Puerta', 'Antigua puerta de la muralla, junto al mercado Nambu.'),
    R('Mirador Omokdae', '오목대', 'Mirador', 'Pabellón en una colina con vistas a toda la aldea hanok.'),
    R('Aldea Jaman (murales)', '자만마을', 'Barrio', 'Callejuelas llenas de murales de colores.'),
    R('Jeonju Gaeksa', '전주 객사', 'Histórico', 'Antigua casa de huéspedes oficial, en el centro.'),
    R('Museo del Hanji', '전주한지박물관', 'Museo', 'El papel tradicional coreano, especialidad de Jeonju.'),
    R('Hanguk-jip', '한국집', 'Restaurante', 'Bibimbap de Jeonju clásico.', { top: true, ...COMER }),
    R('Yetchon Makgeolli', '옛촌막걸리', 'Restaurante', 'Makgeolli en tetera con muchos platillos incluidos.', { top: true, ...COMER }),
    R('Hyundai-ok', '현대옥', 'Restaurante', 'Kongnamul gukbap (sopa de brotes de soja) en el mercado Nambu.', COMER),
    R('Veteran', '베테랑', 'Restaurante', 'Kalguksu (sopa de fideos cortados a cuchillo).', COMER),
    R('Casa de té Gyodong Dawan', '교동다완', 'Casa de té', 'Casa de té en un hanok de la aldea.', COMER)
  ]
};
