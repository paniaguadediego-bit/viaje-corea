// 🧀 Trivial del viaje (Más → Trivial): dos jugadores en un móvil, por turnos. Un dado de colores elige el tema;
// cada acierto da un mini queso de ese tema y con 3 minis se gana su queso. Gana quien junte antes los 6 quesos.
// Acertar = sigues tirando; fallar = turno del otro. Partida y victorias en user.trivial y user.trivialWins (solo en el móvil).
// Preguntas: las fijas de aquí (públicas, comprobadas) y las que se generan con el contenido de la app y con vuestro
// trip.json (ciudades, noches, hoteles, traslados, días), que nunca se escriben en el repo.

const TRV_TEMAS = [
  ['hist', 'Historia', '📜', '#e3b23c'], ['lug', 'Lugares', '🏯', '#1f6fd0'], ['com', 'Comida', '🍜', '#e8892b'],
  ['idi', 'Idioma', '🔤', '#d6336c'], ['cos', 'Costumbres', '🙇', '#2e8b57'], ['via', 'Nuestro viaje', '✈️', '#8b5a2b']
];
const TRV_MINIS = 3;

// [pregunta, correcta, [incorrectas], explicación]
const TRV_FIJAS = {
  hist: [
    ['¿Qué dinastía gobernó Corea de 1392 a 1910?', 'Joseon', ['Goryeo', 'Silla', 'Baekje'], 'Joseon duró más de cinco siglos; Gyeongbokgung era su palacio principal.'],
    ['¿Qué rey creó el alfabeto hangul?', 'Sejong el Grande', ['Taejo', 'Gojong', 'Jeongjo'], 'Lo presentó en 1446 para que todo el pueblo pudiera leer. Sale en el billete de 10.000 ₩.'],
    ['¿De qué reino fue capital Gyeongju durante casi mil años?', 'Silla', ['Baekje', 'Goguryeo', 'Joseon'], 'Por eso la llaman «el museo sin paredes».'],
    ['¿Qué es Cheomseongdae, en Gyeongju?', 'Un observatorio astronómico', ['Una tumba real', 'Una pagoda budista', 'Una puerta de la muralla'], 'Del siglo VII, de la época de la reina Seondeok: uno de los observatorios más antiguos de Asia.'],
    ['¿Quién fue la primera reina de Corea?', 'Seondeok de Silla', ['Min (la emperatriz Myeongseong)', 'Shin Saimdang', 'Jindeok de Silla'], 'Reinó en el siglo VII; después vinieron Jindeok y Jinseong, también de Silla.'],
    ['¿En qué año anexionó Japón Corea?', '1910', ['1876', '1895', '1945'], 'La ocupación duró hasta el 15 de agosto de 1945.'],
    ['¿Qué día celebra Corea su liberación de Japón?', '15 de agosto', ['1 de marzo', '3 de octubre', '9 de octubre'], 'Es Gwangbokjeol, «el día en que volvió la luz». El 1 de marzo recuerda el levantamiento de 1919.'],
    ['¿En qué año empezó la Guerra de Corea?', '1950', ['1945', '1948', '1953'], 'Empezó el 25 de junio de 1950; el armisticio se firmó en 1953 y nunca hubo tratado de paz.'],
    ['¿Qué ciudad fue capital provisional de Corea del Sur durante la guerra?', 'Busan', ['Daegu', 'Jeonju', 'Gyeongju'], 'Fue de las pocas zonas que no cayeron; se llenó de refugiados (de ahí barrios como Gamcheon).'],
    ['¿Qué almirante derrotó a la flota japonesa con los «barcos tortuga»?', 'Yi Sun-sin', ['Sejong', 'Yi Hwang', 'Gwanggaeto'], 'En las invasiones japonesas de 1592-1598. Tiene estatua en la plaza Gwanghwamun.'],
    ['¿En qué año se celebraron los Juegos Olímpicos de Seúl?', '1988', ['1984', '1992', '2002'], 'Marcaron la llegada de la democracia y la apertura del país al mundo.'],
    ['¿De qué ciudad era el clan real Yi, el de los reyes Joseon?', 'Jeonju', ['Seúl', 'Andong', 'Gyeongju'], 'Por eso en Gyeonggijeon (Jeonju) se guarda el retrato del rey Taejo, el fundador.'],
    ['¿Qué rey fundó la dinastía Joseon?', 'Taejo (Yi Seong-gye)', ['Sejong', 'Gojong', 'Wang Geon'], 'Era un general que derrocó a Goryeo en 1392 y llevó la capital a Hanyang, la actual Seúl.'],
    ['¿Para qué usaron los japoneses la prisión de Seodaemun?', 'Para encerrar a independentistas coreanos', ['Para presos de la Guerra de Corea', 'Como cuartel del ejército', 'Como hospital'], 'Hoy es un museo sobre la ocupación japonesa.'],
    ['¿En honor de qué sabio confuciano se fundó la academia Dosan Seowon (Andong)?', 'Yi Hwang (Toegye)', ['Yi I (Yulgok)', 'Confucio', 'Sejong'], 'Toegye es el del billete de 1.000 ₩.'],
    ['¿De qué época son el templo Bulguksa y la gruta Seokguram?', 'Silla Unificada (siglo VIII)', ['Joseon (siglo XV)', 'Goryeo (siglo XII)', 'Ocupación japonesa'], 'Los dos son Patrimonio de la Humanidad desde 1995.'],
    ['¿Qué hay en los túmulos de Daereungwon (Gyeongju)?', 'Tumbas de reyes y nobles de Silla', ['Restos de un palacio', 'Búnkeres de la guerra', 'Silos de arroz'], 'En el de Cheonmachong apareció la pintura del caballo celeste y una corona de oro.'],
    ['¿Qué movimiento se recuerda cada 1 de marzo?', 'El levantamiento por la independencia de 1919', ['La fundación de la república', 'El fin de la guerra', 'La creación del hangul'], 'Samiljeol: millones de coreanos se manifestaron contra la ocupación japonesa.'],
    ['¿Qué rey de Joseon se proclamó emperador en 1897?', 'Gojong', ['Sejong', 'Taejo', 'Sunjong'], 'Proclamó el Imperio Coreano; vivió sus últimos años en Deoksugung.'],
    ['Según la leyenda, ¿quién fundó el primer reino coreano, Gojoseon?', 'Dangun', ['Jumong', 'Sejong', 'Bak Hyeokgeose'], 'Hijo de un dios y de una osa convertida en mujer; el 3 de octubre es la Fiesta de la Fundación.']
  ],
  lug: [
    ['¿Cómo se llama la puerta principal del palacio Gyeongbokgung?', 'Gwanghwamun', ['Namdaemun', 'Dongdaemun', 'Daehanmun'], 'Delante se hace el cambio de guardia.'],
    ['¿Qué río atraviesa Seúl?', 'Han', ['Nakdong', 'Geum', 'Yalu'], 'El Hangang divide la ciudad en norte (el centro histórico) y sur (Gangnam).'],
    ['¿Cómo se llama el arroyo recuperado en pleno centro de Seúl?', 'Cheonggyecheon', ['Hangang', 'Yangjaecheon', 'Gwangalli'], 'Estuvo tapado por una autopista hasta 2005.'],
    ['¿Cuánto mide la Lotte World Tower, el edificio más alto de Corea?', 'Unos 555 m', ['Unos 350 m', 'Unos 450 m', 'Unos 830 m'], 'Tiene 123 plantas y está en Jamsil.'],
    ['¿Cómo se llama el jardín secreto del palacio Changdeokgung?', 'Huwon', ['Biwon Park', 'Hyangwonjeong', 'Gyeonghoeru'], 'También lo llaman Biwon; solo se visita con guía.'],
    ['¿Entre qué dos palacios está el barrio de Bukchon?', 'Gyeongbokgung y Changdeokgung', ['Deoksugung y Gyeonghuigung', 'Changgyeonggung y Deoksugung', 'Gyeongbokgung y Deoksugung'], 'Unas 900 casas hanok donde vive gente: hay que hablar bajo.'],
    ['¿En qué ciudad está la playa de Haeundae?', 'Busan', ['Incheon', 'Gyeongju', 'Jeonju'], 'La playa urbana más famosa de Corea.'],
    ['¿Qué es Jagalchi, en Busan?', 'El gran mercado de pescado', ['Una playa', 'Un templo', 'Un barrio de hanok'], 'Abajo eliges el pescado y arriba te lo cocinan.'],
    ['¿Qué tiene de especial el templo Haedong Yonggungsa (Busan)?', 'Está junto al mar, sobre las rocas', ['Está en una cueva', 'Es el más antiguo de Corea', 'Está en lo alto de una torre'], 'La mayoría de templos coreanos están en montañas.'],
    ['¿Por qué es famoso el barrio de Gamcheon (Busan)?', 'Por sus casas de colores en la ladera', ['Por sus casas hanok', 'Por sus pescaderías', 'Por sus rascacielos'], 'Lo levantaron refugiados de la guerra; hoy está lleno de murales.'],
    ['¿Qué es la aldea de Hahoe (Andong)?', 'Una aldea tradicional en un meandro del río', ['Un barrio de teatros', 'Un mercado nocturno', 'Una isla'], 'Patrimonio de la Humanidad desde 2010; famosa por sus máscaras.'],
    ['¿Qué ciudad es famosa por su gran barrio de casas hanok, con más de 700?', 'Jeonju', ['Busan', 'Incheon', 'Daegu'], 'La Jeonju Hanok Village, junto a Gyeonggijeon.'],
    ['¿Qué torre corona la montaña Namsan, en Seúl?', 'N Seoul Tower', ['Lotte World Tower', '63 Building', 'Busan Tower'], 'Famosa por los candados del amor.'],
    ['¿En qué centro comercial está la Starfield Library?', 'COEX (Gangnam)', ['Lotte World Mall', 'Times Square', 'IFC Mall'], 'Una biblioteca de estanterías gigantes de 13 m.'],
    ['¿Qué templo budista está en pleno centro de Seúl, junto a Insadong?', 'Jogyesa', ['Bongeunsa', 'Bulguksa', 'Haedong Yonggungsa'], 'Es la sede de la orden Jogye, la principal del budismo coreano.'],
    ['¿Cuál es la segunda ciudad más poblada de Corea?', 'Busan', ['Incheon', 'Daegu', 'Jeonju'], 'Unos 3,2 millones de habitantes, frente a los más de 9 de Seúl.'],
    ['¿Qué mercado de Seúl es famoso por el bindaetteok y el mayak gimbap?', 'Gwangjang', ['Namdaemun', 'Noryangjin', 'Mangwon'], 'Uno de los mercados más antiguos de la ciudad.'],
    ['¿Qué ciudad era conocida como Hanyang en la época Joseon?', 'Seúl', ['Gyeongju', 'Busan', 'Jeonju'], 'Taejo la hizo capital en 1394.']
  ],
  com: [
    ['¿Con qué verdura se hace el kimchi más común?', 'Col china (baechu)', ['Pepino', 'Rábano', 'Lechuga'], 'También hay de rábano (kkakdugi) y de pepino (oi-sobagi), pero el clásico es de col.'],
    ['¿Qué es el makgeolli?', 'Un vino de arroz turbio y suave', ['Un licor de ciruela', 'Una cerveza de cebada', 'Un té de jengibre'], 'Va genial con un pajeon los días de lluvia.'],
    ['¿Qué es el soju?', 'Un licor transparente, normalmente de unos 16-20°', ['Un vino de arroz turbio', 'Un refresco de yogur', 'Una salsa de soja'], 'Se sirve en vasitos y siempre se lo sirves al otro, no a ti mismo.'],
    ['¿Qué plato es típico de Andong?', 'Jjimdak (pollo estofado con fideos)', ['Dwaeji gukbap', 'Bibimbap', 'Hwangnam-ppang'], 'Nació en el mercado de Andong.'],
    ['¿Qué plato es el más famoso de Jeonju?', 'Bibimbap', ['Jjimdak', 'Milmyeon', 'Samgyetang'], 'Jeonju es Ciudad Creativa de la Gastronomía de la UNESCO.'],
    ['¿Qué dulce es típico de Gyeongju?', 'Hwangnam-ppang (pan relleno de judía roja)', ['Hotteok', 'Pepero', 'Bungeoppang'], 'Toma el nombre del barrio de Hwangnam, junto a los túmulos.'],
    ['¿Qué sopa es típica de Busan?', 'Dwaeji gukbap (sopa de cerdo con arroz)', ['Samgyetang', 'Kimchi jjigae', 'Doenjang jjigae'], 'Junto con el milmyeon (fideos fríos de trigo).'],
    ['¿Qué son los banchan?', 'Las guarniciones que acompañan a la comida', ['Un tipo de fideos', 'Los postres', 'Las bebidas'], 'Suelen ser gratis y se pueden rellenar.'],
    ['¿Qué es el gochujang?', 'Pasta de guindilla fermentada', ['Pasta de soja', 'Salsa de pescado', 'Aceite de sésamo'], 'La base de la salsa del bibimbap y del tteokbokki.'],
    ['¿Qué es el tteokbokki?', 'Pastelitos de arroz en salsa picante', ['Fideos fríos', 'Una sopa de pollo', 'Una tortita de marisco'], 'El rey de la comida callejera.'],
    ['¿Qué lleva dentro el samgyetang?', 'Un pollito relleno de arroz y ginseng', ['Cerdo y kimchi', 'Tofu y marisco', 'Ternera y fideos'], 'Se toma sobre todo en verano: «calor contra calor».'],
    ['¿Qué significa «chimaek»?', 'Pollo frito con cerveza', ['Kimchi con arroz', 'Soju con cerveza', 'Fideos con huevo'], 'Chi(cken) + maekju (cerveza).'],
    ['¿De qué se hace el bindaetteok?', 'De judía mungo molida', ['De harina de trigo', 'De patata', 'De arroz glutinoso'], 'Se fríe en mucho aceite; el de Gwangjang es famoso.'],
    ['¿Qué es el hotteok?', 'Una tortita rellena de azúcar moreno y frutos secos', ['Un pastel en forma de pez', 'Una brocheta de pescado', 'Un helado'], 'Típico del invierno; el de Busan (ssiat hotteok) lleva pipas.'],
    ['¿Qué es el bungeoppang?', 'Un pastel en forma de pez relleno de judía roja', ['Un pescado a la parrilla', 'Un pan de gambas', 'Una galleta de sésamo'], 'No lleva pescado: solo la forma.'],
    ['¿Qué es el naengmyeon?', 'Fideos fríos en caldo helado', ['Fideos instantáneos', 'Arroz frito', 'Sopa de tofu'], 'Se cortan con tijeras en la mesa.'],
    ['¿Qué es el samgyeopsal?', 'Panceta a la parrilla en la mesa', ['Costilla marinada', 'Ternera cruda', 'Pollo frito'], 'Se envuelve en lechuga con ajo y ssamjang.'],
    ['¿Qué día de noviembre se regalan Pepero en Corea?', 'El 11 de noviembre', ['El 1 de noviembre', 'El 14 de noviembre', 'El 20 de noviembre'], 'Porque 11/11 parece cuatro palitos de Pepero.']
  ],
  idi: [
    ['¿Cuántas letras básicas tiene el hangul actual?', '24', ['14', '26', '40'], '14 consonantes y 10 vocales que se juntan en bloques de sílaba.'],
    ['¿Qué día se celebra el Día del Hangul en Corea del Sur?', '9 de octubre', ['15 de agosto', '1 de marzo', '25 de diciembre'], 'Hangeullal, festivo nacional.'],
    ['¿Qué significa «네» (ne)?', 'Sí', ['No', 'Hola', 'Gracias'], '«No» es 아니요 (aniyo).'],
    ['¿Qué significa «맛있어요» (masisseoyo)?', '¡Está rico!', ['¿Cuánto cuesta?', 'Lo siento', 'No pica'], 'La frase que más ilusión les hace oír.'],
    ['¿Qué significa «얼마예요?» (eolmayeyo)?', '¿Cuánto cuesta?', ['¿Dónde está?', '¿Qué es esto?', '¿Qué hora es?'], 'La frase de los mercados.'],
    ['¿Qué significa «출구» (chulgu) en el metro?', 'Salida', ['Entrada', 'Andén', 'Transbordo'], 'Entrada es 입구 (ipgu).'],
    ['¿Qué significa «역» (yeok)?', 'Estación', ['Calle', 'Hotel', 'Aeropuerto'], 'Seoul-yeok = estación de Seúl.'],
    ['¿Cómo suena la letra «ㅇ» al principio de una sílaba?', 'No suena', ['Como una «o»', 'Como «ng»', 'Como una «n»'], 'Al final de sílaba suena «ng»; al principio solo rellena el hueco.'],
    ['¿Qué significa «한국» (hanguk)?', 'Corea', ['Seúl', 'Coreano (idioma)', 'Bandera'], 'El idioma es 한국어 (hangugeo).'],
    ['¿Cómo se dice «gracias» de forma educada?', '감사합니다 (gamsahamnida)', ['안녕하세요 (annyeonghaseyo)', '죄송합니다 (joesonghamnida)', '괜찮아요 (gwaenchanayo)'], 'Más informal: 고마워요 (gomawoyo).'],
    ['¿Qué significa «화이팅» (hwaiting)?', '¡Ánimo!', ['¡Pelea!', '¡Cuidado!', '¡Salud!'], 'Viene del inglés «fighting».'],
    ['¿Qué significa «건배» (geonbae)?', '¡Salud! (al brindar)', ['Buen provecho', 'Adiós', 'Felicidades'], 'Antes de comer se dice 잘 먹겠습니다 (jal meokgetseumnida).'],
    ['¿Cómo llama una chica a su hermano mayor (y a veces a su novio)?', '오빠 (oppa)', ['언니 (eonni)', '누나 (nuna)', '형 (hyeong)'], 'Un chico diría 형 (hyeong); a una hermana mayor, la chica dice 언니 y el chico 누나.'],
    ['Si alguien dice «괜찮아요» (gwaenchanayo), ¿qué quiere decir?', 'Está bien / no pasa nada', ['No me gusta', 'Tengo prisa', 'No entiendo'], 'Sirve para casi todo: «estoy bien», «no hace falta», «no importa».'],
    ['¿Qué significa «저기요» (jeogiyo)?', '¡Perdone! (para llamar a alguien)', ['Adiós', 'Allí no', 'Lo siento mucho'], 'Así se llama al camarero.'],
    ['¿Qué significa «화장실» (hwajangsil)?', 'Baño', ['Habitación', 'Farmacia', 'Cocina'], '¿Dónde está el baño? = 화장실 어디예요?'],
    ['¿Cómo se lee «서울»?', 'Seoul (Seúl)', ['Busan', 'Hanguk', 'Gyeongju'], 'ㅅ (s) + ㅓ (eo) / ㅇ (muda) + ㅜ (u) + ㄹ (l).'],
    ['¿Qué número es «일» (il) en los números sino-coreanos?', 'Uno', ['Dos', 'Cinco', 'Diez'], 'En los coreanos nativos, uno es 하나 (hana).']
  ],
  cos: [
    ['¿Qué se hace al entrar en una casa coreana?', 'Quitarse los zapatos', ['Dar dos besos', 'Dejar un regalo en la puerta', 'Inclinarse tres veces'], 'También en muchos restaurantes de suelo y en algunos alojamientos.'],
    ['¿Qué número se evita por traer mala suerte?', 'El 4', ['El 7', 'El 13', 'El 9'], 'Se pronuncia «sa», como «muerte»; en los ascensores a veces pone F.'],
    ['¿Por qué no se escribe el nombre de alguien en tinta roja?', 'Se asocia con los muertos', ['Es de mala educación escribir nombres', 'Solo lo usan los profesores', 'Significa que le odias'], 'Antiguamente los nombres de los difuntos se escribían en rojo.'],
    ['¿Qué se hace al dar o recibir algo de una persona mayor?', 'Usar las dos manos', ['Inclinarse hasta el suelo', 'Mirarle fijamente', 'Darlo con la izquierda'], 'O la derecha sujetándose el brazo con la izquierda.'],
    ['Al beber alcohol con alguien mayor, ¿qué es lo educado?', 'Girar un poco la cara al beber', ['Beber de un trago', 'Brindar con el vaso más alto', 'Servirse uno mismo primero'], 'Y el vaso del mayor no debe estar vacío.'],
    ['¿Por qué no se clavan los palillos de pie en el arroz?', 'Recuerda a los ritos por los difuntos', ['Se rompen', 'Da hambre a los demás', 'Es de niños'], 'En los ritos ancestrales se pone así la cuchara.'],
    ['¿Qué se suele hacer con las propinas en Corea?', 'No se dejan', ['Un 10 %', 'Un 20 %', 'Se dejan solo en taxis'], 'No es costumbre: el precio ya está cerrado.'],
    ['¿Para quién son los asientos rosas del metro de Seúl?', 'Para embarazadas', ['Para mujeres', 'Para turistas', 'Para parejas'], 'Los de los extremos del vagón son para mayores.'],
    ['¿Qué fiesta coreana es la de la cosecha, como un Día de Acción de Gracias?', 'Chuseok', ['Seollal', 'Dano', 'Bucheonnim Osinnal'], 'Seollal es el Año Nuevo lunar.'],
    ['¿Cómo se llama el traje tradicional coreano?', 'Hanbok', ['Kimono', 'Hanok', 'Qipao'], 'Hanok son las casas tradicionales.'],
    ['¿Qué hay en el centro de la bandera de Corea del Sur?', 'Un círculo rojo y azul (taeguk)', ['Una estrella', 'Una flor', 'Un sol rojo'], 'Rodeado por cuatro trigramas negros: cielo, tierra, agua y fuego.'],
    ['¿Cuál es la flor nacional de Corea?', 'El mugunghwa (rosa de Siria, un hibisco)', ['La flor del cerezo', 'El loto', 'La camelia'], 'Su nombre significa «flor eterna».'],
    ['Desde 2023, ¿cómo se cuenta oficialmente la edad en Corea?', 'Como en España', ['Se nace con un año', 'Se suma un año cada Año Nuevo lunar', 'Por el signo del zodiaco'], 'Aun así, en el día a día mucha gente sigue usando la «edad coreana».'],
    ['¿A quién se ve en el billete de 50.000 ₩?', 'Shin Saimdang, pintora y poeta', ['El rey Sejong', 'La reina Seondeok', 'Yi Sun-sin'], 'Es la madre de Yi I (Yulgok), el del billete de 5.000 ₩.'],
    ['¿Cómo se saluda normalmente?', 'Con una leve inclinación', ['Con dos besos', 'Con un abrazo', 'Chocando el puño'], 'Cuanto más respeto, más inclinación.'],
    ['¿Qué tienen de especial los palillos coreanos?', 'Son de metal y planos', ['Son de bambú y muy largos', 'Son de plástico de colores', 'Van unidos por un cordel'], 'Y el arroz y la sopa se toman con cuchara.'],
    ['¿Qué suele pasar con las papeleras en la calle?', 'Hay pocas: se lleva la basura encima', ['Hay una en cada esquina', 'Hay que pagar por usarlas', 'Solo hay de reciclaje de vidrio'], 'En las tiendas 24 h suele haber.'],
    ['¿Qué se suele decir antes de empezar a comer?', '잘 먹겠습니다 (jal meokgetseumnida, «comeré bien»)', ['건배 (geonbae)', '화이팅 (hwaiting)', '안녕히 가세요 (annyeonghi gaseyo)'], 'Y al terminar, 잘 먹었습니다 (jal meogeotseumnida).'],
    ['¿Qué es un jjimjilbang?', 'Unos baños y saunas públicos donde se puede pasar la noche', ['Un mercado nocturno', 'Una casa de té', 'Un templo budista'], 'Se entra con pijama prestado; las zonas de baño van separadas por sexos.'],
    ['¿Qué es un noraebang?', 'Un karaoke en salas privadas', ['Una sala de ordenadores', 'Una cafetería de libros', 'Un restaurante de barbacoa'], 'Noraebang = «sala de canciones».'],
    ['¿Qué es un PC bang?', 'Una sala de ordenadores para jugar', ['Una tienda de móviles', 'Un cibercafé solo para trabajar', 'Una tienda de electrónica'], 'Abiertos 24 h, con comida que se pide desde el asiento.'],
    ['¿De qué se hace el papel tradicional hanji, famoso en Jeonju?', 'De corteza de morera', ['De arroz', 'De bambú', 'De algodón'], 'Muy resistente: se usa en puertas, lámparas y artesanía.'],
    ['¿Cómo se suele llamar al camarero en muchos restaurantes?', 'Con un timbre en la mesa', ['Levantando la mano en silencio', 'Silbando', 'Dando palmas'], 'Si no hay timbre, se dice 저기요 (jeogiyo).'],
    ['¿Quién suele pagar la cuenta cuando sale un grupo a comer?', 'Uno invita (a menudo el mayor) y la próxima otro', ['Se divide siempre a partes iguales', 'Paga el más joven', 'Cada uno pide en caja lo suyo'], 'Aunque entre amigos jóvenes ya se divide cada vez más.']
  ],
  via: [
    ['¿Cuál es el gran aeropuerto internacional de Seúl?', 'Incheon', ['Gimpo', 'Gimhae', 'Jeju'], 'Gimpo es sobre todo para vuelos nacionales y cercanos.'],
    ['¿A qué velocidad máxima va más o menos el tren KTX?', 'Unos 300 km/h', ['Unos 150 km/h', 'Unos 200 km/h', 'Unos 400 km/h'], 'Seúl-Busan en unas dos horas y media.'],
    ['¿Cómo se llama la tarjeta recargable para el metro y el bus?', 'T-money', ['Oyster', 'Suica', 'Octopus'], 'Se recarga en las tiendas 24 h y en las máquinas del metro.'],
    ['¿Por qué se usa Naver Map y no Google Maps en Corea?', 'Google Maps no da rutas a pie ni en coche', ['Google Maps está prohibido', 'Google Maps no tiene metro', 'Naver Map es gratis y Google no'], 'Por una ley que limita sacar mapas detallados del país.'],
    ['¿Qué app se usa para pedir taxis?', 'Kakao T', ['Uber Korea', 'Naver Taxi', 'Grab'], 'De la misma empresa que KakaoTalk.'],
    ['¿Cuántas horas más es en Corea que en Canarias en noviembre?', '9', ['7', '8', '10'], 'Corea no cambia la hora; en la Península son 8.'],
    ['¿A qué número se llama para ayuda turística con intérprete?', '1330', ['112', '119', '114'], 'Atiende en varios idiomas, las 24 horas.'],
    ['¿A qué número se llama a la policía en Corea?', '112', ['119', '1330', '091'], 'Ambulancia y bomberos: 119.'],
    ['¿Hacía falta adaptador de enchufe para Corea viniendo de España?', 'No: el enchufe y los 220 V son iguales', ['Sí, el enchufe es de tres patas planas', 'Sí, la corriente es de 110 V', 'Solo para el móvil'], 'Tipo C y F, como en casa.'],
    ['¿Qué tren conecta el aeropuerto de Incheon con la estación de Seúl?', 'AREX', ['KTX Sancheon', 'SRT', 'ITX-Saemaeul'], 'Hay uno exprés directo y otro con paradas.'],
    ['¿Qué hay que enseñar para comprar Tax Free?', 'El pasaporte', ['El billete de avión', 'El seguro de viaje', 'La tarjeta T-money'], 'Y en el aeropuerto se recupera lo que falte en los quioscos.'],
    ['¿Por qué lado de la carretera se circula en Corea?', 'Por la derecha, como en España', ['Por la izquierda', 'Depende de la ciudad', 'Por el centro en las autopistas'], 'Ojo al cruzar: muchas motos de reparto van por la acera.'],
    ['¿Cuál es el prefijo telefónico de Corea del Sur?', '+82', ['+81', '+86', '+84'], '+81 es Japón y +86, China.']
  ]
};

// ---------- Preguntas generadas con el contenido de la app y el trip.json ----------
const trvMezcla = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const trvAzar = a => a[Math.floor(Math.random() * a.length)];
const trvCiudades = { seul: 'Seúl', andong: 'Andong', gyeongju: 'Gyeongju', busan: 'Busan', jeonju: 'Jeonju' };
// 3 incorrectas distintas de la correcta (o null si no hay bastantes).
const trvMalas = (ok, pool) => { const m = [...new Set(pool.filter(x => x && x !== ok))]; return m.length >= 3 ? trvMezcla(m).slice(0, 3) : null; };
const trvP = (id, q, ok, pool, exp) => { const m = trvMalas(ok, pool); return m ? { id, q, ok, m, exp: exp || '' } : null; };

const TRV_GEN = {
  hist: [() => { const e = trvAzar(HIST_EVENTOS); return trvP('h:' + e[0], `¿Cuándo pasó esto? «${e[1]}»`, e[0], HIST_EVENTOS.map(x => x[0]), 'Lo tenéis en Historia → Línea del tiempo.'); }],
  lug: [
    () => { const ks = Object.keys(IMPRES).filter(k => trvCiudades[k]), k = trvAzar(ks), s = trvAzar(IMPRES[k]); if (!s) return null;
      return trvP('l:' + s.ko, `¿En qué ciudad está ${s.es}${s.ko ? ` (${s.ko})` : ''}?`, trvCiudades[k], Object.values(trvCiudades), s.desc || ''); },
    () => { if (typeof POBLACION === 'undefined') return null; const k = trvAzar(Object.keys(POBLACION));
      return trvP('p:' + k, `¿Cuántos habitantes tiene ${trvCiudades[k]}?`, POBLACION[k], Object.values(POBLACION), 'Datos de Corea → País → Población.'); }
  ],
  com: [
    () => { const g = trvAzar(PROBAR), it = trvAzar(g[3]); if (!it || !it[2]) return null;
      return trvP('c:' + it[1], `¿Qué es ${it[0]} (${it[1]})?`, it[2], PROBAR.flatMap(x => x[3].map(y => y[2])), ''); },
    () => { const s = trvAzar(SNACKS); return trvP('s:' + s[1], `¿Qué snack de tienda 24 h es este: «${s[2]}»?`, `${s[0]} (${s[1]})`, SNACKS.map(x => `${x[0]} (${x[1]})`), ''); }
  ],
  idi: [
    () => { const f = trvAzar(FRASES); return trvP('fk:' + f[1], `¿Qué significa «${f[1]}» (${f[2]})?`, f[0], FRASES.map(x => x[0]), ''); },
    () => { const f = trvAzar(FRASES); return trvP('fe:' + f[1], `¿Cómo se dice «${f[0]}»?`, `${f[1]} (${f[2]})`, FRASES.map(x => `${x[1]} (${x[2]})`), ''); }
  ],
  // Nuestro viaje: con vuestro trip.json (privado: solo en el móvil).
  via: [
    () => { const c = arr(trip.ciudades).filter(c => c.desde && trvCiudades[ck(c.nombre)]); if (!c.length) return null; const x = trvAzar(c);
      return trvP('vd:' + x.desde, `¿Qué día llegamos a ${x.nombre}?`, fmtCorto(x.desde), c.map(y => fmtCorto(y.desde)).concat(arr(trip.dias).map(d => fmtCorto(d.fecha))), ''); },
    () => { const c = arr(trip.ciudades).filter(c => c.desde && c.hasta && trvCiudades[ck(c.nombre)]); if (!c.length) return null; const x = trvAzar(c), n = Math.round((new Date(x.hasta) - new Date(x.desde)) / 864e5);
      const dos = c.filter(y => ck(y.nombre) === ck(x.nombre)).length > 1;
      return trvP('vn:' + x.desde, `¿Cuántas noches dormimos en ${x.nombre}${dos ? ' (desde el ' + fmtCorto(x.desde) + ')' : ''}?`, String(n), ['1', '2', '3', '4', '5', '6'], ''); },
    () => { const ds = arr(trip.dias).filter(d => trvCiudades[ck(d.ciudad)]); if (!ds.length) return null; const d = trvAzar(ds), a = alojDe(d.fecha).noche; if (!a) return null;
      return trvP('vc:' + d.fecha, `¿En qué ciudad dormimos la noche del ${fmtCorto(d.fecha)}?`, trvCiudades[ck(a.ciudad)] || a.ciudad, Object.values(trvCiudades), `En ${a.nombre}.`); },
    () => { const hs = arr(trip.alojamientos).filter(a => a.nombre && trvCiudades[ck(a.ciudad)]); if (hs.length < 4) return null; const a = trvAzar(hs);
      return trvP('vh:' + a.nombre, `¿Cómo se llamaba nuestro alojamiento en ${trvCiudades[ck(a.ciudad)]}${hs.filter(h => ck(h.ciudad) === ck(a.ciudad)).length > 1 ? ` (desde el ${fmtCorto(String(a.fechas || '').slice(0, 10))})` : ''}?`, a.nombre, hs.map(h => h.nombre), ''); },
    () => { const ts = arr(trip.traslados).filter(t => t.fecha && t.de && t.a && /Tren|Bus/.test(medio(t)[1])); if (!ts.length) return null; const t = trvAzar(ts), [ic, nom] = medio(t);
      return trvP('vt:' + t.fecha, `¿Cómo fuimos de ${lugarCorto(t.de)} a ${lugarCorto(t.a)} (${fmtCorto(t.fecha)})?`, `${ic} ${nom}`, ['🚆 Tren', '🚌 Bus', '✈️ Avión', '🚗 Coche de alquiler', '⛴️ Barco'], ''); },
    () => { const ds = arr(trip.dias).filter(d => trvCiudades[ck(d.ciudad)]); if (ds.length < 4) return null; const d = trvAzar(ds), k = ck(d.ciudad);
      const vis = listaDia(d).filter(l => hecho(l, k)), ls = vis.length ? vis : listaDia(d); if (!ls.length) return null; const s = trvAzar(ls).es;
      const otros = ds.filter(x => ck(x.ciudad) !== k).flatMap(x => listaDia(x).map(l => l.es));
      return trvP('vs:' + d.fecha + s, `¿Qué ${vis.length ? 'visitamos' : 'teníamos en el plan'} el ${fmtCorto(d.fecha)} en ${trvCiudades[k]}?`, s, otros, d.titulo ? `Ese día: ${d.titulo}.` : ''); },
    () => { const D = u().diario || {}, fs = Object.keys(D).filter(f => D[f] && D[f].cara); if (!fs.length) return null; const f = trvAzar(fs);
      return trvP('vf:' + f, `¿Qué carita pusimos en el diario el ${fmtCorto(f)}?`, `${D[f].cara} ${CARA_TXT[D[f].cara] || ''}`.trim(), CARAS.map(([c, t]) => `${c} ${t.toLowerCase()}`), ''); }
  ]
};
// Pregunta nueva del tema (sin repetir en la partida): mezcla fijas y generadas.
function trvPregunta(tema, usadas) {
  const fijas = (TRV_FIJAS[tema] || []).map((x, i) => ({ id: tema + ':' + i, q: x[0], ok: x[1], m: x[2], exp: x[3] })), gens = TRV_GEN[tema] || [];
  for (let n = 0; n < 40; n++) {
    let p = null;
    const libres = fijas.filter(f => !usadas.includes(f.id));
    if (libres.length && (Math.random() < 0.55 || !gens.length)) p = trvAzar(libres);
    else if (gens.length) { try { p = trvAzar(gens)(); } catch { p = null; } }
    if (p && !usadas.includes(p.id)) { const ops = trvMezcla([p.ok, ...p.m]); return { tema, id: p.id, q: p.q, ops, ok: ops.indexOf(p.ok), exp: p.exp }; }
  }
  return null;
}

// ---------- Partida ----------
const trvT = () => u().trivial;
const trvTema = k => TRV_TEMAS.find(t => t[0] === k) || TRV_TEMAS[0];
const trvQuesos = j => TRV_TEMAS.filter(t => (j.min[t[0]] || 0) >= TRV_MINIS).length;
// Quesito: 6 porciones; cada una se rellena por tercios con los minis y entera con el queso.
function trvQueso(j, tam = 64) {
  const r = 46, c = 50, porc = TRV_TEMAS.map(([k, , , col], i) => {
    const a0 = (i * 60 - 90) * Math.PI / 180, a1 = ((i + 1) * 60 - 90) * Math.PI / 180, n = Math.min(TRV_MINIS, j.min[k] || 0);
    const pt = (a, rr) => `${(c + rr * Math.cos(a)).toFixed(1)},${(c + rr * Math.sin(a)).toFixed(1)}`;
    const cuña = rr => `M${c},${c} L${pt(a0, rr)} A${rr},${rr} 0 0 1 ${pt(a1, rr)} Z`;
    return `<path d="${cuña(r)}" fill="${col}" fill-opacity="${n >= TRV_MINIS ? 1 : 0.12}" stroke="#fff" stroke-width="2"/>${n && n < TRV_MINIS ? `<path d="${cuña(r * Math.sqrt(n / TRV_MINIS))}" fill="${col}" fill-opacity=".75"/>` : ''}`; }).join('');
  return `<svg class="trv-queso" viewBox="0 0 100 100" width="${tam}" height="${tam}" aria-hidden="true"><circle cx="50" cy="50" r="48" fill="#fffdf6" stroke="#c9b98f" stroke-width="2"/>${porc}</svg>`;
}
function viewTrivial() {
  const T = trvT(), W = u().trivialWins || {};
  const marcador = Object.keys(W).length ? `<p class="muted centro">🏆 Victorias: ${Object.entries(W).map(([n, v]) => `${esc(n)} ${v}`).join(' · ')}</p>` : '';
  if (!T) return `<h2>🧀 Trivial del viaje</h2><p class="muted">Dos jugadores en un móvil. El dado elige el tema; cada acierto da un mini queso y con ${TRV_MINIS} minis de un tema ganáis su queso. Acertar = seguís; fallar = turno del otro. Gana quien junte antes los 6 quesos.</p>
    <div class="card trv-temas">${TRV_TEMAS.map(([, t, ic, col]) => `<span style="--tc:${col}">${ic} ${esc(t)}</span>`).join('')}</div>
    <div class="card"><label>Jugador 1 <input id="trv-j1" value="${esc((u().trivialNombres || [])[0] || '')}" placeholder="Nombre"></label>
    <label>Jugador 2 <input id="trv-j2" value="${esc((u().trivialNombres || [])[1] || '')}" placeholder="Nombre"></label>
    <button data-trv="empezar">▶️ Empezar partida</button></div>${marcador}`;
  const j = T.j[T.t], p = T.p, tm = p && trvTema(p.tema);
  const fichas = T.j.map((x, i) => `<div class="trv-jug ${i === T.t && T.fin == null ? 'on' : ''} ${T.fin === i ? 'gana' : ''}">${trvQueso(x)}<div><b>${esc(x.n)}</b><small>${trvQuesos(x)} de 6 quesos</small></div></div>`).join('');
  let cuerpo;
  if (T.fin != null) cuerpo = `<div class="card trv-fin">${trvQueso(T.j[T.fin], 120)}<h3>🏆 ¡Gana ${esc(T.j[T.fin].n)}!</h3><p class="muted">${T.j.map(x => `${esc(x.n)}: ${trvQuesos(x)} quesos`).join(' · ')}</p><button data-trv="nueva">🔁 Otra partida</button></div>`;
  else if (!p) cuerpo = `<div class="card trv-turno"><p>Turno de <b>${esc(j.n)}</b></p><div class="trv-dado ${T.rodando ? 'rueda' : ''}" id="trv-dado">🎲</div><button data-trv="tirar">🎲 Tirar el dado</button></div>`;
  else { const ok = T.r != null && T.r === p.ok, n = j.min[p.tema] || 0;
    cuerpo = `<div class="card trv-preg" style="--tc:${tm[3]}"><div class="trv-cab">${tm[2]} ${esc(tm[1])} <span>${'●'.repeat(Math.min(n, TRV_MINIS))}${'○'.repeat(Math.max(0, TRV_MINIS - n))}</span></div>
      <p class="trv-q">${esc(p.q)}</p><div class="trv-ops">${p.ops.map((o, i) => `<button class="trv-op ${T.r == null ? '' : i === p.ok ? 'bien' : i === T.r ? 'mal' : 'apag'}" data-trv="resp" data-i="${i}" ${T.r != null ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>
      ${T.r != null ? `<div class="trv-res ${ok ? 'bien' : 'mal'}">${ok ? (n >= TRV_MINIS && T.queso ? `🧀 ¡Queso de ${esc(tm[1])}!` : `✅ ¡Correcto! Mini queso de ${esc(tm[1])}`) : '❌ ¡Fallo!'}</div>${p.exp ? `<p class="muted">${esc(p.exp)}</p>` : ''}
        <button data-trv="sig">${ok ? `➡️ Sigue ${esc(j.n)}` : `➡️ Turno de ${esc(T.j[1 - T.t].n)}`}</button>` : ''}</div>`; }
  return `<h2>🧀 Trivial del viaje</h2><div class="trv-marc">${fichas}</div>${cuerpo}${marcador}
    <p class="centro"><button class="sec mini" data-trv="reset">↺ Empezar de nuevo</button></p>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-trv]'); if (!b) return;
  const U = u(), a = b.dataset.trv, T = U.trivial;
  if (a === 'empezar') { const v = id => ((document.getElementById(id) || {}).value || '').trim(), n = [v('trv-j1') || 'Jugador 1', v('trv-j2') || 'Jugador 2'];
    U.trivialNombres = n; U.trivial = { j: n.map(x => ({ n: x, min: {} })), t: Math.random() < 0.5 ? 0 : 1, p: null, r: null, usadas: [], fin: null }; }
  else if (a === 'reset' || a === 'nueva') { if (a === 'reset' && T && T.fin == null && !confirm('¿Dejar esta partida y empezar otra?')) return; U.trivial = null; }
  else if (!T) return;
  else if (a === 'tirar') { if (T.rodando) return; const j = T.j[T.t], libres = TRV_TEMAS.filter(t => (j.min[t[0]] || 0) < TRV_MINIS);
    T.rodando = true; render(); let n = 0;
    const iv = setInterval(() => { const d = document.getElementById('trv-dado'), t = trvAzar(libres); if (d) { d.textContent = t[2]; d.style.background = t[3]; }
      if (++n < 9) return; clearInterval(iv);
      let p = null; for (const t of trvMezcla(libres)) { p = trvPregunta(t[0], T.usadas); if (p) break; }
      T.rodando = false; T.p = p; T.r = null; T.queso = false; if (p) T.usadas.push(p.id); saveUser(); render(); }, 110);
    return; }
  else if (a === 'resp' && T.p && T.r == null) { T.r = Number(b.dataset.i); const j = T.j[T.t];
    if (T.r === T.p.ok) { j.min[T.p.tema] = (j.min[T.p.tema] || 0) + 1; T.queso = j.min[T.p.tema] >= TRV_MINIS;
      if (trvQuesos(j) === TRV_TEMAS.length) { T.fin = T.t; U.trivialWins = U.trivialWins || {}; U.trivialWins[j.n] = (U.trivialWins[j.n] || 0) + 1; } } }
  else if (a === 'sig' && T.p) { if (T.r !== T.p.ok) T.t = 1 - T.t; T.p = null; T.r = null; T.queso = false; }
  saveUser(); render();
});
