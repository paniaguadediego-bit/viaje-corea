// Con ojos de guía: historia, qué mirar y consejo de los lugares más emblemáticos (Claude, a partir de la Lonely y fuentes culturales coreanas).
// Clave: hangul sin espacios (como DIA_LP). Primera línea = gancho; 👀 = qué mirar; 💡 = consejo.
const GUIA_CULT = {
 "경복궁": [
  "El corazón de la dinastía Joseon: aquí empezó todo en 1395.",
  "El rey Taejo, fundador de la dinastía, lo levantó nada más trasladar la capital a Seúl. Su nombre viene de un poema clásico chino y significa algo así como «el palacio de la gran bendición del cielo». Se colocó siguiendo la geomancia: la montaña Bugaksan protegiendo la espalda y el agua delante, como mandaba el feng shui coreano.",
  "Ardió durante la invasión japonesa de 1592 y pasó casi tres siglos en ruinas, hasta que el regente Heungseon Daewongun lo reconstruyó en 1867. Durante la ocupación japonesa (1910-1945) se derribó la mayor parte y se plantó delante el edificio del Gobierno General, que no se demolió hasta 1995-1996. Lo que veis hoy es, en buena parte, una reconstrucción paciente que sigue en marcha.",
  "👀 Fíjate: en los haechi de piedra de la puerta Gwanghwamun (bestias míticas que protegen del fuego y simbolizan la justicia), en el salón del trono Geunjeongjeon con el biombo del sol, la luna y las cinco montañas detrás del trono, y en el pabellón Gyeonghoeru, sobre un estanque, donde se celebraban los banquetes de Estado.",
  "💡 Consejo: el cambio de guardia en Gwanghwamun es puro teatro de época. Si vais con hanbok, la entrada es gratis, y la luz de la tarde sobre los tejados con Bugaksan detrás es la postal perfecta."
 ],
 "창덕궁": [
  "El palacio favorito de los reyes, el que mejor se funde con la naturaleza.",
  "Se construyó en 1405 como palacio secundario, pero tras la guerra de 1592 fue el primero en reconstruirse y sirvió de residencia real durante unos 270 años, más que el propio Gyeongbokgung. A diferencia de este, no sigue un eje rígido: los edificios se adaptan a las colinas. Por eso la UNESCO lo declaró Patrimonio de la Humanidad en 1997.",
  "Su joya es Huwon, el «jardín secreto»: un gran bosque en la ladera con pabellones y estanques donde los reyes paseaban, leían y escribían poesía. El estanque Buyongji, cuadrado (la tierra) con una isla redonda (el cielo), refleja el pabellón Juhamnu, que guardaba la biblioteca real del rey Jeongjo.",
  "👀 Fíjate: en la puerta Donhwamun, la más antigua de los palacios de Seúl que se conserva, y en Nakseonjae, sencillo y sin pintar, donde vivieron los últimos miembros de la familia real hasta 1989.",
  "💡 Consejo: el jardín secreto solo se visita con entrada aparte y en grupos, que se agotan. En noviembre es su mejor momento: arces rojos y ginkgos dorados sobre los tejados."
 ],
 "종묘": [
  "El lugar más solemne de Corea: aquí descansan los espíritus de los reyes.",
  "Jongmyo es el santuario confuciano donde se guardan las tablillas de los reyes y reinas de Joseon. Aquí no vivía nadie: es un espacio para los antepasados, y se nota en el silencio y en la sobriedad de la arquitectura. Fue de los primeros lugares de Corea en entrar en la lista de la UNESCO (1995).",
  "El salón principal, Jeongjeon, mide unos cien metros y es una de las construcciones tradicionales de madera más largas de Asia oriental: una fila infinita de columnas rojas y tejado oscuro que impresiona por pura repetición. El ritual Jongmyo Jerye, con su música de corte, se sigue celebrando cada año (en mayo) y es Patrimonio Inmaterial de la Humanidad.",
  "👀 Fíjate: en el camino de piedra del centro, ligeramente elevado. Es el sindo, el «camino de los espíritus», y no se pisa: los vivos van por los lados.",
  "💡 Consejo: id sin prisa y en silencio. Es el contrapunto perfecto al bullicio de los palacios, y muchos coreanos lo consideran lo más bello de Seúl."
 ],
 "북촌한옥마을": [
  "Un barrio vivo de casas tradicionales entre dos palacios.",
  "Bukchon («pueblo del norte») era donde vivían los aristócratas yangban, cerca de la corte. Casi todas las casas que veis son de los años veinte y treinta: un promotor coreano, Jeong Se-gwon, construyó hanoks para la clase media de Seúl como respuesta a la presión urbanística japonesa. Gracias a eso sobrevivió este paisaje de tejados de teja negra.",
  "Un hanok se piensa con la naturaleza: el suelo caliente ondol para el invierno, el porche de madera daecheong para el verano, patios interiores y aleros curvos que dejan entrar el sol bajo del invierno y cortan el alto del verano.",
  "👀 Fíjate: en las vistas de tejados escalonados de Gahoe-dong (las calles 11 y 31), con las torres de Seúl al fondo: la ciudad antigua y la moderna en una sola mirada.",
  "💡 Consejo: aquí vive gente y hay horario de visita. Hablad bajo y no entréis en patios. Temprano por la mañana la luz es preciosa y hay menos gente."
 ],
 "덕수궁": [
  "El palacio donde Corea intentó ser un imperio moderno.",
  "Era la residencia de un príncipe hasta que, tras la guerra de 1592, el rey Seonjo se instaló aquí porque los demás palacios habían ardido. Su gran momento llega en 1897: el rey Gojong vuelve de su refugio en la legación rusa, proclama el Imperio Coreano y convierte este palacio en su sede. Quería mostrar al mundo una Corea moderna e independiente.",
  "Por eso conviven pabellones tradicionales con edificios occidentales, como Seokjojeon, un palacio neoclásico de piedra terminado en 1910, el mismo año en que Japón se anexionó Corea.",
  "👀 Fíjate: en Jeonggwanheon, un pabellón de aire ruso donde, según la tradición, Gojong tomaba café: uno de los primeros cafés de la historia de Corea.",
  "💡 Consejo: el paseo del muro de piedra (Deoksugung-gil) es uno de los más románticos de Seúl, aunque la leyenda dice que las parejas que lo recorren acaban separándose. En otoño, con los ginkgos amarillos, merece el riesgo."
 ],
 "명동성당": [
  "La catedral de ladrillo que se convirtió en símbolo de la democracia.",
  "Se terminó en 1898 en estilo neogótico, sobre el lugar donde los primeros católicos coreanos se reunían a finales del siglo XVIII. El catolicismo llegó a Corea traído por los propios coreanos, que lo estudiaron en libros de China, y sufrió duras persecuciones: muchos mártires están ligados a esta iglesia.",
  "En 1987, en plena lucha contra la dictadura, estudiantes y trabajadores se refugiaron aquí y la Iglesia se negó a entregarlos a la policía. Desde entonces es un símbolo de libertad para muchos coreanos, sean o no creyentes.",
  "👀 Fíjate: en el ladrillo rojo y gris de varios tonos, en las vidrieras y en la cripta, donde se veneran reliquias de mártires.",
  "💡 Consejo: entrad en silencio. Es un remanso a dos pasos del ruido de Myeongdong."
 ],
 "N서울타워": [
  "La silueta de Seúl, sobre la montaña que protegía la ciudad.",
  "Namsan («montaña del sur») era el guardián meridional de la capital de Joseon. Por su cresta corre todavía la muralla de la ciudad, y en la cima había almenaras: cada noche, una cadena de fuegos traía desde todo el país la señal de que reinaba la paz.",
  "La torre empezó siendo una antena de televisión (1969-1975) y se abrió al público en 1980. Hoy es el mirador más famoso de Seúl y un clásico para parejas: los candados del amor cubren las barandillas.",
  "👀 Fíjate: en las almenaras (bongsu) reconstruidas junto a la torre y en los tramos de muralla del camino.",
  "💡 Consejo: subid al atardecer y quedaos a ver encenderse la ciudad. El teleférico ahorra la cuesta, pero bajar andando por los senderos de Namsan es un paseo precioso."
 ],
 "서대문형무소역사관": [
  "Un lugar duro y necesario para entender a Corea.",
  "La cárcel la construyeron los japoneses en 1908, dos años antes de la anexión, para encerrar a quienes luchaban por la independencia. Aquí murió en 1920 Yu Gwan-sun, una estudiante de 17 años que había encabezado las protestas del Movimiento del 1 de Marzo de 1919; hoy es una heroína nacional.",
  "Después de la liberación siguió siendo cárcel, también para presos políticos de las dictaduras, hasta 1987. En 1998 se convirtió en museo.",
  "👀 Fíjate: en las celdas originales, en el edificio de ejecuciones y en el álamo junto a su puerta, al que llaman «el árbol de los lamentos».",
  "💡 Consejo: id con calma; algunas salas impresionan. Cerca está la Puerta de la Independencia (Dongnimmun), de 1897."
 ],
 "청계천": [
  "Un río que Seúl enterró y luego quiso recuperar.",
  "Durante siglos el Cheonggyecheon fue el arroyo donde las mujeres lavaban la ropa y que separaba los barrios de la nobleza de los del pueblo llano. Con el crecimiento de la posguerra se cubrió y, en 1971, encima se levantó una autopista elevada.",
  "En 2005 la ciudad derribó la autopista y devolvió el agua y la luz al centro: unos 11 km de paseo con más de veinte puentes. Fue un símbolo de cómo una ciudad puede elegir a las personas antes que a los coches.",
  "👀 Fíjate: en Gwangtonggyo, puente que conserva piedras de la época Joseon, y en la gran escultura en espiral «Spring» de la plaza Cheonggye.",
  "💡 Consejo: en noviembre suele celebrarse aquí el Festival de Faroles de Seúl, con figuras de luz sobre el agua (VERIFICAR fechas). De noche, con los pies cerca del agua, es otro Seúl."
 ],
 "광장시장": [
  "El mercado con más historia y sabor de Seúl.",
  "Abrió en 1905 y es uno de los mercados permanentes más antiguos del país. Arriba se venden telas de seda para hanbok y ropa de segunda mano; abajo, en los pasillos centrales, decenas de puestos cocinan delante de vosotros mientras la gente come sentada en bancos corridos.",
  "Lo hizo famoso en todo el mundo la serie Street Food: Asia de Netflix, por el puesto de kalguksu (sopa de fideos cortados a cuchillo) de la señora Cho Yoon-sun.",
  "👀 Fíjate: en las piedras de moler donde preparan en directo la masa de judía mungo para el bindaetteok, y en los montones de mayak gimbap, los rollitos «adictivos».",
  "💡 Consejo: id con hambre y compartid platos para probar de todo. Bindaetteok con un vaso de makgeolli es el plan clásico."
 ],
 "국립중앙박물관": [
  "Toda la historia de Corea bajo un mismo techo.",
  "Es uno de los museos más grandes de Asia y la entrada a las colecciones permanentes es gratuita. Recorre desde la prehistoria hasta Joseon: coronas de oro de Silla, celadones de Goryeo de un verde jade imposible y cerámica blanca de Joseon.",
  "Su sala más emocionante es «La sala de la contemplación» (사유의 방): una habitación en penumbra con dos bodhisattvas pensativos de bronce dorado, del siglo VI-VII, sentados con una pierna cruzada y una sonrisa leve. Muchos coreanos vienen solo a sentarse frente a ellos.",
  "👀 Fíjate: en la pagoda de mármol de diez pisos del templo Gyeongcheonsa (1348), que se alza en el gran vestíbulo interior.",
  "💡 Consejo: no intentéis verlo todo. Sala de la contemplación, Silla, celadones y, si queda tiempo, el estanque y el jardín de pagodas de fuera."
 ],
 "안동하회마을": [
  "La aldea donde el río dibuja una S: seis siglos de una misma familia.",
  "«Hahoe» significa «el río que da la vuelta»: el Nakdong rodea la aldea formando una curva perfecta, y los geomantes decían que tenía forma de flor de loto flotando en el agua. Desde hace unos 600 años la habita el clan Ryu de Pungsan, y aún viven aquí sus descendientes. Es Patrimonio de la Humanidad desde 2010, junto a la aldea de Yangdong.",
  "Su vecino más ilustre fue Ryu Seong-ryong, primer ministro durante la guerra contra Japón de 1592 y autor del Jingbirok, unas memorias escritas «para que no se repitan los errores». Las casas grandes de teja (de los yangban) conviven con las de techo de paja de los campesinos: toda la sociedad Joseon en un paseo.",
  "De aquí son también las máscaras de Hahoe, talladas en madera de aliso, y la danza Byeolsingut Talnori, una sátira popular en la que los campesinos se burlaban de nobles y monjes.",
  "👀 Fíjate: en el árbol sagrado Samsindang, en el centro del pueblo, cubierto de papelitos con deseos, y en las casas Yangjindang y Chungyodang.",
  "💡 Consejo: cruzad en barca al acantilado de Buyongdae para ver la aldea entera desde arriba. Es la mejor vista de todo Andong."
 ],
 "도산서원": [
  "La escuela del sabio que llevas en la cartera.",
  "Aquí enseñó Yi Hwang (1501-1570), conocido como Toegye, el gran filósofo neoconfuciano de Corea. Tras renunciar a altos cargos en la corte, se retiró a este rincón junto al río para estudiar y enseñar. Tras su muerte, sus discípulos levantaron la academia (seowon) en su honor.",
  "Su retrato está en el billete de 1.000 wones y, en el reverso, una pintura de este mismo paisaje. Las academias confucianas de Corea son Patrimonio de la Humanidad desde 2019.",
  "👀 Fíjate: en Dosan Seodang, la pequeñísima casa de estudio que diseñó el propio Toegye, sobria a propósito, y en la tarima de exámenes al otro lado del río.",
  "💡 Consejo: sacad un billete de 1.000 ₩ y comparad. Es un lugar para pasear despacio, sentir el silencio y entender el ideal del sabio confuciano."
 ],
 "병산서원": [
  "Para muchos, la arquitectura más bella de Corea.",
  "Es la academia confuciana dedicada a Ryu Seong-ryong, el primer ministro de Hahoe. Se construyó en ladera para que, desde dentro, el paisaje fuera parte del edificio.",
  "Su gran pabellón, Mandaeru, es una tarima de madera abierta, sin paredes, mirando al río y al acantilado de enfrente, Byeongsan, cuyo nombre significa «montaña biombo». Sentarse allí es entender la idea coreana de no construir contra la naturaleza, sino para enmarcarla.",
  "👀 Fíjate: en las columnas de madera sin desbastar, que conservan la forma del árbol, y en cómo el pabellón «recorta» el paisaje como un cuadro.",
  "💡 Consejo: id sin prisas, si puede ser a última hora de la tarde. Es Patrimonio de la Humanidad, pero suele estar casi vacío."
 ],
 "봉정사": [
  "Aquí está el edificio de madera más antiguo de Corea.",
  "Este templo de montaña conserva el Geungnakjeon, un pequeño salón del periodo Goryeo: en una restauración de 1972 apareció un escrito que documenta una reparación en 1363, lo que lo convierte en la construcción de madera más antigua del país. Los templos de montaña coreanos (sansa) son Patrimonio de la Humanidad desde 2018.",
  "En 1999 la reina Isabel II lo visitó durante su viaje a Andong, y desde entonces es un lugar de peregrinación también para curiosos.",
  "👀 Fíjate: en la sencillez de líneas del Geungnakjeon, en el pabellón de entrada y en la ermita Yeongsanam, un poco más arriba, con sus patios en terraza.",
  "💡 Consejo: la subida por el bosque es parte de la visita. En otoño, con las hojas rojas, es uno de los templos más bonitos de Corea."
 ],
 "월영교": [
  "Un puente de madera inspirado en una historia de amor de hace 400 años.",
  "Es el puente peatonal de madera más largo de Corea (unos 390 m) y se inauguró en 2003. Su forma recuerda unas sandalias de cáñamo: en 1998, al excavar una tumba de 1586 en Andong, apareció una carta de una mujer a su marido muerto, Yi Eung-tae, junto a unas sandalias que había tejido con su propio cabello para que él se curara.",
  "La carta («la carta de la madre de Won») es uno de los textos de amor más conmovedores de la historia coreana, y el puente se construyó en su memoria. «Woryeong» significa «reflejo de la luna».",
  "👀 Fíjate: en el pabellón Woryeongjeong, en mitad del puente, y en la fuente que se enciende de noche.",
  "💡 Consejo: id al anochecer, cuando se ilumina y la luna se refleja en el agua. Es el plan romántico de Andong."
 ],
 "불국사": [
  "El «templo de la tierra de Buda»: el cielo hecho piedra.",
  "Lo mandó construir en el año 751 Kim Dae-seong, ministro del reino de Silla. Cuenta la leyenda que hizo Bulguksa por sus padres de esta vida y la gruta de Seokguram por los de su vida anterior. Los edificios de madera ardieron en 1593, pero las terrazas, escaleras y pagodas de piedra son originales de Silla. Es Patrimonio de la Humanidad desde 1995.",
  "Todo el templo es un mapa espiritual: subir sus escaleras es ascender del mundo humano a la tierra de Buda.",
  "👀 Fíjate: en las escaleras-puente Cheongungyo y Baegungyo (33 peldaños, por los 33 cielos budistas) y en las dos pagodas del patio. Dabotap, la ornamentada, es la que aparece en la moneda de 10 ₩; Seokgatap, la sobria, representa la paz del Buda.",
  "💡 Consejo: llevad una moneda de 10 ₩ para compararla con la pagoda. Temprano o al final del día se oyen los tambores y las campanas de los monjes."
 ],
 "석굴암": [
  "Un Buda de granito que lleva 1.200 años mirando al amanecer.",
  "Es una gruta artificial del siglo VIII: los artesanos de Silla construyeron una cúpula con bloques de granito y la cubrieron de tierra, imitando las cuevas sagradas de la India y China. Dentro, un gran Buda sentado mira al este, hacia el mar, donde sale el sol.",
  "Alrededor, en los muros, hay relieves de bodhisattvas, discípulos y guardianes de una delicadeza que se considera la cumbre del arte budista de Asia oriental. Hoy se ve tras un cristal para protegerlo de la humedad.",
  "👀 Fíjate: en la serenidad del rostro del Buda y en los pliegues de su manto, que parecen tela aunque son de piedra.",
  "💡 Consejo: es una visita corta pero intensa. El camino por el bosque desde el aparcamiento, con vistas a las montañas de Tohamsan, forma parte de la experiencia."
 ],
 "대릉원": [
  "Colinas verdes que son tumbas de reyes: dormir entre la realeza de Silla.",
  "En pleno centro de Gyeongju se levantan 23 grandes túmulos de reyes y nobles del reino de Silla (57 a. C.-935 d. C.). Silla duró casi mil años, uno de los reinos más longevos del mundo, y Gyeongju fue su capital.",
  "Dentro de los túmulos había cámaras de madera cubiertas de piedras y tierra, imposibles de saquear: por eso se han encontrado coronas de oro, cinturones y joyas intactas.",
  "👀 Fíjate: en Cheonmachong, la «tumba del caballo celestial», la única en la que se puede entrar. Debe su nombre a una pintura de un caballo volador sobre corteza de abedul. Y en Hwangnamdaechong, un túmulo doble de un rey y una reina.",
  "💡 Consejo: la foto clásica es la del magnolio entre dos túmulos. Al atardecer, con la luz rasante, las colinas parecen terciopelo."
 ],
 "첨성대": [
  "El observatorio astronómico más antiguo que se conserva en Asia oriental.",
  "Se construyó en el siglo VII, en el reinado de la reina Seondeok, la primera mujer que gobernó en Corea. Su forma de botella de piedra guarda muchos símbolos, según la interpretación tradicional: unos 362 bloques, tantos como días del año lunar, y 27 hileras, que algunos relacionan con que Seondeok fue la soberana número 27 de Silla.",
  "Los astrónomos de Silla observaban el cielo para predecir el tiempo de las cosechas y leer las señales del cielo sobre el reino.",
  "👀 Fíjate: en la ventana cuadrada de la mitad de la torre, por donde se entraba con una escalera.",
  "💡 Consejo: de noche se ilumina y el entorno, con prados y flores de otoño, es precioso para pasear hasta Donggung y el estanque Wolji."
 ],
 "동궁과월지": [
  "El estanque de la luna, hecho para que parezca un mar sin fin.",
  "El rey Munmu, que unificó la península bajo Silla, lo mandó construir en el año 674 como palacio del príncipe heredero y lugar de banquetes. El estanque está diseñado para que, desde ningún punto, se vea toda la orilla: así parece infinito, como un océano en miniatura con sus islas.",
  "Durante siglos se llamó Anapji. Cuando se vació para excavarlo, en 1975, aparecieron miles de objetos, entre ellos un dado de 14 caras con prendas para juegos de bebida, como «bebe tres copas de un trago» o «canta sin acompañamiento».",
  "👀 Fíjate: en el reflejo de los pabellones en el agua, perfecto cuando no hay viento.",
  "💡 Consejo: venid de noche, cuando se encienden las luces. Es la imagen más famosa de Gyeongju y la más fotografiada de todo el viaje."
 ],
 "국립경주박물관": [
  "El tesoro de un reino de oro.",
  "Guarda lo mejor de mil años de Silla: coronas de oro con forma de árbol y astas de ciervo, cinturones de los que cuelgan colgantes de jade y cerámica funeraria.",
  "En el jardín cuelga la Campana Divina del Rey Seongdeok (771), una de las campanas de bronce más grandes y bellas de Asia. Una leyenda triste cuenta que solo sonó bien cuando se fundió con un niño dentro, y que su sonido decía «emille», «mamá». Por eso se la conoce como campana Emille.",
  "👀 Fíjate: en las coronas de oro, finísimas, que tiemblan con cualquier movimiento: se cree que eran para ceremonias, no para el día a día.",
  "💡 Consejo: id antes de ver los túmulos. Así, cuando paseéis por Daereungwon, sabréis lo que había dentro."
 ],
 "감천문화마을": [
  "El pueblo de los refugiados que se pintó de colores.",
  "Durante la guerra de Corea (1950-1953), Busan fue el último refugio del país y llegaron cientos de miles de personas huyendo del norte. En esta ladera se instalaron muchas familias, entre ellas seguidores de la religión Taegukdo, que construyeron casas escalonadas para que ninguna tapara la luz ni las vistas de la de atrás.",
  "En 2009 un proyecto de arte llenó el barrio de murales, esculturas y colores, y Gamcheon pasó de ser un barrio pobre a uno de los lugares más visitados de Busan. Aquí sigue viviendo gente.",
  "👀 Fíjate: en la estatua del Principito y el zorro mirando el mar de tejados, y en los peces pintados que señalan el camino por los callejones.",
  "💡 Consejo: comprad el mapa en el centro de información y seguid el recorrido de sellos. Lo más bonito son los callejones estrechos que bajan, no la calle principal."
 ],
 "해동용궁사": [
  "Un templo budista sobre las rocas, con las olas a sus pies.",
  "La mayoría de templos coreanos están escondidos en las montañas; este, fundado en 1376 por el monje Naong, se asoma directamente al mar. Su nombre significa «templo del palacio del Rey Dragón en el mar del Este».",
  "Se baja por una escalera de 108 peldaños, el número de las pasiones humanas en el budismo, flanqueada por estatuas de los doce animales del zodiaco.",
  "👀 Fíjate: en la gran estatua blanca de Gwaneum, la bodhisattva de la compasión, mirando al mar, y en las pequeñas figuras de Buda donde la gente deja monedas.",
  "💡 Consejo: es famoso al amanecer, cuando el sol sale por el mar delante del templo. Buscad vuestro animal del zodiaco coreano en la escalera."
 ],
 "자갈치시장": [
  "El mayor mercado de pescado de Corea, con alma de puerto.",
  "Su nombre viene de los guijarros (jagal) de la antigua orilla. Las vendedoras, las «jagalchi ajimae», son leyenda en Busan: mujeres que levantaron el mercado vendiendo pescado en barreños tras la guerra.",
  "Su lema se lee en todas partes: «오이소, 보이소, 사이소» (ven, mira, compra), en el dialecto marinero de Busan.",
  "👀 Fíjate: en los acuarios llenos de pulpos, cangrejos reales, erizos y criaturas que no sabréis nombrar.",
  "💡 Consejo: el plan clásico es comprar el pescado en la planta baja y subir a que os lo preparen en crudo (hoe) o a la parrilla. Preguntad el precio antes de elegir."
 ],
 "전주한옥마을": [
  "Más de 700 casas tradicionales en la cuna de la dinastía Joseon.",
  "Jeonju es la ciudad de origen del clan Yi, la familia real de Joseon. El barrio nació en los años treinta, cuando los coreanos construyeron hanoks aquí como respuesta a la llegada de colonos japoneses al centro de la ciudad. Hoy es la mayor concentración de casas tradicionales habitadas del país.",
  "Jeonju es también la capital gastronómica de Corea (Ciudad Creativa de la Gastronomía de la UNESCO): aquí nació el bibimbap más famoso y se hace un excelente papel hanji, a mano, con corteza de morera.",
  "👀 Fíjate: en las líneas de tejados desde el mirador de Omokdae, en los talleres de hanji y en las tiendas de makgeolli.",
  "💡 Consejo: id de noche, cuando se encienden los faroles y se va la gente de excursión. Probad el bibimbap de Jeonju y el moju, un makgeolli caliente con canela."
 ],
 "경기전": [
  "El santuario que guarda el rostro del fundador de una dinastía.",
  "Se construyó en 1410 para guardar el retrato del rey Taejo, Yi Seong-gye, fundador de Joseon, cuya familia procedía de Jeonju. El retrato que se conserva, Tesoro Nacional, es una copia fiel del siglo XIX.",
  "Aquí estuvo además el archivo de Jeonju: durante la invasión japonesa de 1592, dos eruditos locales salvaron los Anales de la dinastía Joseon cargándolos a las montañas. Fue el único ejemplar que sobrevivió, y esos anales son hoy Memoria del Mundo de la UNESCO.",
  "👀 Fíjate: en el bosque de bambú, en el pabellón del retrato y en la sala de los anales.",
  "💡 Consejo: es un oasis de calma en medio del bullicio de la aldea hanok. Hay alquiler de hanbok cerca y las fotos con los árboles de otoño son preciosas."
 ],
 "전동성당": [
  "Una catedral sobre el lugar de los primeros mártires.",
  "Se levantó entre 1908 y 1914 en un estilo que mezcla lo románico y lo bizantino, justo donde en 1791 fueron ejecutados Yun Ji-chung y Gwon Sang-yeon, los primeros mártires católicos de Corea, por negarse a celebrar los ritos confucianos a los antepasados.",
  "Según la historia de la iglesia, en su construcción se usaron piedras de la antigua muralla de Jeonju.",
  "👀 Fíjate: en las cúpulas verdes y la fachada de ladrillo rojo frente a los tejados de los hanoks: un encuentro de dos mundos.",
  "💡 Consejo: la mejor foto es desde enfrente, junto a Gyeonggijeon, al atardecer."
 ],
 "오목대": [
  "La colina donde un general cantó que quería ser rey.",
  "En 1380, Yi Seong-gye volvía de derrotar a los piratas japoneses y se detuvo aquí a celebrarlo con su familia. Cuenta la historia que cantó el «Canto del gran viento», un antiguo poema del fundador de la dinastía Han de China. Todos entendieron el mensaje: doce años después fundaba Joseon.",
  "👀 Fíjate: en el pabellón y en la piedra con la inscripción del rey Gojong, que recuerda este episodio.",
  "💡 Consejo: es el mirador clásico sobre los tejados de la aldea hanok. Subid al atardecer o de noche, cuando las luces se encienden abajo."
 ],
 "조계사": [
  "El corazón del budismo coreano, en pleno centro de Seúl.",
  "Es la sede de la orden Jogye, la principal del budismo zen coreano (seon). A diferencia de los templos de montaña, está metido en la ciudad, y por él pasan oficinistas a rezar en su hora libre.",
  "👀 Fíjate: en el gran salón Daeungjeon, con tres budas dorados, en el pino blanco centenario del patio y en las filas de farolillos de colores con los nombres y deseos de las familias.",
  "💡 Consejo: entrad descalzos al salón si hay ceremonia, en silencio y por las puertas laterales: la central es para los monjes."
 ]
};
