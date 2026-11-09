'use strict';
// Lectura larga de cada ciudad (Historia → 🏯 Vuestras ciudades, y enlace «📜» desde los títulos de Hoy y Planes).
// Contenido propio, resumido de conocimiento general contrastado; lo dudoso lleva VERIFICAR.
// Formato: clave de ciudad → [[icono, título, [párrafos]], …]
const CIUDAD_INFO = {
  seul: [
    ['📜', 'Historia', [
      'Mucho antes de ser capital, la orilla del río Han ya estaba habitada: en Amsa-dong (este de Seúl) se conserva un poblado neolítico de hace unos 6.000 años, con chozas semienterradas reconstruidas.',
      'Hacia el 18 a. C. el reino de Baekje fundó aquí su primera capital, Wiryeseong o Hanseong, junto al Han. De esa época quedan las murallas de tierra de Pungnap y Mongchon, en el distrito de Songpa, a pocos pasos de la Lotte World Tower. En 475 el reino de Goguryeo la conquistó y Baekje huyó al sur; en el siglo VI pasó a Silla.',
      'Con Goryeo (918-1392) fue Namgyeong, la «capital del sur». Pero el gran momento llega en 1392: el general Yi Seong-gye funda la dinastía Joseon y en 1394 traslada la corte a Hanyang, elegida por la geomancia (pungsu): montañas detrás (Bugaksan), río delante (el Han) y colinas protectoras a los lados. En 1395 se termina Gyeongbokgung y en 1396 la muralla de 18 km que unía las cuatro montañas que rodean el centro.',
      'El rey Sejong el Grande (reinó 1418-1450) mandó crear el hangul, terminado en 1443 y promulgado en 1446 para que el pueblo llano pudiera leer y escribir. Por eso su estatua preside la plaza Gwanghwamun y debajo hay un pequeño museo sobre él.',
      'En 1592 la invasión japonesa (guerra Imjin) arrasó la ciudad y los palacios ardieron. Changdeokgung se reconstruyó antes y fue la residencia real durante unos 270 años; Gyeongbokgung no se levantó de nuevo hasta 1867, por empeño del regente Heungseon Daewongun.',
      'En 1897 el rey Gojong proclamó el Imperio Coreano desde Deoksugung, en un intento de modernizar el país y mantenerlo independiente. No funcionó: en 1910 Japón se anexionó Corea y la ciudad pasó a llamarse Keijō. El 1 de marzo de 1919 se leyó en el parque Tapgol la Declaración de Independencia, el inicio del gran movimiento pacífico de protesta.',
      'Tras la liberación (1945) se adoptó el nombre «Seúl», una palabra coreana nativa que significa simplemente «la capital» (por eso no tiene caracteres chinos propios). En la guerra de Corea (1950-1953) la ciudad cambió de manos cuatro veces y quedó en ruinas.',
      'Lo que veis hoy es fruto del «milagro del río Han»: en pocas décadas pasó de ciudad devastada a una de las mayores metrópolis del mundo, con unos 9,4 millones de habitantes en la ciudad y más de 25 en el área metropolitana. Los Juegos Olímpicos de 1988 y el Mundial de 2002 fueron su presentación al mundo.']],
    ['🙇', 'Costumbres y vida diaria', [
      '«Ppalli-ppalli» (rápido, rápido): todo va deprisa, desde la entrega a domicilio en 30 minutos hasta las obras. Las colas, sin embargo, se respetan mucho, sobre todo en el metro: se espera a los lados de la puerta.',
      'En el metro hay asientos reservados para mayores, discapacitados y embarazadas (los rosas). Aunque el vagón vaya lleno, la gente no se sienta en ellos.',
      'Los coreanos salen poco a casa ajena: la vida social se hace en restaurantes, cafés (Seúl tiene una cantidad de cafeterías asombrosa), noraebang (karaoke por salas) y jjimjilbang, los baños públicos con sauna donde familias enteras pasan la tarde e incluso duermen.',
      'El «chimaek» (pollo frito con cerveza) es casi un ritual, igual que hacer un picnic a orillas del Han y pedir comida a domicilio al parque o cocinar ramen en las máquinas de las tiendas 24 h de la orilla.',
      'Noviembre es la temporada del kimjang: familias y vecinos preparan juntos el kimchi para todo el invierno. Es una tradición declarada Patrimonio Inmaterial por la UNESCO (2013). Además, los ginkgos de las calles se ponen amarillo intenso.',
      'La edad importa: al conocer a alguien se pregunta pronto el año de nacimiento para saber cómo dirigirse a él. A los mayores se les sirve primero y no se empieza a comer antes que ellos.']],
    ['⭐', 'Famosos de Seúl', [
      'El rey Sejong el Grande (1397-1450), creador del hangul, nació en Hanyang, la actual Seúl.',
      'El almirante Yi Sun-sin (1545-1598), el gran héroe naval contra Japón, también nació en Hanyang; su estatua está en Gwanghwamun, delante de la de Sejong.',
      'Faker (Lee Sang-hyeok, 1996), la mayor leyenda del League of Legends y estrella de T1, es de Seúl.',
      'PSY (1977), el de «Gangnam Style» (2012), creció en Gangnam: el barrio que satiriza en la canción.',
      'El director Park Chan-wook («Oldboy», «La doncella») nació en Seúl. Y en la ciudad tienen su sede las grandes agencias del K-pop: HYBE (BTS), SM, JYP y YG.']],
    ['🎯', 'Qué hacer (además de lo del plan)', [
      'Cambio de guardia en Gyeongbokgung (10:00 y 14:00, salvo martes; VERIFICAR) y en Deoksugung. Con hanbok, la entrada a los palacios es gratuita.',
      'Caminar un tramo de la muralla Hanyangdoseong: el de Naksan (junto a Ihwa) es corto y muy bonito al atardecer, con vistas a la ciudad iluminada.',
      'Pasear junto al arroyo Cheonggyecheon, que estuvo cubierto por una autopista hasta 2005 y hoy es un paseo verde en pleno centro.',
      'Subir a la N Seoul Tower (Namsan) o a la Seoul Sky de la Lotte World Tower (555 m, de los edificios más altos del mundo).',
      'Mercados de noche: Gwangjang (bindaetteok y mayak gimbap) y Namdaemun. Barrios con ambiente: Ikseon-dong (hanoks convertidos en cafés), Seongsu (el «Brooklyn» de Seúl), Hongdae (música en la calle) y Euljiro (bares escondidos en talleres).',
      'Una tarde en un jjimjilbang: se paga la entrada, os dan ropa y se pasa de sala en sala (calientes, de sal, de hielo).']],
    ['🍜', 'Sabores', [
      'Seolleongtang (caldo blanco de hueso de buey, plato tradicional de Seúl), bindaetteok (tortita de soja molida) y yukhoe (tartar de buey) en Gwangjang.',
      'Hanjeongsik (menú real con muchos platillos), heredero de la cocina de palacio de Joseon.',
      'Pollo frito coreano, tteokbokki de los puestos callejeros y hotteok dulce en invierno.']],
    ['💡', 'Lo que no cuentan todas las guías', [
      'La puerta Namdaemun (Sungnyemun), tesoro nacional nº 1, ardió en 2008 por un incendio provocado y se reconstruyó con técnicas tradicionales; reabrió en 2013.',
      'Seúl tiene 25 distritos (gu) y cada uno es como una ciudad: Gangnam y Jongno se parecen poco. Buena parte de la gente vive en enormes bloques de apartamentos numerados.',
      'El Palacio Changdeokgung es Patrimonio de la Humanidad (1997) por cómo se adapta al terreno; su Jardín Secreto (Huwon) solo se visita con tour guiado y entrada aparte.',
      'Los santuarios de Jongmyo, donde se honra a los reyes de Joseon, siguen celebrando el ritual real (Jongmyo Jerye) cada mayo y noviembre (VERIFICAR fecha).']]
  ],
  andong: [
    ['📜', 'Historia', [
      'El nombre lo dice todo: Andong significa «el este pacificado». Se lo dio Wang Geon, fundador de Goryeo, tras la batalla de Gochang (930), en la que los clanes locales le ayudaron a derrotar al reino de Hubaekje. Aquellos clanes —Kwon, Kim y Jang— se convirtieron en grandes linajes de la zona.',
      'Durante la dinastía Joseon (1392-1910), Andong fue la capital espiritual del neoconfucianismo. Aquí se formaba la élite de los yangban, la aristocracia de letrados, en academias privadas (seowon) que eran a la vez escuela y templo de un maestro.',
      'Su gran figura es Yi Hwang, más conocido como Toegye (1501-1570), el filósofo neoconfuciano más influyente de Corea. Se retiró aquí y fundó una escuela; tras su muerte sus discípulos levantaron la academia Dosan Seowon (1574). Su cara está en el billete de 1.000 wones, con la propia academia al fondo.',
      'El otro gran nombre es Ryu Seong-ryong (1542-1607), del clan Ryu de la aldea Hahoe: fue primer ministro durante la invasión japonesa de 1592 y escribió el «Jingbirok», unas memorias de la guerra para que no se repitieran los errores. La academia Byeongsan Seowon, en un recodo del río, se dedicó a él.',
      'Andong fue también cuna del movimiento por la independencia durante la ocupación japonesa: de aquí salieron más activistas reconocidos que de casi ninguna otra ciudad. Yi Sang-ryong, primer presidente del Consejo de Estado del Gobierno Provisional en Shanghái, vendió las tierras familiares para financiar la lucha; su casa, Imcheonggak, sigue en pie.',
      'En 2010 la aldea Hahoe y la de Yangdong (Gyeongju) entraron juntas en el Patrimonio Mundial como «Aldeas históricas de Corea». En 2018 lo hizo Bongjeongsa (dentro de «Sansa, monasterios de montaña») y en 2019 Dosan Seowon y Byeongsan Seowon (dentro de «Seowon, academias neoconfucianas»).',
      'En 1976 la presa de Andong inundó parte del valle; muchas casas antiguas se desmontaron y se trasladaron a la Aldea Folclórica, junto al puente Woryeonggyo.']],
    ['🙇', 'Costumbres', [
      'Andong presume de ser «la capital del espíritu coreano»: aquí se mantienen como en ninguna parte los ritos a los antepasados (jesa), la casa del linaje principal (jongga) y la etiqueta confuciana. Algunas familias siguen celebrando ritos por antepasados de hace 400 años.',
      'La danza de máscaras de Hahoe (Byeolsingut Talnori) nació como ritual a la diosa del pueblo y se convirtió en sátira: los aldeanos, tras la máscara, se burlaban de los nobles y de los monjes hipócritas, algo impensable a cara descubierta. Las máscaras originales de madera de aliso son tesoro nacional.',
      'Cada otoño (finales de septiembre o principios de octubre) se celebra el Festival Internacional de la Danza de Máscaras, uno de los más conocidos del país.',
      'El «heotjesabap» (falso arroz del rito) es una costumbre curiosa: los letrados querían comer los platos de los ritos sin celebrar el rito, así que nacieron estas comidas de verduras y pescado con salsa de soja en lugar de picante.']],
    ['⭐', 'Famosos de Andong', [
      'Toegye (Yi Hwang), el sabio del billete de 1.000 wones.',
      'Ryu Seong-ryong, primer ministro en la guerra Imjin y autor del «Jingbirok».',
      'El poeta Yi Yuksa (1904-1944), nacido en Andong, poeta de la resistencia que murió en una cárcel japonesa; hay un museo literario dedicado a él.',
      'Kwon Jeong-saeng (1937-2007), autor de cuentos infantiles muy queridos («Mongsil eonni»), vivió con gran sencillez en un pueblo de Andong.',
      'Y una visita célebre: la reina Isabel II celebró su 73 cumpleaños en la aldea Hahoe en 1999; le prepararon una comida de cumpleaños tradicional y hay fotos de la visita.']],
    ['🎯', 'Qué hacer', [
      'Bongjeongsa: su sala Geungnakjeon es el edificio de madera más antiguo que se conserva en Corea (siglo XIII o anterior).',
      'Subir al acantilado Buyongdae, al otro lado del río, para ver la aldea Hahoe desde arriba: es la foto clásica.',
      'Ver el puente Woryeonggyo de noche, iluminado. Su forma recuerda unas sandalias de cáñamo (mituri): en 1998 apareció en una tumba la carta de una viuda de 1586 a su marido muerto, junto a unas sandalias tejidas con su propio pelo. La historia conmovió al país y el puente se inspiró en ella.',
      'El Buda de roca de Jebiwon, tallado en una roca enorme junto a la carretera.',
      'El Museo del Soju de Andong, para entender el aguardiente local.']],
    ['🍜', 'Sabores', [
      'Andong jjimdak: pollo guisado con fideos de boniato y salsa de soja dulce y picante. Nació en el mercado viejo de Andong en los años 80 y ahora hay una calle entera dedicada a él.',
      'Gangodeungeo, caballa salada: Andong está lejos del mar, así que el pescado llegaba en sal tras días de viaje desde la costa; aquel sabor se convirtió en especialidad.',
      'Andong soju: un destilado tradicional de unos 45 grados, mucho más fuerte que el soju verde del súper.',
      'Heotjesabap, el «falso» menú de rito, y la sopa de ternera picante de Andong (Andong gukbap).']],
    ['💡', 'Lo que no cuentan todas las guías', [
      'En Hahoe todavía vive gente (unas 230 personas): muchas casas son viviendas, no museos. Respetad las puertas cerradas y los patios privados.',
      'El trazado de Hahoe sigue un recodo en forma de S del río Nakdong; según la geomancia, la aldea tiene forma de flor de loto flotando en el agua.',
      'La tela de cáñamo de Andong (Andongpo) era la más apreciada para la ropa de verano; aún se teje a mano.']]
  ],
  gyeongju: [
    ['📜', 'Historia', [
      'Gyeongju fue la capital de Silla durante casi mil años (57 a. C. – 935 d. C.), una de las dinastías más largas de la historia del mundo. Entonces se llamaba Seorabeol, y es probable que de ahí venga la palabra «Seúl» (capital).',
      'La leyenda cuenta que el fundador, Bak Hyeokgeose, nació de un huevo encontrado junto al pozo de Najeong. Otra leyenda dice que en el bosque de Gyerim, junto a Cheomseongdae, apareció una caja de oro colgada de un árbol con un niño dentro: Kim Alji, antepasado del clan Kim de Gyeongju, el linaje de muchos reyes.',
      'La reina Seondeok (reinó 632-647), primera mujer que reinó en Corea, impulsó Cheomseongdae —el observatorio astronómico más antiguo que se conserva en Asia oriental— y la gigantesca pagoda de nueve pisos de Hwangnyongsa, de unos 80 m, destruida por los mongoles en 1238. Hoy su solar es un campo abierto con las bases de piedra.',
      'En 668, aliada con la China Tang, Silla venció a Baekje y Goguryeo y unificó por primera vez casi toda la península. Fue su edad de oro: el budismo era religión de estado y en 751 se empezaron Bulguksa y la gruta de Seokguram, Patrimonio Mundial desde 1995.',
      'El rey Munmu, que culminó la unificación, pidió ser enterrado en el mar para convertirse en dragón y proteger el reino de los piratas: su tumba es una roca en la costa de Gyeongju (Daewangam).',
      'Los túmulos que veis en el centro son tumbas reales. En 1973 se excavó Cheonmachong y apareció una corona de oro y una pintura de un caballo celeste sobre corteza de abedul; de ahí su nombre, «tumba del caballo celeste». Las coronas de oro de Silla, con adornos en forma de árbol y astas, son de las piezas más espectaculares del Museo Nacional.',
      'Silla cayó en 935 y se rindió a Goryeo sin lucha. La ciudad quedó como capital provincial, pero conservó tanto patrimonio que en 2000 todo su centro histórico entró en el Patrimonio Mundial. Se la llama «el museo sin muros».',
      'En 2025 Gyeongju acogió la cumbre de líderes de APEC, y en 2016 sufrió el terremoto más fuerte registrado en Corea del Sur (5,8): por eso se reforzaron muchos monumentos.']],
    ['🙇', 'Costumbres', [
      'Gyeongju es el destino clásico del viaje escolar (suhak yeohaeng): veréis grupos de estudiantes con uniforme por todas partes. Casi todos los coreanos tienen una foto de pequeños delante de Cheomseongdae o Bulguksa.',
      'Los túmulos forman parte del paisaje cotidiano: la gente pasea, corre y hace fotos de boda entre ellos. Son tumbas: no se sube a ellos.',
      'La familia Choi de Gyochon se hizo famosa por sus reglas: no acumular más de cierta riqueza, no comprar tierras en años de hambruna y que nadie en 100 ri (unos 40 km) a la redonda pasara hambre. Mantuvo su fortuna durante unas doce generaciones y es el gran ejemplo coreano de «nobleza obliga».']],
    ['⭐', 'Famosos de Gyeongju', [
      'La reina Seondeok, primera reina de Corea, protagonista de una serie de televisión de enorme éxito (2009).',
      'El general Kim Yu-sin (595-673), artífice militar de la unificación; su tumba está en las afueras.',
      'El monje Wonhyo (617-686), uno de los grandes pensadores del budismo coreano, vivió en Bunhwangsa. Cuenta la leyenda que, de viaje a China, bebió de noche agua de lo que creía un cuenco y por la mañana vio que era una calavera: comprendió que todo está en la mente y volvió a casa.',
      'Choe Chiwon (857-?), gran erudito y poeta que estudió en la China Tang.',
      'El rey Munmu, el del «dragón del mar del este».']],
    ['🎯', 'Qué hacer', [
      'Ver Donggung y el estanque Wolji al anochecer, cuando se encienden las luces y los pabellones se reflejan en el agua.',
      'El puente Woljeonggyo, reconstrucción de un puente de Silla, también está iluminado de noche, igual que Cheomseongdae.',
      'Alquilar bici: el centro es llano y los monumentos están cerca entre sí.',
      'Bajar a pie de Seokguram a Bulguksa por el sendero del bosque, sobre todo en otoño.',
      'El lago Bomun (zona turística con hoteles y paseo junto al agua) y, más lejos, la aldea Yangdong, Patrimonio Mundial, con más de 150 casas tradicionales.',
      'El bosque de pinos de Samneung, en el monte Namsan, lleno de budas tallados en la roca: el Namsan entero es un museo al aire libre.']],
    ['🍜', 'Sabores', [
      'Hwangnam-ppang: un pastelito de judía roja dulce creado en 1939 en el barrio de Hwangnam; hoy lo venden por todas partes.',
      'Ssambap: arroz con un montón de hojas para envolver y guarniciones, la comida típica junto a Daereungwon.',
      'Gyeongju gyobeop-ju: licor tradicional de la familia Choi de Gyochon.',
      'El pan de 10 wones (sipwon-ppang), con la forma de la moneda de 10 wones, que lleva grabada la pagoda Dabotap de Bulguksa.']],
    ['💡', 'Lo que no cuentan todas las guías', [
      'Las dos pagodas de Bulguksa, Dabotap y Seokgatap, son tan emblemáticas que la Dabotap aparece en la moneda de 10 wones.',
      'La gran campana del rey Seongdeok (771), en el Museo Nacional, es una de las mayores de Asia. Se la llama «campana Emille» por una leyenda triste: dicen que su sonido imita a un niño llamando a su madre.',
      'Hwangnidan-gil, la calle de moda de cafés y tiendas junto a los túmulos, era hace pocos años un barrio viejo de casas bajas.',
      'La estación de KTX (antes Singyeongju) está lejos del centro, a unos 10 km: calculad tiempo de taxi o bus.']]
  ],
  busan: [
    ['📜', 'Historia', [
      'En la antigüedad la zona perteneció a la confederación de Gaya, un conjunto de pequeños reinos conocidos por su hierro, que acabó absorbido por Silla en el siglo VI.',
      'Durante Joseon, Busan (entonces Busanpo) fue el puerto de contacto con Japón: había un barrio comercial japonés amurallado, el Waegwan.',
      'Aquí empezó la invasión japonesa de 1592: la fortaleza de Busanjin y la de Dongnae cayeron en los primeros días. Ese mismo año el almirante Yi Sun-sin atacó la flota japonesa fondeada en el puerto de Busan.',
      'En 1876 Busan fue el primer puerto abierto al comercio extranjero, tras un tratado impuesto por Japón, y empezó a crecer como gran puerto.',
      'En la guerra de Corea (1950-1953), Busan fue una de las pocas zonas que nunca cayó: el «perímetro de Busan» resistió y la ciudad fue capital provisional. Llegaron cientos de miles de refugiados del norte, que levantaron barrios en las laderas, como Gamcheon, y mercados como Gukje.',
      'De aquella época nació, entre otras cosas, el milmyeon: los refugiados del norte añoraban sus fideos fríos de alforfón y, sin ese grano, los hicieron con harina de trigo de la ayuda americana.',
      'Hoy es la segunda ciudad del país (unos 3,3 millones de habitantes) y uno de los mayores puertos de contenedores del mundo. Desde 1996 acoge el Festival Internacional de Cine de Busan (BIFF), el más importante de Asia.']],
    ['🙇', 'Costumbres', [
      'El acento de Busan (dialecto de Gyeongsang) suena fuerte y directo al resto de coreanos; tiene fama de gente franca y algo brusca pero cálida.',
      'Las ajummas del mercado Jagalchi —vendedoras de pescado— son un símbolo de la ciudad: duras, rápidas y con sentido del humor.',
      'El béisbol es religión: los aficionados de los Lotte Giants cantan «Busan Galmaegi» (gaviota de Busan) y antes se ponían bolsas de plástico naranjas en la cabeza.',
      'Las playas se viven todo el año: en invierno la gente pasea por Haeundae y Gwangalli, y en Año Nuevo miles de personas van a ver el primer amanecer.']],
    ['⭐', 'Famosos de Busan', [
      'Jimin y Jungkook, de BTS, son de Busan.',
      'El beisbolista Choo Shin-soo, que jugó muchos años en las grandes ligas de EE. UU., es de Busan.',
      'Moon Jae-in, presidente de 2017 a 2022, hizo su carrera de abogado de derechos humanos en Busan, igual que el expresidente Roh Moo-hyun.',
      'Y una película: «Tren a Busan» (2016), el gran éxito de zombis coreano.']],
    ['🎯', 'Qué hacer', [
      'Haedong Yonggungsa, el raro templo budista junto al mar (casi todos están en montañas).',
      'Gamcheon, el barrio de casas de colores en la ladera, y el pueblo cultural Huinnyeoul en Yeongdo, con vistas al mar.',
      'Taejongdae (acantilados y faro) y el Skywalk de Oryukdo, un mirador de cristal sobre el mar.',
      'Beomeosa, gran templo en el monte Geumjeongsan, si apetece un templo de montaña.',
      'Shinsegae Centum City, que figuró en el Guinness como el mayor centro comercial del mundo, con un gran spa dentro (Spa Land).',
      'Gwangalli de noche, con el puente Gwangan iluminado y el espectáculo de drones de los sábados.']],
    ['🍜', 'Sabores', [
      'Dwaeji gukbap: sopa de cerdo con arroz, el plato emblema de Busan, otra herencia de los años de guerra.',
      'Milmyeon: los fideos fríos de trigo inventados por los refugiados.',
      'Ssiat hotteok: tortita dulce rellena de pipas, típica de BIFF Square.',
      'Pescado crudo (hoe) y marisco en Jagalchi: se elige en la planta baja y lo cocinan arriba.',
      'Eomuk (pasta de pescado): Busan es famosa por ella; hay tiendas que parecen pastelerías.']],
    ['💡', 'Lo que no cuentan todas las guías', [
      'Busan perdió en 2023 la candidatura a la Exposición Universal de 2030 frente a Riad; veréis aún restos de aquella campaña.',
      'Muchas calles suben y bajan: el centro antiguo está encajado entre montañas y mar, por eso hay escaleras y ascensores públicos en las laderas (como el de Choryang, en la «Calle 168»).',
      'El metro de Busan tiene líneas numeradas como en Seúl, pero las tarjetas T-money valen igual.']]
  ],
  jeonju: [
    ['📜', 'Historia', [
      'Entre 900 y 936 Jeonju fue la capital de Hubaekje (el «Baekje posterior»), el reino que fundó Kyeon Hwon en el periodo de los Tres Reinos Posteriores. Acabó cayendo ante Goryeo.',
      'Jeonju es la tierra de origen del clan Yi de Jeonju, la familia real de Joseon. Por eso, aunque la capital estuvo en Seúl, aquí se levantó en 1410 el santuario Gyeonggijeon con el retrato del fundador, el rey Taejo.',
      'Junto al santuario estaba uno de los archivos donde se guardaban copias de los Anales de la dinastía Joseon. En la invasión de 1592, los demás archivos ardieron; la copia de Jeonju se salvó porque unos letrados la llevaron a lomos a una montaña. Gracias a eso existen hoy los Anales, Memoria del Mundo de la UNESCO.',
      'En 1380, tras vencer a los piratas japoneses en la batalla de Hwangsan, el general Yi Seong-gye (futuro rey Taejo) celebró la victoria en Omokdae, una colina junto a la aldea hanok, con su familia.',
      'En 1894 los campesinos de la revolución Donghak tomaron la fortaleza de Jeonju: fue uno de los momentos clave de aquella rebelión contra la corrupción y la injerencia extranjera.',
      'La aldea hanok, con varios cientos de casas tradicionales (VERIFICAR la cifra), se formó en los años 30 del siglo XX: los coreanos construyeron casas tradicionales como respuesta a los barrios japoneses que crecían en la ciudad.',
      'La catedral de Jeondong (1914) se alza donde fueron ejecutados en 1791 los primeros mártires católicos de Corea.']],
    ['🙇', 'Costumbres', [
      'Jeonju es la capital gastronómica de Corea: en 2012 la UNESCO la nombró Ciudad Creativa de la Gastronomía. Aquí la mesa llega con muchos más platillos (banchan) que en otras ciudades.',
      'Las casas de makgeolli: se pide una tetera de makgeolli y llegan platos y platos de acompañamiento; cuantas más teteras, más comida.',
      'El papel hanji de Jeonju, hecho de corteza de morera, era de los más apreciados: se usaba para documentos reales, ventanas y abanicos. Los abanicos de Jeonju se enviaban como tributo a la corte.',
      'Mucha gente pasea por la aldea hanok en hanbok alquilado; es parte del ambiente.']],
    ['⭐', 'Famosos de Jeonju', [
      'Kyeon Hwon, el rey fundador de Hubaekje.',
      'La familia real de Joseon: el clan Yi de Jeonju, al que pertenecían todos los reyes de la dinastía.',
      'El Festival Internacional de Cine de Jeonju (desde 2000, en primavera) es uno de los grandes del cine independiente en Asia.']],
    ['🎯', 'Qué hacer', [
      'Subir a Omokdae para ver los tejados de la aldea hanok desde arriba.',
      'El santuario Gyeonggijeon y su museo de retratos reales.',
      'La catedral de Jeondong y la puerta Pungnammun, la única que queda de la muralla.',
      'El mercado Nambu: de día, mercado tradicional; los viernes y sábados por la noche, mercado nocturno de comida (VERIFICAR días).',
      'Jaman, el pueblo de murales en la ladera.',
      'Un taller de hanji o la escuela confuciana Hyanggyo, con sus enormes ginkgos amarillos en noviembre.']],
    ['🍜', 'Sabores', [
      'Bibimbap de Jeonju, el más famoso de Corea, servido en cuenco de latón con carne cruda (yukhoe) opcional.',
      'Kongnamul gukbap: sopa de brotes de soja con arroz, el desayuno de Jeonju y remedio contra la resaca.',
      'El choco pie de PNB (Pungnyeon Bakery), que se lleva en cajas como recuerdo.',
      'Makgeolli con su montaña de platillos y el moju, un licor dulce caliente con canela y jengibre.']],
    ['💡', 'Lo que no cuentan todas las guías', [
      'La aldea hanok es la más grande del país dentro de una ciudad, pero no es antigua: casi todo es del siglo XX o reconstruido. Su valor está en el conjunto y el ambiente.',
      'En la región de Jeolla está la fama de la mejor comida del país; los coreanos lo repiten aunque sean de otra provincia.']]
  ]
};
