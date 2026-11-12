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
    { es: 'Espectáculo de drones (Gwangalli)', ko: '광안리 M 드론라이트쇼', romanizacion: 'Gwangalli M Deuron Raiteusyo', tipo: 'Espectáculo', sinFoto: true, buscar: ['drones', 'drone show'],
      desc: 'Cientos de drones dibujan figuras sobre el puente Gwangan cada sábado: de octubre a febrero a las 19:00 y 21:00 (de marzo a septiembre, 20:00 y 22:00), unos 12 min, gratis; se ve desde toda la playa. Metro línea 2, Geumnyeonsan o Gwangan. Se suspende con lluvia o viento: VERIFICAR.' },
    { es: 'Aldea cultural Gamcheon', ko: '감천문화마을', romanizacion: 'Gamcheon Munhwa Maeul' },
    { es: 'Mercado Jagalchi', ko: '자갈치시장', romanizacion: 'Jagalchi Sijang' },
    { es: 'Mercado Gukje', ko: '국제시장', romanizacion: 'Gukje Sijang' },
    { es: 'Templo Haedong Yonggungsa', ko: '해동용궁사', romanizacion: 'Haedong Yonggungsa' },
    { es: 'Aldea cultural Huinnyeoul', ko: '흰여울문화마을', romanizacion: 'Huinnyeoul Munhwa Maeul' },
    { es: 'Sky Capsule de Blueline (y tren de la playa)', ko: '해운대 블루라인파크', romanizacion: 'Beullurain' },
    { es: 'Estación de Busan', ko: '부산역', romanizacion: 'Busan-yeok' },
    { es: 'APEC Nurimaru (Dongbaekseom)', ko: '누리마루 APEC하우스', romanizacion: 'Nurimaru APEC Hauseu', tipo: 'Mirador', buscar: ['nurimaru'], desc: 'Pabellón de la cumbre APEC de 2005 en la punta de la isla Dongbaek, con vistas al puente Gwangan; se llega por el paseo de la isla. Gratis; horario VERIFICAR.' },
    { es: 'Calle del Cine de Marine City', ko: '해운대 영화의 거리', romanizacion: 'Haeundae Yeonghwaui Geori', tipo: 'Paseo', buscar: ['calle del cine'], desc: 'Paseo marítimo de Marine City con figuras y huellas de películas coreanas, frente a los rascacielos; bonito al atardecer y de noche.' },
    { es: 'The Bay 101 (vistas de Marine City)', ko: '더베이101', romanizacion: 'Deo Bei 101', tipo: 'Mirador', buscar: ['bay 101'], desc: 'Complejo junto al club náutico, en la punta de Dongbaek: terraza con la mejor vista nocturna de los rascacielos de Marine City reflejados en el agua; cafés, bares y fish & chips.' },
    { es: 'Mercado tradicional de Haeundae', ko: '해운대시장', romanizacion: 'Haeundae Sijang', tipo: 'Mercado', buscar: ['mercado tradicional de haeundae', 'mercado de haeundae'], desc: 'Callejón de puestos a 300 m del hotel: tteokbokki, hotteok, eomuk y pescado. Bueno para cenar barato y picar de puesto en puesto.' },
    { es: 'Teleférico de Songdo (Busan Air Cruise)', ko: '송도해상케이블카', romanizacion: 'Songdo Haesang Keibeulka', buscar: ['air cruise', 'teleferico de songdo', 'songdo cable'], tipo: 'Teleférico', desc: 'El primer teleférico de Corea: 1,62 km sobre el mar desde la playa de Songdo hasta el parque Amnam, con cabinas de suelo de cristal.' },
    { es: 'Playa de Songjeong (surf)', ko: '송정해수욕장', romanizacion: 'Songjeong Haesuyokjang', buscar: ['songjeong'], tipo: 'Playa', desc: 'La mejor playa de Busan para surfear, con escuelas y cafés surferos; al final del sendero de Blueline.' },
    { es: 'Museo del Cine de Busan', ko: '부산영화체험박물관', romanizacion: 'Busan Yeonghwa Cheheom Bakmulgwan', buscar: ['museo del cine'], tipo: 'Museo', desc: 'Museo interactivo de cine junto al parque Yongdusan: croma, doblaje y Museo de las Ilusiones Ópticas.' },
    { es: 'Oryukdo Skywalk', ko: '오륙도 스카이워크', romanizacion: 'Oryukdo Seukaiwokeu', buscar: ['oryukdo'], tipo: 'Mirador', desc: 'Mirador de suelo transparente sobre el acantilado, al final del sendero de Igidae.' },
    { es: 'Isla de Eulsukdo y Museo de Arte Contemporáneo', ko: '을숙도', romanizacion: 'Eulsukdo', buscar: ['eulsukdo'], tipo: 'Naturaleza', desc: 'Isla en la desembocadura del Nakdong con parque de aves migratorias y el Museo de Arte Contemporáneo de Busan.' },
    { es: 'Playa de Dadaepo', ko: '다대포해수욕장', romanizacion: 'Dadaepo Haesuyokjang', buscar: ['dadaepo'], tipo: 'Playa', desc: 'Playa famosa por sus puestas de sol, con pasarela sobre las rocas y fuente iluminada.' },
    { es: 'Busan Cinema Center', ko: '영화의전당', romanizacion: 'Yeonghwaui Jeondang', buscar: ['cinema center'], tipo: 'Arquitectura', desc: 'Sede del festival de cine BIFF, con un enorme tejado en voladizo cubierto de LED que de noche da espectáculo.' },
    { es: 'Calle de cafés de Jeonpo', ko: '전포카페거리', romanizacion: 'Jeonpo Kape Geori', buscar: ['jeonpo'], tipo: 'Cafés', desc: 'Antiguo barrio de ferreterías junto a Seomyeon, hoy lleno de cafés.' },
    { es: 'Calle de cafés de Oncheoncheon', ko: '온천천 카페거리', romanizacion: 'Oncheoncheon Kape Geori', buscar: ['oncheoncheon'], tipo: 'Cafés', desc: 'Cafés y bares junto al arroyo Oncheon, con cerezos y carril bici.' }
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
    ['Hola', '안녕하세요', 'annyeonghaseyo'], ['Gracias', '감사합니다', 'gamsahamnida'], ['De nada', '아니에요', 'anieyo'],
    ['Perdón / lo siento', '죄송합니다', 'joesonghamnida'], ['¡Perdone! (llamar a alguien)', '저기요', 'jeogiyo'],
    ['Sí / No', '네 / 아니요', 'ne / aniyo'], ['No hablo coreano', '한국어를 못해요', 'hangugeoreul motaeyo'],
    ['¿Habla inglés?', '영어 하세요?', 'yeongeo haseyo?'], ['Más despacio, por favor', '천천히 말해 주세요', 'cheoncheonhi malhae juseyo'],
    ['Soy de España', '스페인 사람이에요', 'seupein saramieyo'], ['¿Dónde está el baño?', '화장실 어디예요?', 'hwajangsil eodiyeyo?'],
    ['¡Maravilloso!', '정말 멋져요!', 'jeongmal meotjyeoyo!']]],
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
// 🍪 Snacks de tienda 24 h (Guía → Comida): nombre, hangul y una línea. Se compran en GS25, CU o 7-Eleven.
const SNACKS = [
  ['Pepero', '빼빼로', 'Palitos de galleta bañados en chocolate. El 11 de noviembre es el «Día del Pepero» (estaréis en Gyeongju).'],
  ['Choco Pie', '초코파이', 'Bizcocho redondo con nube y cobertura de chocolate. El clásico de los clásicos.'],
  ['Turtle Chips', '꼬북칩', 'Patatas de varias capas, muy crujientes.'],
  ['Whale Snack', '고래밥', 'Galletitas saladas con forma de ballena y otros animales marinos.'],
  ['Shrimp Crackers', '새우깡', 'Gusanitos con sabor a gamba, ligeros y salados.'],
  ['Honey Butter Chip', '허니버터칩', 'Patatas fritas dulces de miel y mantequilla.'],
  ['Kkokkalcorn', '꼬깔콘', 'Conos crujientes de maíz, salados y algo dulces.'],
  ['Choco Heim', '초코하임', 'Barquillo crujiente relleno de crema de chocolate.'],
  ['Binch', '빈츠', 'Galleta con una capa de chocolate por encima.'],
  ['Home Run Ball', '홈런볼', 'Bolitas de bizcocho blando rellenas de crema de chocolate.'],
  ['Kancho', '칸쵸', 'Galletitas pequeñas rellenas de chocolate, con dibujos.'],
  ['Yakgwa', '약과', 'Galleta tradicional de miel y aceite de sésamo, blandita; ha vuelto a ponerse de moda.']
];
// 📕 «Indispensable» de la Lonely Planet Corea 2024 (edición en español, p. 178), lo que el usuario fotografió.
// Clave = hangul sin espacios del sitio. Cada cosa: [nombre, hangul, qué mirar (propio)].
const LP24_INDISP = {
  '불국사': { p: 178, items: [
    ['Puentes Cheongungyo y Baegungyo', '청운교 · 백운교', 'La gran escalera-puente de piedra de la fachada (puentes de la Nube Azul y de la Nube Blanca), con 33 peldaños que simbolizan los 33 cielos budistas. Sube a la puerta Jahamun. No se puede pisar: se mira desde abajo.'],
    ['Puentes Yeonhwagyo y Chilbogyo', '연화교 · 칠보교', 'A la izquierda de los anteriores (puentes de la Flor de Loto y de los Siete Tesoros), más pequeños; en los peldaños hay flores de loto talladas. Llevan a la sala Geungnakjeon.'],
    ['Sala principal de Buda (Daeungjeon)', '대웅전', 'El corazón del templo, con el Buda Sakyamuni. Está en el patio entre las dos pagodas.'],
    ['Pagodas Dabotap y Seokgatap', '다보탑 · 석가탑', 'Las dos pagodas de piedra del patio, de la época Silla: Dabotap, la recargada (es la de la moneda de 10 wones), y Seokgatap, la sobria. Comparadlas: son dos maneras de entender la misma idea.']] }
};
// 🚶 Recorrido a pie por el complejo de tumbas de Daereungwon (LP 2024): sale en la ficha de Daereungwon y de cada parada.
const LP24_RUTA_DAEREUNG = { ciudad: 'gyeongju', t: 'Recorrido a pie por Daereungwon y el centro', items: [
  ['Tumbas de Noseo-ri y Nodong-ri', '노서동 고분', 'Empieza al norte: túmulos de Seobongchong, Geumgwanchong y Geumnyeonchong, y Bonghwangdae (22 m de alto, 250 m de perímetro), la mayor tumba de Silla que se conserva.'],
  ['Cheonmachong (Daereungwon)', '천마총', 'Tras cruzar la calle al sur: la única tumba en la que se puede entrar. Al lado, Hwangnamdaechong y la tumba del rey Michu.'],
  ['Cheomseongdae', '첨성대', 'Saliendo por el extremo sur del parque: observatorio de piedra (632-646), el más antiguo de Extremo Oriente. 12 piedras en la base (meses), 30 capas (días del mes) y unas 366 piedras (días del año).'],
  ['Donggung y estanque Wolji', '동궁과 월지', 'Pasados los jardines de flores, al otro lado de Wonhwa-ro. Consejo nuestro: dejadlo para el atardecer, cuando se ilumina.'],
  ['Wolseong (Banwolseong)', '반월성', 'Volviendo al oeste: solar del palacio de Silla. Solo queda el Seokbinggo, el almacén de hielo de piedra (época Joseon), y el foso.'],
  ['Bosque de Gyerim', '계림', 'Girando al norte: bosque de unos 2.000 años, el de la leyenda de Kim Alji.'],
  ['Tumba del rey Naemul', '내물왕릉', 'Junto al bosque.'],
  ['Gyeongju Hyanggyo', '경주향교', 'Escuela confuciana, cerca de las casas tradicionales de Gyochon.'],
  ['Puente Woljeonggyo', '월정교', 'Fin del recorrido: puente de 66 m, rojo y verde, del año 760 y restaurado en 2009 según la guía, sobre el arroyo Namcheon.']] };
// Ficha propia (Planes → Gyeongju y Hoy el día que toca); cada parada lleva el distintivo LP24.
const LP24_RUTAS = [LP24_RUTA_DAEREUNG];
const LP24_SITIOS = new Set(['대릉원', '노서동고분', '천마총', '첨성대', '동궁과월지', '반월성', '계림', '내물왕릉', '경주향교', '월정교']);
LP24_INDISP['석굴암'] = { p: 178, items: [['Estatua de Buda de Seokguram', '석굴암 본존불', 'El gran Buda sedente de granito de la gruta, tras un cristal y mirando al mar del Este, rodeado de relieves de guardianes y discípulos. Dentro no se permiten fotos.']] };
// Busan · Lonely Planet Corea 2024 (en español), pp. 154-164: recuadro rosa en cada sitio (manda sobre la LP 2016).
const L24B = (p, items, t) => ({ p, t: t || `📕 Lonely Planet 2024, p. ${p}`, items });
Object.assign(LP24_INDISP, {
  '범어사': L24B(154, [
    ['Refugio espiritual', '범어사', 'Uno de los enclaves religiosos más importantes del país; su arquitectura destaca contra la montaña, a años luz de la jungla urbana.'],
    ['Cuatro Tesoros Nacionales', '삼층석탑 · 대웅전', 'La pagoda de piedra de tres niveles, la sala principal Daeungjeon, la tríada de Budas de madera (pasado, presente y futuro) y la puerta de un solo pilar, símbolo de humildad al entrar en lugar sagrado.'],
    ['Consejo', '금정산', 'Fines de semana y festivos, lleno. Desde el templo sale un sendero al norte de Geumjeongsan; antes de volver, pajeon (tortitas de cebolleta) en los restaurantes junto a la parada del bus.']], '📕 Indispensable · Lonely Planet 2024, p. 154'),
  '태종대유원지': L24B(156, [
    ['Sendero circular de 4,5 km', '태종대', 'Por la costa escarpada del extremo sur de Yeongdo, desde la puerta principal. El Danubi Train (no circula los lunes; billete para el trayecto) para en los sitios de interés y en playas de guijarros con ferris.'],
    ['Observatorio y faro de Yeongdo', '영도등대', 'Cafés, un espacio cultural y un escenario al aire libre. Acantilados de 150 m; en días despejados se ve la isla japonesa de Tsushima, a 56 km. Junto al faro, las rocas Sinseon-bawi y Mangbuseok.'],
    ['Templos', '구명사 · 태종사', 'Gumyeong-sa y Taejong-sa, preciosos con las hortensias de junio y julio.']]),
  '송도해상케이블카': L24B(156, [
    ['El primer teleférico de Corea', '송도해상케이블카', 'De 1964; cerró en 1988 y volvió en 2017. 1,62 km sobre el mar desde la playa de Songdo: 39 cabinas, 13 con suelo de cristal. Ida, o ida y vuelta.'],
    ['Bay Station y Sky Station', '송림공원 · 암남공원', 'Sale junto al parque Songnim (este) y llega a un observatorio en el parque Amnam (oeste), ambos con cafés y puestos de comida.'],
    ['Puente Songdo Yonggung y Cloud Walk', '송도용궁구름다리 · 송도구름산책로', 'Desde Amnam, puente colgante al islote deshabitado de Dongseom, muy bonito iluminado de noche. Se combina con el Songdo Cloud Walk, pasarela elevada de 365 m sobre el océano.']]),
  '감천문화마을': L24B(157, [
    ['Comunidad multicolor', '감천문화마을', 'Barrio de refugiados de la guerra en una ladera (1955). En 2009 estudiantes lo pintaron en tonos pastel con detalles en escaleras y callejones. Callejones laberínticos con cafés, galerías y tiendas: un par de horas.'],
    ['Consejos', '안내센터', 'Comprad el plano en el centro de información. Muchas cuestas y escalones: calzado cómodo. Sigue siendo un barrio: sin ruido, sin drones y en transporte público.'],
    ['Negocios de la comunidad', '감천문화마을', 'Gamnae Cafe, Gamcheon Bakery, restaurantes Gamnae Matjib y Gamcheon Ajimae Babjip, y Gamnaegol Happy Power Station (talleres de alfarería, carpintería o caricaturas, 10.000-15.000 ₩).']]),
  '자갈치시장': L24B(157, [
    ['La mayor lonja de Corea', '자갈치시장', 'Platijas, cangrejos, ostras, erizos de mar, anguilas… Una hora para curiosear, comprar lo que apetezca y subirlo a la 2ª planta para que lo preparen: crudo, al vapor, a la plancha, frito o en sopa.'],
    ['Jacky’s Seafood', '자갈치시장 2층', 'Marisquería de la 2ª planta: Jacky habla inglés y facilita comprar el pescado para cenar.'],
    ['Cierre', '휴무', 'La LP 2016 decía que cerraba el 1.º y el 3.er martes de cada mes: VERIFICAR.']], '📕 Indispensable · Lonely Planet 2024, pp. 157-158'),
  '송정해수욕장': L24B(158, [
    ['De ola en ola', '송정해수욕장', 'De las siete playas de Busan, la mejor para surfear: tiendas, escuelas, bares y cafés surferos. Nomad Her organiza campamentos solo para mujeres.']]),
  '용두산공원': L24B(158, [
    ['Torre, pabellón y museos', '용두산공원', 'En Nampo-dong, verde y con reloj floral. Pabellón de la Campana de los Ciudadanos, cascada artificial, pequeño templo, centro de hanbok y estatuas de Ahn Huijae y del almirante Yi Sun-sin.'],
    ['Torre de Busan', '부산타워', 'Si la bruma deja, se ve el puerto y su tráfico. Tienda libre de impuestos. Al lado, el Museo del Cine de Busan (2017).']]),
  '부산영화체험박물관': L24B(158, [
    ['Museo del Cine de Busan', '부산영화체험박물관', 'El primer centro de exposiciones de cine de Corea: se participa en una película (croma, voz en off, doblaje). En el mismo edificio, el Museo de las Ilusiones Ópticas (entrada aparte o conjunta).']]),
  '부산근대역사관': L24B(159, [
    ['Museo de Historia Moderna', '부산근대역사관', 'Al noroeste del parque Yongdusan: inmersión en la época colonial japonesa, en un edificio de entonces. Abajo, un café.']]),
  '해운대블루라인파크': L24B(159, [
    ['Las líneas verde y azul', '해운대 블루라인파크', 'El «Ferrocarril Verde» es un sendero de tablones de 4,8 km de Mipo a Songjeong: dos faros, el observatorio Cheongsapo Daritdol (suelo transparente) y el túnel de Dalmaji. El parque Jukdo, el mejor sitio para el atardecer.'],
    ['Tren de la playa y Sky Capsule', '해변열차 · 스카이캡슐', 'La línea azul: el tren paralelo al sendero, con varias paradas, y la Sky Capsule elevada sin paradas. Quien quiera más, 5 km de sendero forestal.']]),
  '재한유엔기념공원': L24B(159, [
    ['Único cementerio de la ONU', '재한유엔기념공원', 'Descansan 2.300 combatientes de 11 países de la Guerra de Corea (1950-1953). Junto a él, el Parque de Esculturas de la ONU, el arboreto Daeyeon y el Museo de Busan (45.000 piezas).']]),
  '해동용궁사': L24B(160, [
    ['Templo junto al mar', '해동용궁사', 'Uno de los pocos templos de costa: vistas de jardines y mar, altares, estatuas de los animales del zodiaco y un Buda de oro gigante. Fines de semana, muy concurrido.'],
    ['Llegar y después', '오시리아', 'Taxi o bus y subida a pie por una carretera de montaña. Cerca, el complejo OSIRIA: Lotte World Adventure, Skyline Luge, centro comercial, museo de la ciencia y piscina infinita.']]),
  '금강공원케이블카': L24B(161, [
    ['Aventura en la cima', '금강공원 케이블카', 'Panorámica de valles verdes y, si está despejado, del puente Gwangan. Desde el metro Oncheonjang, 15 min a pie (salida 1). En el parque, el Museo de Historia Natural Marina.'],
    ['Fortaleza, templo y regreso', '금정산성 · 석불사', 'Arriba, la fortaleza de Geumjeong (17 km de murallas) y, por una pista empinada, la ermita Seokbul-sa con budas tallados en la roca. Bajad a Mandeok (línea 3) o volved en teleférico; junto al teleférico, mesas con bibimbap, jeon y makgeolli.']], '📕 Indispensable · Lonely Planet 2024, pp. 161-163'),
  '해운대해수욕장': L24B(163, [
    ['Diversión asegurada', '해운대해수욕장', 'La playa más famosa de Corea: SUP, yoga en tabla, surf de remo o descansar con un libro. ClubD Oasis: spa de lujo con piscina infinita y bar en la azotea.']]),
  '이기대': L24B(164, [
    ['Sendero de Igidae', '이기대 해안산책로', 'Ruta costera de 4,7 km (2½ h) por bosques y rocas, con vistas de Haeundae. Es un tramo del Galmaetgil (23 tramos, 278 km) y llega al Oryukdo Skywalk, con suelo transparente sobre el acantilado.']]),
  '광안리해수욕장': L24B(160, [
    ['Cafés de la calle Gwangalli', '광안리', 'Frente a una de las mejores playas: cafés y bares con vistas al mar (y al puente Gwangan).'],
    ['Fuegos artificiales (noviembre)', '부산불꽃축제', 'El Festival Internacional de Fuegos Artificiales de Busan ilumina la playa en noviembre. En 2026 fue el sábado 7 de noviembre, antes de vuestra llegada (prensa de Busan).']], '📕 Lonely Planet 2024, pp. 160-161'),
  '부산시티투어버스': L24B(156, [
    ['Autobús turístico', '부산 시티투어', 'Tres circuitos desde la estación de Busan, 12 paradas cada uno (9 diarios, mi-do). Roja: Gwangan, Haeundae y Centum City. Verde: Huinnyeoul, Taejongdae y Oryukdo. Naranja: Gamcheon, Dadaepo y Eulsukdo. 20.000 ₩ (48 h); transbordo 5.000 ₩. Se paga a bordo.'],
    ['Busan Pass', '부산', 'Para muchos atractivos: 24 o 48 h, o 3-5 sitios a elegir entre más de 30 (visitbusanpass.com).']]),
  '오륙도스카이워크': L24B(164, [
    ['Oryukdo Skywalk', '오륙도 스카이워크', 'Mirador de suelo transparente sobre el borde del acantilado, al final del sendero de Igidae.']]),
  '을숙도': L24B(164, [
    ['Isla ecológica', '을숙도', 'En la desembocadura del Nakdong: parque de aves migratorias con observatorio, parque de esculturas y cafés.'],
    ['Museo de Arte Contemporáneo de Busan', 'Tres plantas de exposiciones y un jardín.']]),
  '다대포해수욕장': L24B(164, [
    ['Atardecer en la playa', '다대포해수욕장', 'Famosa por sus puestas de sol: senderos por el parque y el arroyo, pasarela de madera sobre las rocas y miradores en el bosque. Al ponerse el sol, la fuente de Dadaepo se ilumina de colores.']]),
  '영화의전당': L24B(159, [
    ['Busan Cinema Center', '영화의전당', 'Sede del Festival Internacional de Cine de Busan (BIFF, octubre): estructura en voladizo con 127.000 LED que de noche dan espectáculo. Entradas del BIFF con antelación en biff.kr.']]),
  '전포카페거리': L24B(160, [
    ['Cafés de la calle Jeonpo', '전포카페거리', 'Cerca de Seomyeon y Jeonpo: antiguo barrio de ferreterías, hoy lleno de cafés.']]),
  '온천천카페거리': L24B(160, [
    ['Cafés de la calle Oncheoncheon', '온천천 카페거리', 'Junto al arroyo Oncheon, con cerezos, cafeterías, bares y carril bici.']]),
  '흰여울문화마을': L24B(160, [
    ['Calle Huinnyeoul', '흰여울길', 'En Yeongdo, la ruta costera de Jeoryeong pasa por esta calle llena de cafés.']])
});
['송도해상케이블카', '송정해수욕장', '용두산공원', '부산영화체험박물관', '부산근대역사관', '해운대블루라인파크', '재한유엔기념공원', '해동용궁사', '금강공원케이블카', '금정산성', '석불사', '해운대해수욕장', '이기대', '광안리해수욕장', '태종대유원지', '범어사', '감천문화마을', '자갈치시장', '국제시장', '부전시장', '오륙도스카이워크', '을숙도', '다대포해수욕장', '영화의전당', '전포카페거리', '온천천카페거리', '흰여울문화마을', '부산시티투어버스'].forEach(k => LP24_SITIOS.add(k));

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
  ['Dinero y pagos', [
    'La tarjeta se acepta casi en todas partes, incluso para importes pequeños: taxis, tiendas 24 h, restaurantes, KTX. Llevad la tarjeta física: el pago con el móvil (Google Pay) apenas funciona en Corea. VERIFICAR.',
    'Efectivo para: recargar la T-money (en las máquinas del metro suele ser solo en efectivo), mercados y puestos callejeros, y algún restaurante antiguo, entrada o donativo en Andong, Gyeongju y Hahoe.',
    'Cuánto, orientativo: entre los dos, unos 300.000-400.000 ₩ al empezar. T-money: 20.000-30.000 ₩ cada uno al llegar. Comida en la calle y mercados: 20.000-40.000 ₩ al día. Si falta, se saca más.',
    'Con Revolut: mejor sacar wones de cajero en Corea que llevar muchos euros. Cajeros "Global ATM" en bancos y tiendas 24 h; pocos abren 24 h, no lo dejéis para la noche. Sacad cantidades grandes de una vez: el cajero coreano puede cobrar su propia comisión (sale en pantalla).',
    'Revolut: el plan gratuito tiene un límite mensual de retiradas sin comisión y cobra un recargo al cambiar divisa en fin de semana. Mirad vuestro plan en la app. VERIFICAR.',
    'Al pagar o sacar, si preguntan moneda, elegid SIEMPRE wones (₩), nunca euros: la conversión del cajero o del comercio es peor que la de Revolut.',
    'Cambio de billetes: las casas de cambio de Myeongdong suelen dar mejor cambio que el aeropuerto. En el aeropuerto, solo lo justo para el primer rato.',
    'Algunas máquinas y apps no aceptan tarjetas extranjeras: ahí, efectivo o T-money.'
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
  ['Compras, tax free y último día', [
    'En tiendas con el cartel "Tax Free" se pide la devolución del IVA con el pasaporte (llevadlo encima al comprar).',
    'Mínimo unos 15.000 ₩ por recibo. Descuento en el momento en la tienda hasta 1.000.000 ₩ por compra y 5.000.000 ₩ por viaje. VERIFICAR.',
    'Lo que no os descuenten en tienda: guardad los recibos y pasad por los quioscos de devolución del aeropuerto antes del control (con los productos sin abrir, por si los piden).',
    'Último día: devolved el saldo de la T-money en una tienda 24 h (GS25, CU, 7-Eleven), hasta 20.000 ₩ y unos 500 ₩ de comisión. VERIFICAR. La tarjeta no se devuelve.',
    'Gastad los wones sueltos (las monedas no se cambian en España) y recoged en el aeropuerto lo comprado en duty free online.'
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
    R('Museo de Máscaras de Hahoe', '하회세계탈박물관', 'Museo', 'Máscaras tradicionales coreanas y del mundo, junto a la taquilla de la aldea (antes de coger la lanzadera). Indispensable según vuestra guía en papel.', { wiki: 'Hahoetal', buscar: ['museo de mascaras'] }),
    R('Talnori: danza de máscaras de Hahoe', '하회별신굿탈놀이', 'Espectáculo', 'Byeolsingut talnori: danza de máscaras de origen ritual, con personajes que se burlan de nobles y monjes. Función de martes a domingo a las 14:00 (de marzo a diciembre; dura 1 h), en la sala junto a la entrada de la aldea. Indispensable según vuestra guía. VERIFICAR (054-854-3664).', { lp: false, wiki: 'Hahoe_byeolsingut_talnori', buscar: ['danza de mascaras', 'talnori'] }),
    R('Hahoe Jangteo (mercado junto a la taquilla)', '하회장터', 'Mercado', 'Zona de restaurantes y tiendas junto a la taquilla: jjimdak, caballa salada y otros platos de Andong, y recuerdos con máscaras. Indispensable según vuestra guía. Ubicación aproximada.', { lp: false, sinFoto: true }),
    R('Pinar de Mansongjeong', '만송정', 'Parque', 'Bosque de pinos plantado como cortavientos en la orilla del Nakdong (monumento natural 473), frente al acantilado Buyongdae. Indispensable según vuestra guía. Ubicación aproximada.', { lp: false, wiki: 'ko:안동 하회마을 만송정 숲' }),
    R('Árbol de la Diosa Samsin (Samsindang)', '삼신당', 'Santuario', 'Zelkova de unos 600 años en el punto más alto del centro de la aldea: se le piden hijos y salud atando papelitos con deseos. Indispensable según vuestra guía. Ubicación aproximada.', { lp: false, sinFoto: true, buscar: ['samsin', 'arbol de la diosa'] }),
    R('Academia Byeongsan Seowon', '병산서원', 'Academia', 'Antigua escuela confuciana (1572) junto al río, a unos 10 min en coche de Hahoe por una carretera de tierra; sin bus fijo: taxi. Indispensable según vuestra guía.'),
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
    { es: 'Bosque de Gyerim', ko: '계림', tipo: 'Bosque', lp24: true, nota: 'Bosque antiquísimo entre Cheomseongdae y Wolseong, donde según la leyenda apareció Kim Alji, antepasado de los reyes Kim de Silla, en una caja de oro colgada de un árbol.' },
    { es: 'Tumba del rey Naemul', ko: '내물왕릉', tipo: 'Tumbas', lp24: true, nota: 'Túmulo del rey Naemul (siglo IV), junto al bosque de Gyerim, en la ruta a pie de la LP 2024.' },
    { es: 'Escuela confuciana Gyeongju Hyanggyo', ko: '경주향교', tipo: 'Escuela confuciana', lp24: true, nota: 'Escuela confuciana pública de época Joseon, junto a la aldea Gyochon, de camino al puente Woljeonggyo.' },
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
  '한국가구박물관': 'Korea_Furniture_Museum',
  '절두산 순교성지': 'Jeoldusan_Martyrs%27_Shrine',
  '전쟁과여성인권박물관': 'War_and_Women%27s_Human_Rights_Museum',
  '인왕산 국사당': 'Guksadang',
  '서울 어린이대공원': 'Seoul_Children%27s_Grand_Park',
  '드래곤힐스파': 'Jjimjilbang',
  '실로암사우나찜질방': 'Jjimjilbang',
  '스파레이': 'Jjimjilbang',
  '용산전자랜드': 'Yongsan_Electronics_Market',
  '서울풍물시장': 'Seoul_Folk_Flea_Market',
  '서촌': 'Seochon',
  '홍대': 'Hongdae',
  '코엑스': 'COEX_Convention_%26_Exhibition_Center',
  '별마당 도서관': 'Starfield_Library',
  '낙산공원': 'Naksan_Park',
  '인천국제공항': 'Incheon_International_Airport',
  '안동민속촌': 'Andong_Folk_Village',
  '안동 민속박물관': 'Andong_Folk_Museum',
  '소주 박물관': 'Andong_soju',
  '제비원': 'Jebiwon',
  '부용대': 'Buyongdae',
  '노서동 고분': 'Noseo-dong_Tombs',
  '우양미술관': 'Woomyang_Museum_of_Contemporary_Art',
  '기림사': 'Girimsa',
  '독락당': 'Dongnakdang',
  '보경사': 'Bogyeongsa',
  '교촌마을': 'Gyochon_Hanok_Village',
  '월정교': 'Woljeonggyo',
  '경주역': 'Gyeongju_station',
  '부산 근대역사관': 'Busan_Modern_History_Museum',
  '부전시장': 'Bujeon_Market',
  '금강공원 케이블카': 'Geumgang_Park',
  '석불사': 'Seokbulsa',
  '부산 시티 투어버스': 'Busan_City_Tour_Bus',
  '미포 선착장': 'Haeundae_Blueline_Park',
  '동백섬': 'Dongbaekseom',
  '송도해수욕장': 'Songdo_Beach',
  '청사포': 'Cheongsapo', '해운대 블루라인파크': 'Haeundae_Blueline_Park', '흰여울문화마을': 'Huinnyeoul_Culture_Village',
  'BIFF광장': 'BIFF_Square',
  '전통술박물관': 'Makgeolli',
  '자만마을': 'Jaman_Mural_Village',
  '전주 객사': 'Jeonju_Gaeksa',
  '전주한지박물관': 'Hanji',
  '공예품전시관': 'Jeonju_Hanok_Village',
  '남부시장': 'Jeonju_Nambu_Market',
  '전주역': 'Jeonju_station',
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
const ALIAS = { '송도해상케이블카': ['air cruise', 'teleferico de songdo'], '서울역사박물관': ['museo de historia'], '국립중앙박물관': ['museo nacional de corea'], '전주한옥마을': ['hanok village'], 'N서울타워': ['n seoul tower', 'namsan'], '동궁과 월지': ['donggung', 'wolji'],
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
  '흰여울문화마을': 'El «Santorini de Busan»: casas blancas colgadas del acantilado de Yeongdo sobre el mar, con callejones, murales, miradores y cafés; abajo, el paseo costero Jeoryeong (3 km). Muy valorado por viajeros; mejor de día (los cafés cierran pronto). Calles empinadas y con escaleras; es zona residencial, en silencio. Desde el metro Nampo (salida 6), bus 6, 7, 70, 71 o 508 a la parada «흰여울문화마을» o «백련사» (VERIFICAR la línea en Naver). Os pilla cerca del día 13 (Jagalchi y Gukje).',
  '해운대블루라인파크': 'La antigua vía del tren de la costa convertida en paseo: el tren de la playa (Beach Train) va de Mipo, junto a Haeundae, a Songjeong por Cheongsapo, y el Sky Capsule, una cabina para 2-4 personas por un raíl elevado, de Mipo a Cheongsapo. Vistas al mar todo el rato. Sirve también de transporte sin taxi entre Haeundae y Cheongsapo.',
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
  { id: 'pl-lolpark', precio: "Entrar a LoL Park y la tienda, gratis; el cibercafé de Riot se paga por horas (precio sin confirmar: VERIFICAR).", resenas: "Visitantes destacan la zona de prueba de equipos junto a la entrada y la tienda de Riot.", wiki: 'LoL_Park', ciudad: 'seul', cat: 'lol', es: 'LoL Park (CHZZK LoL Park)', ko: '롤파크', romanizacion: 'Rol Pakeu',
    direccion_en: 'Gran Seoul, Torre 1, planta 3 · 33 Jong-ro, Jongno-gu (metro Jonggak, línea 1)',
    desc: 'El estadio de la liga coreana (LCK), donde juegan T1 y Faker. Además: cibercafé de Riot, cafetería y Riot Store con merchandising. En noviembre no hay liga, pero la tienda y el cibercafé suelen abrir.',
    nota: 'Algunas webs dan otra dirección y el horario cambia según la temporada: VERIFICAR antes de ir.' },
  { id: 'pl-t1-hongdae', precio: "Cibercafé: unos 3.000 ₩/h para turistas según un blog de 2026 (otras webs dan más; las salas premium, 20.000-25.000 ₩/h). VERIFICAR.", resenas: "\"Algo más caro que un cibercafé normal, pero merece la pena\" (reseñas de 2023-2026).", wiki: 'T1_(esports)', ciudad: 'seul', cat: 'lol', es: 'T1 Base Camp Hongdae', ko: 'T1 베이스캠프 홍대', romanizacion: 'T1 Beiseukaempeu Hongdae',
    direccion_en: 'B1, 147 Yanghwa-ro, Mapo-gu (metro Hongik Univ., salida 1)',
    desc: 'El cibercafé oficial de T1 (2023): ordenadores de gama alta, exposición de camisetas e historia del equipo, figura de Faker a tamaño real, tienda oficial y platos con nombres de jugadores. Unos 2.000 ₩ la hora.',
    nota: 'Cibercafé 24 h; tienda 11-22 h según una web: VERIFICAR.' },
  { id: 'pl-t1-hq', wiki: 'T1_(esports)', ciudad: 'seul', cat: 'lol', es: 'T1 HQ Shop (tienda oficial de T1)', ko: 'T1 HQ 샵', romanizacion: 'T1 HQ syap', aprox: true,
    direccion_en: '627 Seolleung-ro, Gangnam-gu (planta baja de la sede de T1; metro Seonjeongneung, salida 1, 5 min)',
    desc: 'La tienda oficial en la sede del equipo de Faker: camisetas oficiales, gorras, figuras y libretas. Al lado, el T1 Cafe & Arena. Os pilla cerca de Bongeunsa y Coex (día 7).',
    nota: 'En 2024 abría de 12:00 a 20:00 todos los días y el café de martes a sábado: VERIFICAR.', precio: 'Camisetas y merchandising oficial a precio de tienda oficial: VERIFICAR.' },
  { id: 'pl-t1-gangnam', precio: "Similar al de Hongdae (por horas). VERIFICAR.", wiki: 'T1_(esports)', ciudad: 'seul', cat: 'lol', es: 'T1 Base Camp Gangnam', ko: 'T1 베이스캠프 강남', romanizacion: 'T1 Beiseukaempeu Gangnam',
    direccion_en: 'Junto al metro Sinnonhyeon (líneas 9 y Sinbundang)',
    desc: 'El T1 Base Camp más grande (abierto en octubre de 2026): cibercafé, sala de trofeos, tienda y el restaurante "Hide on Bouche".',
    nota: 'Recién abierto: dirección exacta y horario, VERIFICAR.' },
  { id: 'pl-t1-busan', precio: "Por horas, como los de Seúl. VERIFICAR.", wiki: 'T1_(esports)', ciudad: 'busan', cat: 'lol', es: 'T1 Base Camp Busan', ko: 'T1 베이스캠프 부산', romanizacion: 'T1 Beiseukaempeu Busan',
    direccion_ko: '부산 해운대구 구남로 37, 2층', direccion_en: '2F, 37 Gunam-ro, Haeundae-gu (metro Haeundae, salida 3)',
    desc: 'Cibercafé, tienda y pub de T1 en la calle que baja de la estación de Haeundae a la playa. La final del Mundial (Worlds 2026) se juega en Nueva York el 14 nov: en Corea es la mañana del 15, antes de vuestro bus a Jeonju.',
    nota: 'Cibercafé 24 h, tienda 11-22 h, pub 16-24 h según su cuenta oficial: VERIFICAR. Comprobar la hora de la final.' },
  // ✨ Curioso: cafés de animales, postres muy valorados y tiendas raras (búsqueda web nov 2026; ubicación aproximada).
  { id: 'pl-roofcat', wiki: "Cat_café", precio: "Entrada en la web de reservas: 13.500 ₩ (tarifa de niños y jóvenes; la de adultos, VERIFICAR en la puerta).", resenas: "Muchos gatos y local cuidado, según las webs de reservas.", ic: '🐱', ciudad: 'seul', cat: 'curioso', es: 'Cafetería de gatos Roof Cat Me (Myeongdong)', ko: '루프캣미 명동점', romanizacion: 'Rupeukaemi Myeongdong-jeom', aprox: true,
    direccion_en: '2.ª planta, 27 Myeongdong 8ga-gil, Jung-gu (a 5 min del hotel)',
    desc: 'Cafetería con muchos gatos para jugar y acariciar: se paga entrada con bebida. Perfecta para un rato tranquilo a la vuelta del hotel.',
    nota: 'Según una web de reservas de 2026: 12-22 h, cierra el 1.er y 3.er lunes de cada mes. VERIFICAR.' },
  { id: 'pl-thanksnature', wiki: "Sheep", precio: "Sin entrada: se paga la consumición. Café 5.500-7.000 ₩, gofres 5.000-12.000 ₩ (Trazy, sin fecha: VERIFICAR).", resenas: "Muy buenas: gofres ricos y personal amable; las ovejas son la estrella. En verano las llevan a la granja (en noviembre deberían estar).", ic: '🐑', ciudad: 'seul', cat: 'curioso', es: 'Thanks Nature Cafe (ovejas, Hongdae)', ko: '땡스네이쳐카페', romanizacion: 'Ttaengseu Neicheo Kape', aprox: true,
    direccion_en: 'Hongdae, cerca del metro Hongik Univ.',
    desc: 'La cafetería de animales más veterana de Seúl: dos ovejas en un patio vallado y tartas y gofres. Cuadra con el día de Hongdae.',
    nota: 'Guías de 2026 la siguen citando, pero sin fecha clara: VERIFICAR que siguen las ovejas y el horario.' },
  { id: 'pl-bauhouse', wiki: "Dog", precio: "Sin entrada; consumición obligatoria (unos 8.000 ₩ según guías antiguas) y chuches para los perros desde unos 4.000 ₩.", resenas: "Perros sueltos, local limpio y ambiente tranquilo según reseñas antiguas. ⚠️ Un directorio la da por CERRADA: mirad Naver antes de ir.", ic: '🐶', ciudad: 'seul', cat: 'curioso', es: 'Bau House (cafetería de perros, Hongdae)', ko: '바우하우스', romanizacion: 'Bauhauseu', aprox: true,
    direccion_en: 'Hongdae (zona Hapjeong-Hongik Univ.)',
    desc: 'Cafetería con perros de muchas razas sueltos por el local; se paga la bebida. Muy popular entre turistas.',
    nota: 'Ubicación aproximada: buscarla en Naver por el nombre en hangul. Horario VERIFICAR.' },
  { id: 'pl-londonbagel', wiki: "Bagel", precio: "De unos 4.800 a 9.000 ₩ por bagel (junio de 2025).", opiniones: {"v": 3.5, "n": 113, "fuente": "Polle"}, resenas: "Colas larguísimas desde que abre; los bagels de patata y queso y de pretzel con mantequilla, los más pedidos.", ic: '🥯', ciudad: 'seul', cat: 'curioso', es: 'London Bagel Museum (Anguk)', ko: '런던베이글뮤지엄 안국점', romanizacion: 'Londeon Beigeul Myujieom Anguk-jeom', aprox: true,
    direccion_en: 'Junto a la salida 2 del metro Anguk (línea 3)',
    desc: 'La panadería más famosa de Seúl: bagels de patata con queso o de pretzel con mantequilla. Hay cola desde que abre.',
    nota: 'Según varias guías: 8-18 h, mejor a primera hora. VERIFICAR. Os pilla al lado de Bukchon e Insadong.' },
  { id: 'pl-onion', wiki: "Hanok", precio: "Bollería y café a precio de cafetería de Seúl (no encontré precios actuales).", ic: '🥐', ciudad: 'seul', cat: 'curioso', es: 'Cafe Onion Anguk (hanok)', ko: '카페 어니언 안국', romanizacion: 'Kape Eonieon Anguk', aprox: true,
    direccion_en: 'Junto al metro Anguk (línea 3)',
    desc: 'Bollería en una gran casa tradicional hanok: se come sentado en el suelo bajo las vigas de madera. Famoso su pandoro con azúcar glas.',
    nota: 'Suele haber cola. Horario VERIFICAR.' },
  { id: 'pl-ssamziegil', wiki: "Insadong", precio: "Entrar es gratis; artesanía y recuerdos desde pocos miles de wones.", ic: '🌀', ciudad: 'seul', cat: 'curioso', es: 'Ssamziegil (Insadong)', ko: '쌈지길', romanizacion: 'Ssamjigil', aprox: true,
    direccion_en: 'Calle principal de Insadong',
    desc: 'Edificio en rampa de espiral con decenas de tiendecitas de artesanía, papel, cerámica y regalos raros hechos a mano.',
    nota: 'Os pilla en el día de Insadong. Horario VERIFICAR.' },
  { id: 'pl-hongdaemarket', wiki: "Hongik_University", precio: "Entrada libre.", ic: '🎨', ciudad: 'seul', cat: 'curioso', es: 'Hongdae Free Market (mercadillo de artistas)', ko: '홍대 프리마켓', romanizacion: 'Hongdae Peurimaket', aprox: true,
    direccion_en: 'Parque infantil Hongik, frente a la universidad (metro Hongik Univ., salida 9)',
    desc: 'Mercadillo de artistas: ilustraciones, joyas, objetos hechos a mano y música en directo.',
    nota: 'Solo sábados 13-18 h de marzo a noviembre: el sábado 7 estáis en Seúl. VERIFICAR que se celebra.' },
  { id: 'pl-gwangjang-vintage', wiki: "Gwangjang_Market", precio: "Prendas de segunda mano desde unos 10.000 ₩; se regatea poco (orientativo).", ic: '👕', ciudad: 'seul', cat: 'curioso', es: 'Ropa vintage del mercado Gwangjang', ko: '광장시장 구제상가', romanizacion: 'Gwangjang Sijang Guje Sangga', aprox: true,
    direccion_en: 'Planta de arriba del mercado Gwangjang',
    desc: 'Un laberinto de puestos de ropa de segunda mano y vintage, a precios de mercado. Ideal antes o después de comer en el mercado.',
    nota: 'Los puestos cierran antes que los de comida. VERIFICAR horario.' },
  { id: 'pl-haeridan', wiki: "Haeundae_District", precio: "Pasear es gratis; cafés y postres a precio normal.", ic: '🚂', ciudad: 'busan', cat: 'curioso', es: 'Haeridan-gil (callejón junto a la antigua estación de Haeundae)', ko: '해리단길', romanizacion: 'Haeridan-gil', aprox: true,
    direccion_en: 'Detrás de la antigua estación de tren de Haeundae',
    desc: 'Callejuelas de casas bajas convertidas en cafés, pastelerías y tiendas pequeñas. Premio nacional de callejones (2019). Muy cerca del hotel.',
    nota: 'Locales cambiantes: mirad Naver para lo que esté abierto.' },
  { id: 'pl-sipwonppang', wiki: "10_won_bread", precio: "Unos 2.500-3.500 ₩ cada uno, según el puesto y el relleno (2023-2024).", ic: '🪙', ciudad: 'gyeongju', cat: 'curioso', es: 'Pan de 10 wones (Hwangnidan-gil)', ko: '십원빵', romanizacion: 'Sibwonppang', aprox: true,
    direccion_en: 'Hwangnidan-gil, junto a los túmulos',
    desc: 'Gofre con forma de moneda gigante de 10 ₩ (la de la pagoda Dabotap de Bulguksa) relleno de queso que se estira. Nació en Gyeongju en 2019.',
    nota: 'Hay varios puestos en la calle. Precio VERIFICAR.' },
  { id: 'pl-pnb', wiki: "Choco_pie", precio: "Choco pies por unidad o en cajas de regalo; taller para hacer 5 choco pies, 20.000 ₩ por persona.", ic: '🍫', ciudad: 'jeonju', cat: 'curioso', es: 'Choco pie de PNB (Pungnyeon Jegwa)', ko: '풍년제과', romanizacion: 'Pungnyeon Jegwa', aprox: true,
    direccion_en: 'Tienda principal en Paldal-ro; también tienda en la aldea hanok',
    desc: 'La pastelería más famosa de Jeonju (desde 1951): choco pie casero con crema y mermelada de fresa, muy distinto al de supermercado. Buen regalo para llevar.',
    nota: 'Las webs dan direcciones distintas para la tienda principal: buscar "풍년제과" en Naver y elegir la más cercana.' },
  // 👕 Ropa: solo tiendas cerca de los hoteles (no hay outlets cerca de ninguno: están a las afueras).
  { id: 'pl-uniqlo-myeongdong', wiki: 'Uniqlo', ic: '👕', ciudad: 'seul', cat: 'ropa', es: 'Uniqlo Myeongdong (la mayor de Corea)', ko: '유니클로 명동점', romanizacion: 'Yunikeullo Myeongdong-jeom', aprox: true,
    direccion_en: 'Edificio del hotel Le Méridien Seoul Myeongdong, Jung-gu',
    desc: 'Tienda insignia abierta el 22 de mayo de 2026: unos 3.300 m², la mayor Uniqlo de Corea, con secciones y colaboraciones exclusivas.',
    nota: 'Ubicación aproximada: buscad "유니클로 명동점" en Naver. Horario VERIFICAR.', precio: 'Precios Uniqlo en Corea (suelen ser parecidos o algo más bajos que en España). Tax free en compras grandes: preguntad en caja.' },
  { id: 'pl-musinsa-myeongdong', wiki: 'Musinsa', ic: '👕', ciudad: 'seul', cat: 'ropa', es: 'Musinsa Standard Myeongdong', ko: '무신사 스탠다드 명동점', romanizacion: 'Musinsa seutaendeodeu Myeongdong-jeom', aprox: true,
    direccion_en: 'Edificio Myeongdong N, plantas 1-3; metro Euljiro 1-ga, salida 6 (1 min)',
    desc: 'La marca propia de Musinsa, la gran tienda online de moda coreana: básicos de buena calidad a buen precio (camisetas, sudaderas, abrigos, pantalones). La que más recomiendan los viajeros en foros para comprar ropa coreana sin pagar marca. Abrió en 2024.',
    nota: 'Horario VERIFICAR. En 2026 abrió otra (Myeongdong Jungang) a 1 min del metro Myeongdong.', precio: 'Precio de cadena: básicos más baratos que en marcas coreanas de diseño.' },
  { id: 'pl-musinsa-hongdae', wiki: 'Musinsa', ic: '👕', ciudad: 'seul', cat: 'ropa', es: 'Musinsa Standard Hongdae (la más grande)', ko: '무신사 스탠다드 홍대점', romanizacion: 'Musinsa seutaendeodeu Hongdae-jeom', aprox: true,
    direccion_ko: '서울 마포구 양화로 144', direccion_en: '144 Yanghwa-ro, Mapo-gu (hotel Mercure Ambassador; metro Hongik Univ., salida 9)',
    desc: 'La tienda insignia, ampliada en 2025 a tres plantas. Os pilla en Hongdae (día 6), barrio con muchas tiendas de marcas coreanas de calle.',
    nota: 'Según Musinsa, de 11:00 a 23:00 todos los días: VERIFICAR.', precio: 'Como la de Myeongdong.' },
  { id: 'pl-myeongdong-under', ic: '🛍️', ciudad: 'seul', cat: 'ropa', es: 'Centro comercial subterráneo de Myeongdong', ko: '명동지하쇼핑센터', romanizacion: 'Myeongdong jiha syopping senteo', aprox: true,
    direccion_ko: '서울 중구 남대문로 지하72', direccion_en: 'Bajo Namdaemun-ro; metro Euljiro 1-ga, salida 7',
    desc: 'Galería bajo tierra con tiendas pequeñas de ropa y gafas: más barato que en la calle de arriba, para regatear un poco. Los viajeros la recomiendan para ropa y bolsos baratos.',
    nota: 'Según el Ayuntamiento, de 09:00 a 22:00 todos los días (cada tienda tiene su horario).', precio: 'Barato; calidad variable.' },
  { id: 'pl-hoehyeon-under', ic: '🛍️', ciudad: 'seul', cat: 'ropa', es: 'Galería subterránea de Hoehyeon (ropa y vinilos)', ko: '회현지하쇼핑센터', romanizacion: 'Hoehyeon jiha syopping senteo', aprox: true,
    direccion_ko: '서울 중구 소공로 지하58', direccion_en: 'Entre Myeongdong y el mercado Namdaemun; metro Hoehyeon, salida 7',
    desc: 'Ropa, antigüedades y la mayor concentración de tiendas de vinilos y audio de segunda mano de Seúl. Os pilla en el camino al mercado Namdaemun (día 7).',
    nota: 'Según el Ayuntamiento, de 09:00 a 22:00; cierra el primer y tercer domingo de cada mes.', precio: 'Barato a medio.' },
  { id: 'pl-musinsa-centum', wiki: 'Musinsa', ic: '👕', ciudad: 'busan', cat: 'ropa', es: 'Musinsa Standard (Lotte Centum City)', ko: '무신사 스탠다드 롯데백화점 센텀시티점', romanizacion: 'Musinsa seutaendeodeu Lotte baekhwajeom Senteomsiti-jeom', aprox: true,
    direccion_en: 'Lotte Department Store Centum City, planta 1; metro Centum City (línea 2), a 2 paradas de Haeundae',
    desc: 'Los mismos básicos de calidad y buen precio que en Seúl, en el centro comercial de Centum City, al lado del enorme Shinsegae Centum City.',
    nota: 'Abrió en 2024 según la prensa: que siga abierta y horario, VERIFICAR.', precio: 'Como en Seúl.' },
  { id: 'pl-spao-myeongdong', wiki: 'E-Land', ic: '👕', ciudad: 'seul', cat: 'ropa', es: 'SPAO Myeongdong (moda coreana barata)', ko: '스파오 명동점', romanizacion: 'Seupao Myeongdong-jeom', aprox: true,
    direccion_en: 'Calle principal de Myeongdong (edificio de 5 plantas)',
    desc: 'La "Uniqlo coreana": ropa básica barata y colaboraciones con grupos de K-pop y personajes. Su primera tienda grande (2009).',
    nota: 'Horario VERIFICAR.', precio: 'Básicos baratos; camisetas y sudaderas a precio de cadena de moda rápida.' },
  { id: 'pl-uniqlo-andong', wiki: 'Uniqlo', ic: '👕', ciudad: 'andong', cat: 'ropa', es: 'Uniqlo Andong', ko: '유니클로 안동점', romanizacion: 'Yunikeullo Andong-jeom', aprox: true,
    direccion_en: 'Centro de Andong, junto a la antigua estación (cerca del hotel)',
    desc: 'Uniqlo del centro de Andong, abierta en 2018 junto a la antigua estación de tren.',
    nota: 'Solo hay noticia de su apertura (2018): VERIFICAR en Naver que sigue abierta.', precio: 'Precios Uniqlo en Corea.' },
  // Lavanderías: no hay una fiable cerca de cada hotel en las webs; Naver enseña las más cercanas.
  { id: 'pl-lav-seul', wiki: 'Laundromat', ciudad: 'seul', cat: 'servicio', es: 'Lavandería de autoservicio cerca del hotel (Myeongdong)', ko: '셀프빨래방', direccion_ko: '명동 셀프빨래방', romanizacion: 'Selpeu ppallaebang',
    desc: 'En Corea se llaman 셀프빨래방 o 코인빨래방: lavadora y secadora con monedas o tarjeta, abiertas casi siempre 24 h. Toca Naver para ver las más cercanas al hotel.',
    nota: 'Muchos hoteles de Myeongdong tienen lavandería para clientes (unos 3.000 ₩ por lavado o secado): preguntad en recepción.', precio: 'Lavado unos 4.000-5.000 ₩ y secado parecido, por carga (orientativo).' },
  { id: 'pl-lav-andong', wiki: 'Laundromat', ciudad: 'andong', cat: 'servicio', es: 'Lavandería de autoservicio en Andong', ko: '셀프빨래방', direccion_ko: '안동 셀프빨래방', romanizacion: 'Selpeu ppallaebang',
    desc: 'Toca Naver para ver las lavanderías de autoservicio más cercanas al hotel.', precio: 'Lavado unos 4.000-5.000 ₩ y secado parecido, por carga (orientativo).' },
  { id: 'pl-lav-gyeongju', wiki: 'Laundromat', ciudad: 'gyeongju', cat: 'servicio', es: 'Lavandería de autoservicio en Gyeongju', ko: '셀프빨래방', direccion_ko: '경주 황오동 셀프빨래방', romanizacion: 'Selpeu ppallaebang',
    desc: 'Toca Naver para ver las lavanderías de autoservicio más cercanas al hotel (zona Hwango-dong).', precio: 'Lavado unos 4.000-5.000 ₩ y secado parecido, por carga (orientativo).' },
  { id: 'pl-lav-jeonju', wiki: 'Laundromat', ciudad: 'jeonju', cat: 'servicio', es: 'Lavandería de autoservicio en Jeonju', ko: '셀프빨래방', direccion_ko: '전주 한옥마을 셀프빨래방', romanizacion: 'Selpeu ppallaebang',
    desc: 'Toca Naver para ver las más cercanas a la aldea hanok. Algunos hanoks y guesthouses tienen lavadora para clientes: preguntad en el alojamiento.', precio: 'Lavado unos 4.000-5.000 ₩ y secado parecido, por carga (orientativo).' },
  { id: 'pl-lav-jungdong', precio: "Lavado unos 4.000-5.000 ₩ y secado parecido, por carga (orientativo).", wiki: 'Laundromat', ciudad: 'busan', cat: 'servicio', es: 'Lavandería Cleantopia Coin Wash Haeundae Jung-dong', ko: '크린토피아 코인워시 해운대중동점', romanizacion: 'Keurintopia Koinwosi Haeundae Jungdong-jeom', aprox: true,
    direccion_en: 'Barrio de Jung-dong (el del hotel y la estación de Haeundae). Buscar en Naver Map por el nombre en hangul.',
    desc: 'Lavandería de autoservicio de una cadena muy común (lavadoras y secadoras con monedas o tarjeta; detergente en máquina). Lavar y secar: hora y media aprox. Idea para el 12 nov: ponerla y cenar en el mercado de Haeundae.',
    nota: '24 h según una web de listados: VERIFICAR. Ubicación exacta sin confirmar: la distancia es aproximada. Antes de ir, preguntad en el hotel: "세탁기 있어요?" (¿tienen lavadora?); una reseña dice que tiene.' },
  { id: 'pl-lav-jwadong', precio: "Lavado unos 4.000-5.000 ₩ y secado parecido, por carga (orientativo).", wiki: 'Laundromat', ciudad: 'busan', cat: 'servicio', es: 'Lavandería Coin Wash 365 Jwadong', ko: '크린토피아 코인워시365 좌동대승점', romanizacion: 'Koinwosi 365 Jwadong Daeseung-jeom', aprox: true,
    direccion_ko: '부산 해운대구 세실로 31', direccion_en: '31 Sesil-ro, Jwa-dong, Haeundae-gu · tel. 051-704-3337',
    desc: 'Otra lavandería de autoservicio de la misma cadena, en Jwa-dong (barrio residencial al este de Haeundae): alternativa si la de Jung-dong no os encaja.',
    nota: '365 días, 24 h según su ficha: VERIFICAR. Coordenadas aproximadas.' },
  // v223: más Curioso y Ropa en Busan y Jeonju (ubicaciones aproximadas; lo dudoso, VERIFICAR).
  { id: 'pl-millak-park', wiki: 'Gwangan_Bridge', ic: '🐟', ciudad: 'busan', cat: 'curioso', es: 'Parque Millak Waterfront (pescado frente al puente)', ko: '민락수변공원', romanizacion: 'Millak Subyeon Gongwon', aprox: true,
    precio: 'Gratis. El pescado se compra en el Millak Town Raw Fish Centre, al lado (unos 30.000 ₩ según la LP 2024; preguntad el precio por kilo).',
    direccion_en: 'Millak-dong, Suyeong-gu (entre Haeundae y Gwangalli)',
    desc: 'El primer parque junto al mar de Corea: gradas de piedra frente al puente Gwangan donde la gente se sienta a comer pescado crudo comprado al lado. Plan muy local para antes o después de los drones.',
    nota: 'Desde julio de 2023 es zona sin alcohol de 21:00 a 2:00 (prensa coreana). Hay zona de tiendas de campaña.' },
  { id: 'pl-yate', wiki: 'Gwangan_Bridge', ic: '⛵', ciudad: 'busan', cat: 'curioso', es: 'Paseo en yate al anochecer (puente Gwangan)', ko: '수영만 요트경기장', romanizacion: 'Suyeongman Yoteu Gyeonggijang', aprox: true,
    precio: 'Yates en grupo de 1 h: unos 19.000-30.000 ₩ por persona; privados, mucho más (webs de reservas de 2026: VERIFICAR).',
    direccion_en: 'Puerto deportivo de la bahía de Suyeong (también salen desde The Bay 101, junto al hotel)',
    desc: 'Una hora en yate por la bahía con el puente Gwangan iluminado. El sábado, a las 19:00 o 21:00, los drones se ven desde el mar.',
    nota: 'Se reserva en Klook, Trazy o Seoul Travel Pass. Con viento o mar mal se cancela: VERIFICAR el día antes.' },
  { id: 'pl-spaland', wiki: 'Jjimjilbang', ic: '♨️', ciudad: 'busan', cat: 'curioso', es: 'Spa Land Centum City (jjimjilbang)', ko: '스파랜드 센텀시티', romanizacion: 'Seuparaendeu Senteomsiti', aprox: true,
    precio: 'Unos 20.000-24.000 ₩ por 4 horas según la web de reservas; 5.000 ₩ por hora extra (VERIFICAR).',
    direccion_en: 'Dentro de los grandes almacenes Shinsegae Centum City; metro Centum City (línea 2), salida 12',
    desc: 'Una de las saunas coreanas más famosas del país: baños termales, saunas temáticas y zona de descanso con pijama. Plan perfecto si llueve o para acabar el día.',
    nota: 'Solo mayores de 8 años; puede haber pegas con los tatuajes. Comida y bebida aparte. Horario VERIFICAR (las webs no coinciden).' },
  { id: 'pl-samjin', wiki: 'Eomuk', ic: '🍢', ciudad: 'busan', cat: 'curioso', es: 'Samjin Eomuk, tienda madre (Yeongdo)', ko: '삼진어묵 본점', romanizacion: 'Samjin Eomuk bonjeom', aprox: true,
    precio: 'Piezas de eomuk sueltas y en cajas; taller de hacer eomuk con reserva previa (precio VERIFICAR).',
    direccion_ko: '부산 영도구 태종로99번길 36', direccion_en: '36 Taejong-ro 99beon-gil, Yeongdo-gu',
    desc: 'La casa de pastel de pescado (eomuk) más famosa de Busan, desde 1953. Planta baja como una pastelería de eomuk para probar; arriba, pequeño museo y taller para hacerlo vosotros.',
    nota: 'Según webs coreanas, de martes a domingo 9:00-18:00, cerrado los lunes: VERIFICAR. Hay tiendas de Samjin también en Busan Station.' },
  { id: 'pl-ssiat-hotteok', wiki: 'Hotteok', ic: '🥞', ciudad: 'busan', cat: 'curioso', es: 'Ssiat hotteok de BIFF Square (Nampo-dong)', ko: '씨앗호떡', romanizacion: 'Ssiat hotteok', aprox: true,
    precio: 'Unos 2.000 ₩ la pieza (VERIFICAR).', direccion_en: 'BIFF Square, Nampo-dong, Jung-gu',
    desc: 'El postre callejero emblema de Busan: tortita frita rellena de azúcar moreno y abierta para meterle pipas y frutos secos. Puestos en la plaza del festival de cine, junto al mercado Gukje y Jagalchi.',
    nota: 'Hay colas en el puesto más conocido; cualquiera de la plaza sirve.' },
  { id: 'pl-seomyeon-under', wiki: 'Seomyeon', ic: '👕', ciudad: 'busan', cat: 'ropa', es: 'Galería subterránea de Seomyeon', ko: '서면지하도상가', romanizacion: 'Seomyeon jihado sangga', aprox: true,
    precio: 'Ropa y accesorios baratos; se regatea poco.', direccion_en: 'Bajo la estación de metro Seomyeon (líneas 1 y 2)',
    desc: 'Kilómetros de tiendas bajo tierra alrededor del metro de Seomyeon, el gran cruce de líneas de Busan: ropa juvenil, zapatos, calcetines y cosmética a buen precio. De paso si cambiáis de línea en Seomyeon.',
    nota: 'Horario de las tiendas, más o menos de 10:00 a 21:00: VERIFICAR.' },
  { id: 'pl-gwangbok', wiki: 'Gwangbok-dong', ic: '👕', ciudad: 'busan', cat: 'ropa', es: 'Calle comercial Gwangbok-ro (Nampo-dong)', ko: '광복로', romanizacion: 'Gwangbok-ro', aprox: true,
    precio: 'Marcas coreanas e internacionales; precios normales.', direccion_en: 'Gwangbok-ro, Jung-gu (entre BIFF Square y Lotte Department Store Gwangbok)',
    desc: 'La calle de tiendas del centro antiguo de Busan, peatonal en buena parte: marcas de ropa, zapatillas y cosmética, junto a BIFF Square y el mercado Gukje. Encaja con el día de Jagalchi.',
    nota: 'En noviembre-diciembre suele haber iluminación navideña: VERIFICAR.' },
  { id: 'pl-shinsegae-centum', wiki: 'Shinsegae_Centum_City', ic: '👕', ciudad: 'busan', cat: 'ropa', es: 'Shinsegae Centum City (grandes almacenes)', ko: '신세계 센텀시티', romanizacion: 'Sinsegye Senteomsiti', aprox: true,
    precio: 'Grandes almacenes: de marcas asequibles a lujo; Tax Free con pasaporte.', direccion_en: 'Centum City, Haeundae-gu (junto a Lotte Centum, metro Centum City)',
    desc: 'Figuró en el Guinness como el mayor centro comercial del mundo (2009). Ropa de todo tipo, cines, pista de hielo y el spa Spa Land. A un paso de Musinsa Standard (Lotte Centum) y cerca del hotel.',
    nota: 'Horario de grandes almacenes, más o menos 10:30-20:00: VERIFICAR.' },
  { id: 'pl-gilgeoriya', wiki: 'Jeonju_Hanok_Village', ic: '🥖', ciudad: 'jeonju', cat: 'curioso', es: 'Gilgeoriya, la «baguette burger» (aldea hanok)', ko: '길거리야', romanizacion: 'Gilgeoriya', aprox: true,
    precio: 'Unos 5.500-6.000 ₩ por baguette según reseñas de 2025-2026 (VERIFICAR).', direccion_ko: '전주 완산구 경기전길 124', direccion_en: '124 Gyeonggijeon-gil, Wansan-gu',
    desc: 'El tentempié más famoso de la aldea hanok: una baguette vaciada y rellena de carne picada salteada, col y salsa un poco picante. Suele haber cola, pero va rápida.',
    nota: 'Opiniones divididas: a unos les encanta y a otros les parece sobrevalorada.' },
  { id: 'pl-gyodong-dawon', wiki: 'Jeonju_Hanok_Village', ic: '🍵', ciudad: 'jeonju', cat: 'curioso', es: 'Casa de té Gyodong Dawon (en un hanok)', ko: '교동다원', romanizacion: 'Gyodong Dawon', aprox: true,
    precio: 'Té tradicional a precio de cafetería (VERIFICAR).', direccion_ko: '전주 완산구 은행로 65-5', direccion_en: '65-5 Eunhaeng-ro, Wansan-gu',
    desc: 'Casa de té tradicional en dos casas hanok de la aldea: una para sentarse en el suelo y otra con mesas. Té verde de la zona y tés de frutas, con calma, lejos del jaleo de la calle principal.',
    nota: 'Horario VERIFICAR en Naver.' },
  { id: 'pl-gaeksa-gil', wiki: 'Jeonju', ic: '👕', ciudad: 'jeonju', cat: 'ropa', es: 'Gaeksa-gil (calle de tiendas juveniles)', ko: '객사길', romanizacion: 'Gaeksa-gil', aprox: true,
    precio: 'Ropa y accesorios asequibles.', direccion_en: 'Alrededor de Jeonju Gaeksa, al norte de la puerta Pungnammun',
    desc: 'El barrio de compras de los jóvenes de Jeonju, alrededor del antiguo pabellón de huéspedes Gaeksa: tiendas de ropa, zapatillas, cafés y fotomatones. A 10-15 min a pie de la aldea hanok.',
    nota: 'Tiendas cambiantes: mirad Naver para lo que esté abierto.' }
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

// Horarios de los sitios del itinerario (noviembre, búsqueda web nov 2026). Clave: hangul sin espacios.
// a/c = abre/cierra (HH:MM), u = última entrada, x = días de cierre (0 dom … 6 sáb), d = minutos de visita,
// t = texto corto, n = nota, v = VERIFICAR. Sin a/c = zona abierta (sin horario).
const HORARIOS = {
  '국립민속박물관': { a: '09:00', c: '17:00', u: '16:00', d: 60, t: '9:00-17:00 en invierno (de marzo a octubre, hasta las 18:00; última entrada 1 h antes)', n: 'Gratis. Dentro del recinto de Gyeongbokgung, a la salida del palacio.', v: true },
  '세종문화회관': { a: '10:00', c: '18:30', x: [1], d: 40, t: 'Exposición «Sejong y Chungmugong» (bajo la plaza): 10:00-18:30 · cierra los lunes', n: 'Gratis. Entrada detrás de la estatua del rey Sejong o por el sótano del Centro Cultural.', v: true },
  '흰여울문화마을': { d: 75, t: 'Barrio abierto; los cafés cierran a media tarde' },
  '해운대블루라인파크': { a: '09:00', c: '19:00', d: 60, t: 'Tren de la playa 09:00-19:00 y Sky Capsule hasta las 18:00 (horario de noviembre, 2026)', n: 'Tren: 10.000 ₩ desde Mipo o Songjeong, 8.000 ₩ desde Cheongsapo. Sky Capsule (Mipo↔Cheongsapo): 50.000 ₩ la cabina de 2. Reservad en bluelinepark.com.', v: true },
  '경복궁': { a: '09:00', c: '17:00', u: '16:00', x: [2], d: 120, t: '9:00-17:00 (última entrada 16:00)', n: 'Gratis con hanbok. Cambio de guardia en Gwanghwamun.' },
  '창덕궁': { a: '09:00', c: '17:30', u: '16:30', x: [1], d: 120, t: '9:00-17:30 (última entrada 16:30)', n: 'Jardín secreto aparte: visitas en grupo, 10:00-16:30; reservar.' },
  '덕수궁': { a: '09:00', c: '21:00', u: '20:00', x: [1], d: 75, t: '9:00-21:00 (última entrada 20:00)', n: 'El palacio que cierra más tarde: bonito de noche.' },
  '서대문형무소역사관': { a: '09:30', c: '17:00', u: '16:30', x: [1], d: 90, t: '9:30-17:00 en noviembre (última entrada 16:30)' },
  '서울역사박물관': { a: '09:00', c: '18:00', x: [1], d: 75, t: '9:00-18:00', v: true },
  '남산골한옥마을': { a: '09:00', c: '20:00', x: [1], d: 60, t: '9:00-20:00 aprox.', v: true },
  '국립중앙박물관': { a: '10:00', c: '18:00', x: [], d: 150, t: '10:00-18:00 (miércoles y sábado hasta las 21:00)', n: 'Gratis.' },
  '국립경주박물관': { a: '10:00', c: '18:00', x: [], d: 90, t: '10:00-18:00', v: true, n: 'Gratis.' },
  '불국사': { a: '09:00', c: '18:00', u: '17:00', x: [], d: 90, t: 'unas 9:00-18:00 (última entrada 17:00)', v: true, n: 'Las webs dan horarios algo distintos según la temporada.' },
  '석굴암': { a: '09:00', c: '17:00', x: [], d: 45, t: 'unas 9:00-17:00', v: true },
  '대릉원': { a: '09:00', c: '22:00', u: '21:00', x: [], d: 60, t: '9:00-22:00 (última entrada 21:00)' },
  '동궁과월지': { a: '09:00', c: '22:00', u: '21:30', x: [], d: 60, t: '9:00-22:00 (mejor al anochecer, iluminado)' },
  '첨성대': { d: 20, t: 'Exterior, siempre visible; iluminado de noche' },
  '안동하회마을': { a: '09:00', c: '17:00', u: '16:30', x: [], d: 150, t: '9:00-17:00 de octubre a marzo (última entrada 16:30)', v: true },
  '하회별신굿탈놀이': { a: '14:00', c: '15:00', x: [1], d: 60, t: 'Función a las 14:00 de martes a domingo (marzo-diciembre; enero-febrero solo fines de semana); 1 h', v: true },
  '삼신당': { d: 15, t: 'Dentro de la aldea (abierta 9:00-17:00 de octubre a marzo)' },
  '만송정': { d: 20, t: 'Dentro de la aldea, junto al río' },
  '하회장터': { d: 35, t: 'Restaurantes y tiendas junto a la taquilla; horario de cada local VERIFICAR', v: true },
  'museodemascarasdehahoe': { a: '09:30', c: '18:00', x: [], d: 45, t: '9:30-18:00', v: true, n: 'Gratis según una web.' },
  '도산서원': { a: '09:00', c: '17:00', x: [], d: 60, t: 'unas 9:00-17:00 en invierno', v: true },
  '봉정사': { d: 60, t: 'Templo: de día (sin horario fijo publicado)', v: true },
  '경기전': { a: '09:00', c: '18:00', x: [], d: 60, t: 'unas 9:00-18:00', v: true, n: 'El museo de retratos reales estuvo cerrado por obras: comprobad si ya ha reabierto.' },
  '전주향교': { a: '10:00', c: '17:00', x: [1], d: 30, t: '10:00-17:00 en invierno', n: 'Cierra los lunes.' },
  '남부시장': { a: '07:00', c: '19:00', x: [], d: 60, t: 'Mercado de día; el mercado nocturno solo viernes y sábado (18:00-23:00 aprox.)', v: true, noche: [5, 6] },
  '해동용궁사': { a: '04:30', c: '19:20', u: '18:50', x: [], d: 60, t: '4:30-19:20 (última entrada 18:50)', n: 'Gratis. Famoso al amanecer.' },
  '자갈치시장': { a: '05:00', c: '22:00', x: [], d: 60, t: 'unas 5:00-22:00', v: true, n: 'Algunas webs dicen que cierra el 1.er y 3.er martes del mes.' },
  '국제시장': { a: '09:00', c: '20:00', x: [], d: 60, t: 'unas 9:00-20:00 (según el puesto)', v: true },
  '감천문화마을': { d: 90, t: 'Barrio abierto; tiendas y centro de información unas 9:00-18:00', v: true },
  '남대문시장': { a: '07:00', c: '23:00', x: [0], d: 60, t: 'Según el puesto; muchos cierran los domingos', v: true },
  '광장시장': { a: '09:00', c: '23:00', x: [], d: 75, t: 'Puestos de comida hasta tarde; las tiendas de telas cierran antes y muchas el domingo', v: true },
  'N서울타워': { a: '10:00', c: '23:00', x: [], d: 75, t: 'Mirador unas 10:00-23:00', v: true },
  '별마당도서관': { a: '10:30', c: '22:00', x: [], d: 30, t: '10:30-22:00', v: true },
  '코엑스': { a: '10:30', c: '22:00', x: [], d: 60, t: 'Centro comercial unas 10:30-22:00', v: true },
  '봉은사': { d: 45, t: 'Templo abierto todo el día', v: true },
  '조계사': { d: 30, t: 'Templo abierto todo el día' },
  '명동성당': { d: 30, t: 'Abierta todos los días; respetad las misas', v: true },
  '드래곤힐스파': { d: 150, t: 'Abierto 24 h' },
  '북촌한옥마을': { a: '10:00', c: '17:00', x: [], d: 75, t: 'Zona residencial: visitas turísticas de 10:00 a 17:00 en la zona más protegida', v: true },
  '명동': { d: 90, t: 'Zona abierta; puestos de comida por la tarde-noche' },
  '청계천': { d: 45, t: 'Paseo abierto siempre' }, '인사동': { d: 60, t: 'Calle abierta; tiendas unas 10:00-20:00' }, '익선동': { d: 60, t: 'Callejones abiertos; cafés desde media mañana' },
  '서촌': { d: 60, t: 'Barrio abierto' }, '광화문광장': { d: 20, t: 'Plaza abierta' }, '홍대': { d: 120, t: 'Barrio abierto; mejor por la tarde-noche' },
  '부용대': { d: 45, t: 'Mirador abierto (se llega en barca o a pie)' }, '황리단길': { d: 60, t: 'Calle abierta; tiendas unas 10:00-21:00' }, '교촌마을': { d: 45, t: 'Aldea abierta' },
  '월정교': { d: 30, t: 'Puente abierto; iluminado de noche' }, '분황사': { d: 30, t: 'Templo de día', v: true }, '월영교': { d: 30, t: 'Puente abierto; iluminado de noche' },
  '광안리M드론라이트쇼': { a: '19:00', c: '21:15', x: [0, 1, 2, 3, 4, 5], d: 15, t: 'Sábados a las 19:00 y 21:00 (oct.-feb.); unos 12 min; gratis', v: true },
  '해운대해수욕장': { d: 45, t: 'Playa abierta' }, '동백섬': { d: 60, t: 'Paseo abierto' }, '광안리해수욕장': { d: 60, t: 'Playa abierta; puente iluminado de noche' },
  '송도해수욕장': { d: 60, t: 'Playa abierta (el teleférico tiene su horario)' }, 'BIFF광장': { d: 30, t: 'Plaza abierta; puestos por la tarde' }, '청사포': { d: 45, t: 'Pueblo abierto' },
  '전주한옥마을': { d: 120, t: 'Aldea abierta; tiendas unas 10:00-20:00' }, '풍남문': { d: 15, t: 'Puerta, exterior' }, '오목대': { d: 30, t: 'Mirador abierto' },
  '자만마을': { d: 45, t: 'Barrio abierto' }, '이화벽화마을': { d: 45, t: 'Barrio residencial: en silencio' }, '낙산공원': { d: 45, t: 'Parque abierto; precioso al atardecer' }
};

// Cómo llegar sin taxi a los sitios lejanos (datos de webs y blogs coreanos 2019-2026: VERIFICAR la línea y el horario en Naver la víspera).
// Clave = hangul sin espacios del destino. Sale en la Ruta del día cuando el tramo es en taxi.
const SIN_TAXI = {
  '안동하회마을': 'Bus 246 desde la terminal de autobuses de Andong (junto a la estación de tren) hasta Hahoe (하회마을), unos 50 min. Pasa pocas veces (12 idas y vueltas al día en 2019): mirad el horario la víspera. Algunas guías lo llaman bus 210 (número antiguo). Último bus de vuelta hacia las 19:10 según una guía: VERIFICAR. Del bus a la aldea, lanzadera gratis desde la taquilla cada 10-15 min (1 km).',
  '월영교': 'Bus 246 de vuelta de Hahoe a la terminal de Andong (~50 min) y de allí taxi corto o bus 3 hasta Woryeonggyo.',
  '도산서원': 'Bus 567 desde el centro de Andong (solo unas 4 veces al día en 2019) o el bus turístico que sale de la terminal (en 2023: 8:20, 11:20 y 14:40, de martes a domingo).',
  '봉정사': 'No hay bus directo desde Dosan Seowon: volver al centro de Andong y bus 351 a Bongjeongsa (pocas veces al día). Si vais justos de tiempo, aquí compensa el taxi.',
  '불국사': 'Bus 10 u 11 desde la terminal de autobuses de Gyeongju hasta Bulguksa, que es final de línea: ~40-50 min y pasan a menudo.',
  '석굴암': 'Bus 12 desde la parada frente a la taquilla de Bulguksa hasta Seokguram (~15 min). Pasa poco (hay viajeros que esperaron más de 1 h): mirad la hora. Andando por el sendero del bosque, ~1 h de subida. Para volver, bus 12 a Bulguksa y allí el 10 o el 11.',
  '감천문화마을': 'Metro L2 de Haeundae a Seomyeon, cambio a la L1 hasta Toseong (토성), salida 6; frente al centro oncológico del hospital, bus de barrio Saha 1-1, Seogu 2 o Seogu 2-2 hasta Gamcheon (~10 min de cuesta). En total, ~1 h 15.',
  '해동용궁사': 'Bus 181 o 1001 (el que más pasa) desde el metro Haeundae (L2), salida 7, hasta la parada «용궁사·국립수산과학원» (~27 min) y 10-15 min a pie. Otra opción: tren Donghae hasta Osiria y bus 139 o 1001 (4 min).',
  '청사포': 'Bus 181 o 1001 hacia Haeundae hasta Songjeong (송정) y, desde allí, el tren de la playa (Blueline Park) hasta Cheongsapo por la costa. Para volver al hotel: tren o Sky Capsule de Cheongsapo a Mipo, al lado del hotel.',
  '해운대블루라인파크': 'Desde el templo: bus 181 o 1001 hacia Haeundae hasta el metro Haeundae y ~10 min a pie hacia el este, hasta la estación de Mipo del Blueline Park (al final de la playa).',
  '흰여울문화마을': 'Metro L1 hasta Nampo, salida 6, y bus 6, 7, 70, 71 o 508 hacia Yeongdo hasta «흰여울문화마을» o «백련사».'
};

// ⚠️ Mucho ojo con…: sitios famosos con quejas documentadas (prensa o notas bajas de usuarios). ids = comer.json; ko = sitio de Planes.
const MUCHO_OJO = [
  { ciudad: 'seul', ids: ['lp-gwangjang-market'], ko: '광장시장', es: 'Mercado Gwangjang (puestos de comida)',
    txt: 'Quejas repetidas de 2023 a 2025 por cobrar de más a turistas: raciones pequeñas de tortitas variadas a 15.000 ₩, insistir en que pidas más, solo efectivo, y un puesto sancionado 10 días por cobrar 10.000 ₩ un sundae marcado a 8.000. Seúl obliga ahora a poner la cantidad en el menú. Consejo: elegid puestos con precio y ración a la vista y pagad lo que pone.',
    fuentes: [['Hankyung (2025)', 'https://www.hankyung.com/article/2025110686207'], ['Daum (2025)', 'https://v.daum.net/v/XqATf3DgoU']] },
  { ciudad: 'seul', ids: ['myeongdong-street'], ko: '명동', es: 'Puestos callejeros de Myeongdong',
    txt: 'Tienen precio a la vista, pero según la prensa salen un 15-40 % más caros que la media y 1,5-2 veces más que en el mercado Namdaemun; varios pinchos sueltos pasan de 20.000 ₩. Para probar, bien; para cenar barato, Namdaemun o una casa de comidas.',
    fuentes: [['Dailian (2024)', 'https://www.dailian.co.kr/news/view/1318274/']] },
  { ciudad: 'busan', ids: ['jagalchi'], ko: '자갈치시장', es: 'Mercado Jagalchi (marisco «a precio de mercado»)',
    txt: 'En 2025 se denunció un plato con 2-3 pepinos de mar a 70.000 ₩ marcado solo como «시가» (precio de mercado); hubo multa por no poner precios. Consejo: preguntad el precio y el peso ANTES de pedir y desconfiad de los carteles «시가».',
    fuentes: [['Dailian (2025)', 'https://www.dailian.co.kr/news/view/1543606/'], ['YTN (2025)', 'https://www.ytn.co.kr/_ln/0103_202509011641439636']] },
  { ciudad: 'gyeongju', ids: ['gj-gyori-gimbap'], ko: '교리김밥', es: 'Gyori Gimbap',
    txt: 'Muy famoso por su kimbap con mucho huevo, pero los usuarios le dan solo un 3,4 en Polle (76 reseñas): caro, salado y con colas de más de una hora en fin de semana; para comer dentro hay que pedir un plato de fideos por persona. Si os pilla al lado, para llevar; si no, no merece la espera.',
    fuentes: [['Polle', 'https://polle.com/jd7485/posts/23']] },
  // Comer (v151): búsqueda en prensa coreana, Polle y blogs, nov 2026.
  { ciudad: 'seul', ids: [], ko: '', es: 'Callejón del pescado (갈치조림) de Namdaemun',
    txt: 'Os llamarán desde la entrada del callejón para que entréis. Según reseñas en Polle, todas las casas son parecidas y la salsa es muy dulce; suelen pedir un mínimo de 2 raciones. Si os apetece, elegid una con la carta y el precio a la vista; si no os gusta lo dulce, no hace falta ir.',
    fuentes: [['Polle', 'https://polle.com/marious/posts/3189'], ['Seúl (mediahub)', 'https://mediahub.seoul.go.kr/archives/1065138']] },
  { ciudad: 'busan', ids: [], ko: '민락회센터', es: 'Centro de pescado crudo de Millak (Gwangalli)',
    txt: 'Reseñas en Polle: hay quien dice que hasta la gente de Busan lo considera caro, mucha gente gritando para que compréis y, tras comprar el pescado, esperas o rechazos en los restaurantes de arriba para prepararlo. Consejo: mirad la tabla de precios de fuera y preguntad el TOTAL (pescado + preparación + mesa) antes de pagar.',
    fuentes: [['Polle', 'https://polle.com/place/4f2OmW/%EB%AF%BC%EB%9D%BD%20%ED%9A%8C%ED%83%80%EC%9A%B4']] },
  { ciudad: 'busan', ids: [], ko: '해금강곰장어', es: 'Gomjangeo (anguila) en Haeundae',
    txt: 'Plato típico de Busan, pero en algunas casas famosas de Haeundae las reseñas se quejan de raciones muy pequeñas para lo que cuestan (en Haegeumgang, unas 15 piezas en la ración «mediana»). Preguntad cuántas piezas trae y el precio antes de pedir.',
    fuentes: [['Polle', 'https://polle.com/place/5wxjSk/%ED%95%B4%EA%B8%88%EA%B0%95%20%EA%B3%B0%EC%9E%A5%EC%96%B4']] },
  { ciudad: 'jeonju', ids: [], ko: '', es: 'Puestos de comida de la aldea Hanok de Jeonju',
    txt: 'La prensa local (2023) denunció puestos sin precios o con solo el más barato a la vista, y precios altos: calamar frito entero a 12.000 ₩, pinchos de 5.000 a 10.000 ₩ y panecillos pequeños a 6.000 ₩; también se quejan de que ya hay más tanghulu y comida extranjera que comida local. Para probar algo, bien; para comer, mejor el mercado Nambu o una casa de kongnamul gukbap.',
    fuentes: [['Jeonbuk Ilbo (2023)', 'https://www.jjan.kr/article/20230227580067'], ['Jeonbuk Ilbo (2023)', 'https://www.jjan.kr/article/20231011580156']] },
  { ciudad: 'jeonju', ids: ['gogung'], ko: '', es: 'Bibimbap en las casas famosas del centro de Jeonju',
    txt: 'Según la prensa local (2023), en la aldea Hanok y en las casas famosas el bibimbap costaba 10.000-12.000 ₩ (con carne cruda, 12.000-15.000 ₩), frente a 5.000-7.000 ₩ en otros sitios, y vecinos y turistas se quejan de que la fama ha bajado la calidad. Reseñas de Gogung divididas en Polle. Probadlo una vez si os apetece; para comer bien y barato, kongnamul gukbap (Waengi, Sambaekjip).',
    fuentes: [['Jeonbuk Ilbo (2023)', 'https://www.jjan.kr/article/20230420580037'], ['Jeonbuk Ilbo (2020)', 'https://www.jjan.kr/article/20200726713496'], ['Polle (Gogung)', 'https://polle.com/place/5wIOiY/%EA%B3%A0%EA%B6%81']] },
  // Planes (v151): sitios famosos con pegas documentadas.
  { consejo: true, tipo: 'planes', ciudad: 'seul', ids: [], ko: '북촌한옥마을', es: 'Bukchon: horario para turistas',
    txt: 'Desde marzo de 2025, en la zona roja (calle Bukchon-ro 11-gil, la de las fotos) solo se puede pasear de 10:00 a 17:00; fuera de ese horario hay multa de 100.000 ₩. Es un barrio donde vive gente: hablad bajo y no entréis en los portales.',
    fuentes: [['Seúl (mediahub)', 'https://mediahub.seoul.go.kr/archives/2012688'], ['Korea Times (2026)', 'https://www.koreatimes.co.kr/amp/lifestyle/travel-food/20260215/why-seouls-bukchon-hanok-village-now-closes-to-tourists-after-5-pm/']] },
  { consejo: true, tipo: 'planes', ciudad: 'seul', ids: [], ko: '', es: 'Tiendas de cosmética con «guía» en Myeongdong',
    txt: 'Se han publicado casos de turistas llevados a una tienda por alguien que les abordó en la calle y que pagaron más de un millón de wones, con carteles de «no se admiten devoluciones»; la prensa también ha fotografiado tiendas de recuerdos sin precios. Consejo: comprad en cadenas con precio en la etiqueta (Olive Young y similares), no sigáis a nadie que os pare en la calle y mirad el importe antes de pagar.',
    fuentes: [['Insight', 'https://www.insight.co.kr/news/466979'], ['Hankyung (2024)', 'https://www.hankyung.com/amp/2024090329957'], ['NewDaily (2024)', 'https://www.newdaily.co.kr/site/data/html/2024/05/31/2024053100100.html']] },
  { consejo: true, tipo: 'planes', ciudad: 'seul', ids: [], ko: '', es: 'Taxis al aeropuerto (y taxis en general)',
    txt: 'En junio de 2026 a una turista le cobraron 690.800 ₩ de Seúl a Incheon (lo normal ronda 70.000 ₩ con peajes); el taxista dijo que había tecleado un cero de más. Entre 2021 y 2025 hubo 6.481 quejas de turistas por tarifas abusivas. Consejo: pedid el taxi con Kakao T, mirad el importe en el datáfono antes de pasar la tarjeta y pedid recibo; para quejas, 1330. Al aeropuerto, el tren AREX evita el problema.',
    fuentes: [['YTN (2026)', 'https://www.ytn.co.kr/_ln/0103_202607011905380340'], ['Reportera', 'https://www.reportera.co.kr/news/korea-inbound-tourist-taxi-overcharging-crackdown/']] },
  { tipo: 'planes', ciudad: 'seul', ids: [], ko: '인사동', es: 'Recuerdos de la calle principal de Insadong',
    txt: 'Varias guías avisan de que en la calle principal abundan los recuerdos hechos en serie y de que las tiendas de artesanía de verdad van desapareciendo; algunos objetos salen más baratos en Namdaemun. Para algo hecho a mano, Ssamziegil (unas 70 tiendas de artesanía) y las tiendas de cerámica, pinceles y papel hanji de las bocacalles.',
    fuentes: [['Creatrip (Ssamzigil)', 'https://creatrip.com/en/blog/6938'], ['Culture Trip', 'https://theculturetrip.com/asia/south-korea/articles/where-to-buy-beautiful-handmade-souvenirs-in-seoul']] },
  { tipo: 'planes', ciudad: 'seul', ids: [], ko: '별마당도서관', es: 'Starfield Library (Coex)',
    txt: 'Es más un sitio de fotos que una biblioteca: según sus responsables, solo los libros hasta la sexta balda (lo que llega la mano) son de verdad; los de arriba son de decoración. Merece una parada si pasáis por Coex, no un viaje expreso.',
    fuentes: [['Daum', 'https://v.daum.net/v/WkLByWkPg3'], ['Seúl (mediahub)', 'https://mediahub.seoul.go.kr/archives/1290004']] },
  { tipo: 'planes', ciudad: 'busan', ids: [], ko: '해동용궁사', es: 'Templo Haedong Yonggungsa: gente',
    txt: 'En las fotos parece vacío, pero en realidad está lleno: los fines de semana y festivos la escalera estrecha se atasca y hasta hacer una foto lleva tiempo. Son 108 escalones de bajada y subida. Id entre semana y a primera hora.',
    fuentes: [['Nick Kembel', 'https://www.nickkembel.com/haedong-yonggungsa-temple-busan/'], ['Mom-mom', 'https://mom-mom.net/en/travel/places/651cf7d5caa4390924c221c1']] },
  { tipo: 'planes', ciudad: 'busan', ids: [], ko: '감천문화마을', es: 'Aldea Gamcheon: masificación',
    txt: 'Más de 2 millones de visitantes al año en un barrio donde vive gente (los vecinos han bajado más de un 40 % en diez años): calles empinadas, atascos y quejas por ruido; el distrito estudia limitar horarios. Id pronto, hablad bajo y no entréis en las casas. Bonito, pero no esperéis tranquilidad.',
    fuentes: [['Hankyung (2025)', 'https://www.hankyung.com/article/202502117296g'], ['Seoul Shinmun (2025)', 'https://m.go.seoul.co.kr/news/2025/02/12/20250212020005']] },
  { consejo: true, tipo: 'planes', ciudad: 'busan', ids: [], ko: '', es: 'Taxis en Busan',
    txt: 'Hay casos publicados: a una turista le cobraron 80.000 ₩ por unos 15 minutos de Haeundae a Gwangalli (el taxista tecleó el importe a mano), y antes, 39.300 ₩ de la estación de Busan a Haeundae. Desde agosto de 2026 la primera vez que pillan a un taxista cobrando de más le quitan la licencia 30 días. Mirad que el taxímetro esté en marcha y el importe antes de pagar.',
    fuentes: [['Nocut News', 'https://www.nocutnews.co.kr/news/6533020'], ['Dailian', 'https://www.dailian.co.kr/news/view/516325/'], ['MTN (2026)', 'https://news.mtn.co.kr/news-detail/2026072812373621464']] },
  { tipo: 'planes', ciudad: 'jeonju', ids: [], ko: '전주한옥마을', es: 'Aldea Hanok de Jeonju: más parque temático que aldea',
    txt: 'La prensa local (2023) dice que la aldea «se ha convertido en un parque de atracciones», llena de puestos de comida (tanghulu cada 100 m) y alquiler de hanbok; algún viajero en foros comenta que no se parece a una aldea de verdad. Lo mejor: el santuario Gyeonggijeon, la catedral de Jeondong, las calles de atrás y verla temprano o al anochecer.',
    fuentes: [['Jeonbuk Ilbo (2023)', 'https://www.jjan.kr/article/20231011580156'], ['Fodor\'s', 'https://www.fodors.com/community/asia/south-korea-itinerary-approval-and-or-help-1707513/']] },
  { tipo: 'planes', ciudad: 'gyeongju', ids: [], ko: '황리단길', es: 'Hwangridan-gil: precios de calle de moda',
    txt: 'Es la calle más de moda de Gyeongju y se nota en los precios: en foros y reseñas se repite que comer o tomar algo aquí sale caro, y durante la APEC (2025) los comerciantes tuvieron que comprometerse a poner precios fijos y bajarlos. Pasear, sí; para comer, mirad la carta y el precio antes de sentaros.',
    fuentes: [['Kyunghyang (2025)', 'https://www.khan.co.kr/article/202511021823001'], ['Polle', 'https://polle.com/reah1004/posts/238']] }
];


// 🥢 Probados (Más): comidas y bebidas típicas para marcar si las habéis probado (user.probados[hangul]).
// [grupo, icono, clave de ciudad o '', [[nombre, hangul, una línea]]]. Hangul de uso corriente; la marca se comparte con Planes → 🥢 Platos típicos.
const PROBAR = [
  ['Imprescindibles de Corea', '🇰🇷', '', [
    ['Kimchi', '김치', 'Col fermentada picante: sale en casi todas las comidas.'],
    ['Bibimbap', '비빔밥', 'Arroz con verduras, huevo y salsa picante para mezclar.'],
    ['Bulgogi', '불고기', 'Ternera marinada en láminas a la parrilla.'],
    ['Samgyeopsal', '삼겹살', 'Panceta a la parrilla en la mesa, envuelta en lechuga.'],
    ['Galbi', '갈비', 'Costillas marinadas a la parrilla.'],
    ['Pollo frito coreano', '치킨', 'Crujiente, con salsa dulce y picante; con cerveza es el «chimaek».', 'Korean_fried_chicken'],
    ['Kimchi jjigae', '김치찌개', 'Guiso de kimchi con cerdo y tofu.'],
    ['Doenjang jjigae', '된장찌개', 'Guiso de pasta de soja fermentada.'],
    ['Sundubu jjigae', '순두부찌개', 'Guiso picante de tofu sedoso.'],
    ['Samgyetang', '삼계탕', 'Pollito entero en sopa con ginseng y arroz.'],
    ['Naengmyeon', '냉면', 'Fideos fríos de alforfón en caldo helado.'],
    ['Kalguksu', '칼국수', 'Fideos cortados a cuchillo en caldo.'],
    ['Japchae', '잡채', 'Fideos de boniato salteados con verduras.'],
    ['Jajangmyeon', '짜장면', 'Fideos con salsa negra de soja (coreano-chino).'],
    ['Budae jjigae', '부대찌개', '«Guiso del ejército» con salchichas y Spam.'],
    ['Haemul pajeon', '해물파전', 'Tortita de cebolleta y marisco.'],
    ['Mandu', '만두', 'Empanadillas al vapor o fritas.'],
    ['Bossam', '보쌈', 'Cerdo hervido para envolver con kimchi.'],
    ['Jokbal', '족발', 'Manitas de cerdo cocidas en soja, en lonchas.'],
    ['Dakgalbi', '닭갈비', 'Pollo picante salteado en plancha grande.'],
    ['Hoe', '회', 'Pescado crudo en lonchas, al estilo coreano.']]],
  ['De la calle y de la tienda 24 h', '🍢', '', [
    ['Tteokbokki', '떡볶이', 'Pasteles de arroz en salsa roja picante.'],
    ['Gimbap', '김밥', 'Rollo de arroz y alga con relleno.'],
    ['Eomuk', '어묵', 'Pasta de pescado en brocheta, con su caldo.'],
    ['Sundae', '순대', 'Morcilla coreana de fideos de boniato.'],
    ['Hotteok', '호떡', 'Tortita frita rellena de azúcar moreno.'],
    ['Bungeoppang', '붕어빵', 'Pez de masa relleno de alubia roja.'],
    ['Gyeran-ppang', '계란빵', 'Bollito con un huevo entero dentro.'],
    ['Dalgona', '달고나', 'Caramelo de azúcar y bicarbonato con un dibujo.'],
    ['Bingsu', '빙수', 'Hielo raspado con fruta, leche o alubia roja.'],
    ['Ramyeon de tienda', '라면', 'Fideos instantáneos hechos en la máquina de la tienda.'],
    ['Samgak gimbap', '삼각김밥', 'Triángulo de arroz y alga de las tiendas 24 h.', 'Samgak-gimbap']]],
  ['Bebidas', '🍶', '', [
    ['Soju', '소주', 'El aguardiente nacional, en botellita verde.'],
    ['Makgeolli', '막걸리', 'Vino de arroz turbio y suave.'],
    ['Somaek', '소맥', 'Soju mezclado con cerveza.'],
    ['Sikhye', '식혜', 'Bebida dulce de arroz fermentado, fría.'],
    ['Yuja-cha', '유자차', 'Té de cítrico yuzu con miel, caliente.'],
    ['Omija-cha', '오미자차', 'Té de la «baya de los cinco sabores».'],
    ['Sujeonggwa', '수정과', 'Ponche frío de canela y jengibre.'],
    ['Leche de plátano', '바나나우유', 'La de botellita panzuda amarilla de las tiendas.', 'Binggrae_Banana_Flavored_Milk']]],
  ['Seúl', '🏙️', 'seul', [
    ['Bindaetteok', '빈대떡', 'Tortita de soja molida del mercado Gwangjang.'],
    ['Mayak gimbap', '마약김밥', 'Minigimbap «adictivo» de Gwangjang.'],
    ['Yukhoe', '육회', 'Ternera cruda aliñada (Gwangjang).'],
    ['Seolleongtang', '설렁탕', 'Sopa blanca de huesos de ternera, muy de Seúl.'],
    ['Dakhanmari', '닭한마리', 'Pollo entero cocido en la mesa (Dongdaemun).']]],
  ['Andong', '🎭', 'andong', [
    ['Andong jjimdak', '안동찜닭', 'Pollo guisado en soja con fideos de cristal.'],
    ['Ganjogoe', '간고등어', 'Caballa salada a la parrilla.'],
    ['Heotjesatbap', '헛제삿밥', 'Bibimbap de la «falsa comida de ofrenda».'],
    ['Andong soju', '안동소주', 'Soju destilado tradicional, fuerte.'],
    ['Sikhye de Andong', '안동식혜', 'El de Andong: rojo, con guindilla y rábano.']]],
  ['Gyeongju', '👑', 'gyeongju', [
    ['Hwangnam-ppang', '황남빵', 'Pastelito de alubia roja, el recuerdo de Gyeongju.'],
    ['Pan de 10 wones', '십원빵', 'Gofre con forma de moneda relleno de queso.'],
    ['Chalbori-ppang', '찰보리빵', 'Tortitas de cebada rellenas de alubia roja.'],
    ['Ssambap', '쌈밥', 'Arroz con muchas verduras para envolver (zona de los túmulos).'],
    ['Gyodong beopju', '교동법주', 'Licor de arroz de la familia Choi de Gyochon.']]],
  ['Busan', '🌊', 'busan', [
    ['Dwaeji gukbap', '돼지국밥', 'Sopa de cerdo con arroz, el plato estrella.'],
    ['Milmyeon', '밀면', 'Fideos fríos de trigo de los refugiados.'],
    ['Ssiat hotteok', '씨앗호떡', 'Hotteok relleno de pipas (BIFF Square).'],
    ['Nakgopsae', '낙곱새', 'Pulpo, tripa y gambas en guiso picante.'],
    ['Bibim dangmyeon', '비빔당면', 'Fideos de cristal aliñados del mercado Gukje.'],
    ['Gomjangeo', '곰장어', 'Anguila babosa a la parrilla.'],
    ['Bokguk', '복국', 'Sopa de pez globo, muy de Haeundae.']]],
  ['Jeonju', '🍚', 'jeonju', [
    ['Bibimbap de Jeonju', '전주비빔밥', 'El bibimbap de su cuna.'],
    ['Kongnamul gukbap', '콩나물국밥', 'Sopa de brotes de soja con arroz.'],
    ['Moju', '모주', 'Makgeolli caliente con canela y jengibre.'],
    ['Makgeolli del callejón', '막걸리골목', 'Tetera de makgeolli con la mesa llena de platillos, en sus callejones.', 'ko:막걸리'],
    ['Choco Pie de PNB', '초코파이', 'El de la pastelería PNB, mucho más grande que el de tienda.']]]
];
