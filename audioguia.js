// 🎧 Audioguía (prueba, v297): explicación para escuchar durante la visita de cada parada que queda del viaje.
// Clave = hangul sin espacios (o el nombre en español si no tiene hangul). Tres partes: por qué importa, qué ver y contexto histórico.
// Escrita para leerse en voz alta (frases cortas, sin símbolos). Datos dudosos, VERIFICAR; no sustituye a los carteles del sitio.
const AUDIOGUIA = {
  // ---------- Jeonju ----------
  '남부시장': [
    'El mercado de Nambu es el gran mercado tradicional de Jeonju y uno de los más antiguos de la región de Jeolla. Aquí se entiende por qué Jeonju presume de ser la capital gastronómica de Corea: la Unesco la nombró Ciudad de la Gastronomía en 2012.',
    'Fijaos en los puestos de verduras, pescado seco y encurtidos, y en los pequeños locales de desayuno escondidos entre ellos. El plato estrella es el kongnamul gukbap, la sopa de brotes de soja que se toma por la mañana, a menudo con un huevo y un poco de moju, un licor dulce. Si subís a la segunda planta, encontraréis el mercado de los jóvenes, con tiendas y bares pequeños.',
    'El mercado nació a principios del siglo veinte junto a la puerta sur de la antigua muralla, la Pungnammun. Los comerciantes se instalaron fuera de la ciudad amurallada, y el mercado creció con ella. Los viernes y sábados por la noche se llena de puestos de comida callejera.'],
  '풍남문': [
    'Pungnammun es la puerta sur de la antigua muralla de Jeonju y la única que se conserva de las cuatro. Es el punto de partida del paseo de la Lonely y la mejor forma de imaginar la ciudad amurallada de la dinastía Joseon.',
    'Mirad la doble estructura: una puerta de piedra con un pabellón de madera encima, y el pequeño muro curvo que la protegía delante. En el cartel de la fachada se lee su nombre. Rodeadla: ahora está en medio de una rotonda, porque la muralla que la unía al resto desapareció.',
    'La primera puerta se levantó a finales del siglo catorce. Ardió durante la invasión japonesa de 1597, se reconstruyó en 1734 y, tras otro gran incendio, en 1767 recibió el nombre de Pungnam. Pung alude a la tierra natal del fundador de la dinastía Han de China, una forma de decir que Jeonju era la cuna de la familia real Joseon. A principios del siglo veinte, con la ocupación japonesa, se derribó la muralla y solo quedó esta puerta. Delante fueron ejecutados en 1791 los primeros mártires católicos de Corea.'],
  '행원': [
    'Haengwon es una casa tradicional con mucha historia detrás: perteneció a la última gisaeng de Jeonju, las artistas cortesanas que dominaban la música, la danza y la poesía. Hoy es un café tradicional donde, con suerte, se puede escuchar pansori.',
    'Fijaos en que no es un hanok puro: mezcla la estructura coreana con detalles de la arquitectura japonesa de la época colonial, y tiene un pequeño estanque en el jardín. Pedid un té tradicional y sentaos a mirar el patio.',
    'Según la Lonely, desde 1942 funcionó como refugio de músicos y artistas, también durante la guerra. En 1983 la compró Seong Jun-suk, una cantante de pansori, el canto narrativo coreano que se interpreta con un solo tambor y que la Unesco declaró patrimonio inmaterial. Jeonju es una de sus capitales: cada año celebra un gran concurso de pansori.'],
  'Mapa mural de la antigua Jeonju': [
    'En la pared oeste de la comisaría que hay al norte de la Pungnammun, un gran mural reproduce el mapa de la Jeonju antigua. Es una parada breve, pero ayuda a situar todo lo que estáis viendo.',
    'Buscad la muralla y sus cuatro puertas, el recinto del gobierno provincial, que es la siguiente parada, y el santuario de Gyeonggijeon. Comparad con lo que queda hoy: de la muralla solo sobrevive la Pungnammun.',
    'Durante la dinastía Joseon, Jeonju fue la capital de la provincia de Jeolla y una de las ciudades más importantes del país, por su riqueza agrícola y porque de aquí procedía la familia real.'],
  '전라감영': [
    'Jeolla Gamyeong fue la sede del gobernador de la provincia de Jeolla, que durante buena parte de la dinastía Joseon también administraba la isla de Jeju. Durante más de quinientos años, desde aquí se gobernó todo el suroeste de Corea.',
    'Recorred el patio y el edificio principal, el Seonhwadang, donde el gobernador despachaba. Los paneles explican cómo funcionaba la administración provincial. La entrada es gratis.',
    'En 1894, durante la gran revuelta campesina de Donghak, los campesinos tomaron Jeonju. Tras el acuerdo con el gobierno, se creó aquí una oficina de autogobierno campesino, algo insólito en la Corea de entonces. El conjunto quedó muy dañado en el siglo veinte, sobre todo por una explosión e incendio en 1951, y se ha reconstruido hace pocos años.'],
  '다가여행자도서관': [
    'La Biblioteca de Viajeros Daga es una de las bibliotecas temáticas que han hecho famosa a Jeonju como ciudad de los libros. Está dedicada a la literatura de viajes y a los libros ilustrados.',
    'Tiene tres plantas con estanterías hasta el techo, rincones de lectura y, según la Lonely, una pequeña piscina para refrescar los pies. Hojead alguna guía o algún libro de fotos de Corea, aunque estén en coreano.',
    'En los últimos años, Jeonju ha abierto bibliotecas pequeñas y singulares por toda la ciudad, en parques, en edificios antiguos y hasta en el ayuntamiento, como parte de su apuesta por la cultura. Ojo: muchas bibliotecas coreanas cierran los lunes.'],
  '전동성당': [
    'La catedral de Jeondong es una de las iglesias más bonitas de Corea y un lugar clave del catolicismo coreano: se levanta justo donde fueron ejecutados los primeros mártires católicos del país.',
    'Fijaos en la mezcla de estilos románico y bizantino, con sus cúpulas verdes y el ladrillo rojo y gris. Dentro, las vidrieras y las columnas. Según la tradición, parte de los cimientos se hizo con piedras de la muralla derribada de la ciudad.',
    'En 1791, Yun Ji-chung y Gwon Sang-yeon fueron ejecutados ante la Pungnammun por negarse a celebrar los ritos confucianos a los antepasados. Más tarde, en 1801, llegó otra gran persecución. El misionero francés Xavier Baudounet construyó la iglesia entre 1908 y 1914. Es habitual ver parejas haciéndose fotos de boda delante.'],
  '경기전': [
    'Gyeonggijeon es el santuario que guarda el retrato del rey Taejo, Yi Seong-gye, fundador de la dinastía Joseon, que reinó en Corea durante más de quinientos años. La familia Yi procedía de Jeonju, y por eso la ciudad fue tan importante para la corte.',
    'Pasad la puerta roja y buscad la sala del retrato real. Luego, el bosque de bambú, muy fotogénico, el pequeño santuario Jogyeongmyo, dedicado al fundador del linaje Yi, y el edificio del archivo, el Jeonju Sago.',
    'El santuario se construyó en 1410, ardió durante la invasión japonesa de 1597 y se reconstruyó en 1614. Aquí ocurrió una de las grandes historias de la cultura coreana: durante aquella invasión, unos eruditos sacaron de este archivo los Anales de la dinastía Joseon y los escondieron en las montañas. Fue la única copia que se salvó, y gracias a ella hoy existen esos anales, patrimonio documental de la Unesco.'],
  '어진박물관': [
    'El Museo de Retratos Reales, dentro del recinto de Gyeonggijeon, está dedicado a los retratos de los reyes de Joseon, los eojin. Es el único museo de Corea centrado en ellos.',
    'La pieza central es el retrato del rey Taejo con su túnica azul, tesoro nacional. Mirad también las copias de los retratos de otros reyes y los palanquines usados para trasladar los retratos en procesión.',
    'Los retratos reales se trataban casi como al propio rey: se guardaban en santuarios, se les rendían ritos y se copiaban con enorme cuidado cuando se deterioraban. El de Taejo que se conserva es una copia de 1872 del original. La mayoría de los retratos de otros reyes ardieron en 1954 en un incendio en Busan, adonde se habían llevado durante la guerra; por eso este es tan valioso. Ojo: el museo puede cerrar los lunes.'],
  '전주부채문화관': [
    'El Centro Cultural del Abanico rinde homenaje a una de las artesanías más típicas de Jeonju. Los abanicos de la ciudad tenían tanta fama que se enviaban como regalo a la corte.',
    'Buscad los abanicos plegables de bambú, los hapjukseon, y los redondos, decorados con el símbolo del taeguk. A veces hay artesanos trabajando y talleres para pintar el vuestro.',
    'Jeonju tenía dos materias primas excelentes: el bambú de la región y el hanji, el papel tradicional de morera, también famoso aquí. En época Joseon hubo en la ciudad una oficina dedicada a fabricar abanicos para el rey, que los regalaba a sus funcionarios al llegar el verano.'],
  '교동미술관': [
    'El Museo de Arte Gyodong es un pequeño museo de arte contemporáneo en pleno pueblo de hanok, instalado en una antigua fábrica de ropa interior. Es la cara moderna de Jeonju.',
    'Las exposiciones cambian a menudo y muestran a artistas coreanos actuales. Mirad también cómo se ha aprovechado el edificio industrial. La entrada es gratuita.',
    'El pueblo de hanok no es solo un decorado del pasado: muchas casas y edificios se han reconvertido en galerías, talleres y cafés, y este museo es un buen ejemplo de esa mezcla de tradición y arte actual.'],
  '최명희문학관': [
    'El Museo de Literatura Choi Myung Hee está dedicado a una escritora nacida en Jeonju y autora de Honbul, una de las grandes novelas coreanas del siglo veinte.',
    'Hay manuscritos, cartas y objetos de la autora. Fijaos en sus textos manuscritos con una letra muy cuidada: la escritora decía que escribía como quien graba en piedra, letra a letra.',
    'Choi Myung Hee dedicó unos diecisiete años a Honbul, la historia de una familia de la nobleza de Namwon en la época colonial japonesa, con un retrato minucioso de las costumbres y el habla de Jeolla. Murió en 1998, con cincuenta y un años, sin poder terminarla.'],
  '오목대': [
    'Omokdae es la pequeña colina con un pabellón desde la que se ve todo el pueblo de hanok. Es el mejor mirador de Jeonju y, según la Lonely, el momento ideal es el atardecer.',
    'Desde arriba, mirad el mar de tejados negros y curvos del pueblo de hanok, con la catedral y Gyeonggijeon al fondo. Junto al pabellón hay una estela con caligrafía del rey Gojong. Luego, cruzad el puente peatonal hacia la colina de enfrente, el pueblo de Jaman.',
    'En 1380, el general Yi Seong-gye se detuvo aquí tras derrotar a los piratas japoneses en la batalla de Hwangsan y celebró un banquete con su familia. Según la tradición, cantó una canción del fundador de la dinastía Han de China, como insinuando sus propias ambiciones. Doce años después fundaría la dinastía Joseon.'],
  '자만마을': [
    'Jaman es un pequeño pueblo de murales en la ladera de enfrente de Omokdae. Es el lado popular y bohemio del pueblo de hanok, con casas humildes pintadas de colores.',
    'Subid y bajad sus callejuelas buscando los murales: personajes de dibujos animados, escenas de películas y paisajes. Hay cafés escondidos con terraza y vistas. Recordad que es un barrio donde vive gente: hablad bajo.',
    'Tras la guerra de Corea, muchos refugiados se instalaron en esta ladera con casas muy sencillas. En la década de 2010 se pintaron los murales para revitalizar el barrio, y hoy es una de las paradas favoritas de los visitantes de Jeonju.'],
  'Café Jeonmang (azotea)': [
    'Jeonmang es el final del paseo de la Lonely: un café y bar en la azotea de un edificio de cuatro plantas del pueblo de hanok, con una de las mejores vistas de la zona.',
    'Subid a la terraza y mirad los tejados del pueblo de hanok, sobre todo con la luz del atardecer o ya de noche, cuando se iluminan.',
    'Jeonmang significa vista o panorama en coreano. Es buen sitio para repasar el día: habéis recorrido en pocas horas seiscientos años de historia de la ciudad, de la muralla de Joseon a los murales de hoy.'],
  // ---------- Seúl ----------
  '국립중앙박물관': [
    'El Museo Nacional de Corea es el museo más grande del país y uno de los mayores de Asia. Si solo veis un museo en Corea, que sea este: recorre la historia del país desde la prehistoria hasta la dinastía Joseon, y la entrada a las salas permanentes es gratis.',
    'No os lo perdáis: la sala de la contemplación silenciosa, con los dos bodhisattvas pensativos de bronce dorado, tesoros nacionales, en una sala oscura pensada para mirarlos con calma. La pagoda de diez pisos del templo Gyeongcheonsa, en el gran vestíbulo. Las coronas de oro de Silla, que conectan con Gyeongju. Y la sala de celadón de Goryeo, la cerámica verde más admirada de Corea.',
    'El museo se trasladó a este edificio de Yongsan en 2005. Antes estuvo en el antiguo edificio del gobierno colonial japonés, junto al palacio Gyeongbokgung, que se derribó en los años noventa. Fuera, el estanque con vistas a la torre de Namsan es un buen descanso.'],
  '드래곤힐스파': [
    'Dragon Hill Spa es un jjimjilbang, la sauna tradicional coreana: un lugar donde los coreanos van a relajarse, charlar, dormir la siesta y hasta pasar la noche. Es una experiencia muy local.',
    'Hay dos zonas. En las de baños, separadas por sexos, se entra sin ropa: primero hay que ducharse bien. En la zona común, con el pijama que os dan, hay salas de distintas temperaturas, como hornos de piedra o de sal. Probad los huevos cocidos en la sauna y el sikhye, una bebida dulce de arroz, y haced el típico gorro con la toalla.',
    'Los jjimjilbang se popularizaron en Corea en los años noventa y son un lugar de reunión familiar y social, parecido a una plaza. Están abiertos casi siempre las veinticuatro horas.'],
  '용산전자랜드': [
    'El mercado de electrónica de Yongsan fue durante décadas el gran centro de la informática y la electrónica de Seúl, el sitio donde se compraban ordenadores por piezas.',
    'Paseo por pasillos de tiendas pequeñas con componentes, consolas, cámaras y accesorios. Hoy hay muchos locales vacíos, así que tomadlo como una visita curiosa más que de compras.',
    'Con las compras por internet, el mercado ha perdido mucha actividad, y la zona de Yongsan está cambiando con grandes proyectos urbanísticos.'],
  '루프캣미명동점': [
    'Roof Cat Me es una cafetería de gatos junto al hostal: un descanso tranquilo al final del día.',
    'Se paga una entrada que suele incluir una bebida. Seguid las normas: lavarse las manos, no coger a los gatos en brazos si no se permite y no despertarlos.',
    'Las cafeterías de animales se pusieron de moda en Seúl porque muchos pisos pequeños no admiten mascotas.'],
  '명동': [
    'Myeongdong es el barrio de compras más famoso de Seúl, y vuestra base estos días. De noche se llena de puestos de comida callejera y de tiendas de cosmética.',
    'Probad algo en los puestos de la calle principal al anochecer. Subid hasta la catedral de Myeongdong, de ladrillo y estilo gótico. Y, si pasáis de noche, mirad la fachada del gran almacén Shinsegae, convertida en pantalla gigante con su vídeo de Navidad.',
    'La catedral de Myeongdong, terminada en 1898, fue la primera gran iglesia de estilo gótico de Corea. En 1987 sirvió de refugio a estudiantes y manifestantes del movimiento por la democracia, que acabó con las elecciones libres.'],
  '인왕산국사당': [
    'El santuario Guksadang, en la montaña Inwangsan, es el lugar más importante del chamanismo de Seúl. Aquí todavía se celebran rituales chamánicos, los gut, con música y ofrendas.',
    'Si hay un ritual, observad desde lejos y con respeto, sin fotos de las personas. Un poco más arriba están las rocas Seonbawi, con forma de monjes con túnica, a las que muchas mujeres vienen a rezar. Las vistas sobre la ciudad son estupendas.',
    'En la dinastía Joseon, el santuario estaba en la montaña de Namsan y allí se hacían ritos de Estado. En 1925 los japoneses construyeron en Namsan un gran santuario sintoísta y trasladaron el Guksadang aquí. El chamanismo es la religión más antigua de Corea y sigue vivo.'],
  '서대문형무소역사관': [
    'La prisión de Seodaemun es uno de los lugares más impactantes de Seúl. Aquí se encarcelaba y torturaba a los coreanos que luchaban por la independencia durante la ocupación japonesa.',
    'Recorred los pabellones de celdas, las salas que reconstruyen las torturas y, al fondo, el edificio de ejecuciones, con el álamo llamado árbol de los lamentos junto a la entrada. Hay paneles en inglés. Es duro, pero muy recomendable.',
    'La prisión se construyó en 1908, poco antes de que Japón se anexionara Corea en 1910. Aquí murió en 1920 Yu Gwan-sun, una estudiante de diecisiete años que se convirtió en el símbolo del movimiento del primero de marzo de 1919. Después de la independencia siguió siendo cárcel, también para opositores a las dictaduras, hasta 1987. Desde 1998 es museo.'],
  '서울역사박물관': [
    'El Museo de Historia de Seúl cuenta la historia de la capital desde que el fundador de Joseon la eligió como capital en 1394. La entrada es gratis.',
    'No os perdáis la gran maqueta de la ciudad actual, que se recorre desde una pasarela de cristal, y las salas sobre la Seúl de Joseon, entonces llamada Hanyang, con su muralla y sus cuatro grandes puertas. Fuera hay un antiguo tranvía de la ciudad.',
    'Seúl fue capital durante toda la dinastía Joseon, luego del Imperio coreano, de la época colonial y de la Corea moderna. Pasó de ser una ciudad amurallada de unas decenas de miles de habitantes a una metrópolis de más de nueve millones.'],
  '덕수궁': [
    'Deoksugung es el palacio más original de Seúl porque mezcla pabellones tradicionales con edificios de piedra de estilo occidental. Fue el escenario del final de la monarquía coreana.',
    'Mirad el cambio de guardia ante la puerta Daehanmun, el salón del trono Junghwajeon, el palacio de piedra Seokjojeon, de estilo neoclásico, y el pabellón Jeonggwanheon, donde el rey Gojong tomaba café. De noche se ilumina y abre hasta tarde.',
    'Empezó como residencia de un miembro de la familia real y se convirtió en palacio cuando el rey Seonjo se instaló aquí tras la invasión japonesa de 1592. En 1897 el rey Gojong volvió a este palacio y proclamó el Imperio coreano, intentando modernizar el país frente a Japón. Gojong murió aquí en 1919, y su funeral fue el detonante del movimiento por la independencia del primero de marzo.'],
  '덕수궁돌담길': [
    'El paseo del muro de piedra de Deoksugung es uno de los paseos más románticos de Seúl, sobre todo en otoño, con las hojas amarillas de los ginkgos.',
    'Caminad junto al muro del palacio hacia la zona de las antiguas legaciones extranjeras: veréis la iglesia metodista de Jeongdong, el museo de arte de Seúl y edificios de principios del siglo veinte.',
    'Dice la leyenda que las parejas que recorren juntas este camino acaban separándose, quizá porque aquí cerca estuvo el antiguo tribunal de familia, donde se tramitaban los divorcios.'],
  '이화벽화마을': [
    'Ihwa es un barrio de murales en la ladera de la montaña Naksan, uno de los más fotografiados de Seúl. Es un barrio residencial de casas modestas.',
    'Subid por las escaleras y callejuelas buscando los murales y las esculturas. Por respeto a los vecinos, hablad bajo y no entréis en patios ni fotografiéis las casas por dentro.',
    'En 2006 un proyecto de arte público llenó el barrio de murales. Se hizo tan famoso por las series de televisión que algunos vecinos, cansados del ruido, borraron en 2016 algunas de las obras más conocidas, como las escaleras de flores. Es un buen ejemplo de los problemas del turismo de masas.'],
  '낙산공원': [
    'El parque de Naksan sigue un tramo de la antigua muralla de Seúl. Al atardecer es uno de los mejores miradores de la ciudad, con la muralla iluminada.',
    'Caminad junto a la muralla y mirad cómo cambian las piedras: las de distintas épocas tienen formas y tamaños diferentes. Desde arriba se ve el centro de Seúl y la torre de Namsan.',
    'La muralla se construyó en 1396, recién fundada la dinastía Joseon, y unía las cuatro montañas que rodean el centro: unos dieciocho kilómetros. Naksan, la montaña del este, se llamaba así porque parecía la joroba de un camello. Buena parte de la muralla se ha restaurado y se puede recorrer a pie.'],
  '대학로': [
    'Daehak-ro es el barrio de los teatros de Seúl, lleno de gente joven, con más de cien salas pequeñas.',
    'Pasead por el parque Marronnier, con artistas callejeros y edificios de ladrillo rojo del arquitecto Kim Swoo-geun, y mirad los carteles de las obras. Muchas son en coreano, pero hay espectáculos sin texto.',
    'El nombre significa calle de la universidad: aquí estuvo la Universidad Nacional de Seúl hasta los años setenta. Al trasladarse, el barrio se llenó de teatros y cafés, y se convirtió en el centro del teatro independiente.'],
  '동대문시장': [
    'Dongdaemun es el gran barrio de la moda de Seúl: decenas de centros comerciales y mercados mayoristas, algunos abiertos casi toda la noche.',
    'Mirad la puerta Heunginjimun, la gran puerta del este de la muralla, con su muro semicircular de protección, y el Dongdaemun Design Plaza, el edificio futurista de Zaha Hadid, que de noche se ilumina.',
    'La zona fue durante siglos un lugar de comercio junto a la puerta del este. Desde los años sesenta se convirtió en el corazón de la industria textil de Seúl, con talleres que cosen de noche lo que se vende por la mañana.'],
  '광장시장': [
    'El mercado Gwangjang es uno de los mercados más antiguos de Seúl y el mejor sitio para probar la comida callejera coreana sentados en sus puestos.',
    'Buscad el bindaetteok, la tortita de judía mungo frita en mucho aceite, el mayak gimbap, unos rollitos de arroz tan adictivos que llevan la palabra droga en el nombre, y, si os atrevéis, el yukhoe, carne cruda de ternera. Sentaos en los bancos de los puestos y señalad lo que queráis.',
    'Se fundó en 1905 como mercado permanente y fue de los primeros de Corea con ese formato. En el piso de arriba se venden telas y hanbok. Hoy es famoso en todo el mundo por los programas de comida callejera.'],
  '남산골한옥마을': [
    'Namsangol es un pequeño pueblo de hanok a los pies de Namsan, a pocos minutos del hostal: casas tradicionales de la época Joseon reunidas en un jardín. Es un plan tranquilo y gratuito si llueve.',
    'Entrad en las casas para ver cómo se repartían los espacios entre hombres y mujeres y el suelo radiante ondol. Al fondo, en el parque, está la cápsula del tiempo de Seúl.',
    'Las cinco casas se trasladaron aquí desde distintos barrios de la ciudad. La cápsula del tiempo se enterró en 1994, para los seiscientos años de Seúl como capital, y no se abrirá hasta 2394.']
};
