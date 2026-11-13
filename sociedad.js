// 🏛️ Corea → País: política, educación, ser médico, sueldos y población.
// Búsqueda de Claude en noviembre de 2026 (prensa coreana, organismos oficiales y encuestas); cada tema con sus fuentes.
// Euros aproximados a 1 € ≈ 1.600 ₩. Lo dudoso lleva VERIFICAR.
const PAIS = [
  { id: 'politica', ic: '🗳️', t: 'Política',
    intro: 'República presidencial joven: la democracia llegó en 1987 tras décadas de dictaduras militares. El presidente gobierna 5 años y no puede repetir.',
    bloques: [
      ['Cómo funciona', [
        'Presidente elegido directamente, un solo mandato de 5 años. Asamblea Nacional de una sola cámara: 300 diputados cada 4 años.',
        'Dos grandes partidos: el **Partido Democrático** (더불어민주당, centroizquierda, ahora en el gobierno) y el **Partido del Poder Popular** (국민의힘, conservador). Hay otros pequeños, como el Partido de Reconstrucción de la Patria (조국혁신당).',
        'Grandes temas de siempre: Corea del Norte (solo hay un armisticio desde 1953, nunca se firmó la paz), la alianza con EE. UU., la relación con Japón y China, la vivienda en Seúl y la natalidad.',
        'Servicio militar obligatorio para los hombres: 18 meses en el ejército de tierra.'
      ]],
      ['Lo que ha pasado (2024-2026)', [
        '**3 de diciembre de 2024**: el presidente Yoon Suk-yeol declara la ley marcial por sorpresa. Miles de personas rodean la Asamblea y los diputados la anulan esa misma noche, en unas horas.',
        '**14 de diciembre de 2024**: la Asamblea lo destituye; el Tribunal Constitucional lo confirma el **4 de abril de 2025**. Hubo meses de manifestaciones masivas con velas y barras de luz de conciertos de K-pop.',
        '**3 de junio de 2025**: elecciones anticipadas. Gana **Lee Jae-myung** (Partido Democrático) con un 49,4 %, frente al 41,2 % de Kim Moon-soo (VERIFICAR decimales).',
        '**19 de febrero de 2026**: Yoon es condenado en primera instancia a **cadena perpetua** por dirigir una insurrección (la fiscalía pedía la pena de muerte). Ha recurrido. Su ex primer ministro, 23 años; su ministro de Defensa, 30.',
        '**3 de junio de 2026**: elecciones locales. El Partido Democrático gana 12 de las 17 regiones y el Partido del Poder Popular, 4. En Seúl repite el conservador **Oh Se-hoon**, por unos 57.000 votos: primer alcalde con 5 mandatos. En Busan gana el demócrata Jeon Jae-soo.',
        'Popularidad de Lee (Gallup Korea): en torno al 60 % a principios de 2026 y hacia el **40 % en octubre**. Lo que más se le critica: la vivienda y la economía.'
      ]],
      ['Qué siente la gente', [
        'En la gran encuesta de valores del Ministerio de Cultura (2025), por primera vez desde 1996 el país que más gente desea es «una democracia madura» (31,9 %) y no «un país rico» (28,2 %). El ministerio lo relaciona con la ley marcial.',
        'Gallup (noviembre de 2025): la confianza en el ejército (70 %) y en la limpieza de las elecciones (60 %) está en máximos, pero un 69 % cree que la corrupción está extendida en el gobierno, y la sociedad está muy polarizada entre izquierda y derecha.',
        'Orgullo enorme por la cultura (K-pop, cine, series, cosmética, comida) junto a mucho estrés: los jóvenes hablan de «Hell Joseon» (헬조선) por la competencia en estudios y trabajo, la vivienda cara y las jornadas largas. Muchos jóvenes, desencantados, se alejan de la política.'
      ]],
      ['España y los españoles', [
        'España tiene muy buena imagen: en la encuesta anual de Consumer Insight sobre satisfacción de los viajeros coreanos, España fue el **destino n.º 1 en 2025**, el primer país en pasar de 800 puntos.',
        'El **Camino de Santiago** es casi un fenómeno en Corea: unos 9.500 peregrinos coreanos en 2024, entre los 10-11 países con más caminantes. Lo popularizaron un libro de viajes (2006) y programas de televisión, y se ve como una forma de escapar del estrés.',
        'Lo que más asocian a España: comida (jamón, paella, tapas), arte y Gaudí, fútbol (el internacional coreano Lee Kang-in jugó en el Valencia y el Mallorca) y el carácter abierto. En 2025 hubo una «Temporada de Corea» cultural en España.',
        'Consejo: decir «스페인 사람이에요» (seupein saramieyo, «soy español») suele arrancar sonrisas y alguna conversación sobre fútbol o el Camino.'
      ]]
    ],
    fuentes: [['Gallup Korea vía Kyunghyang (oct. 2026)', 'https://khan.co.kr/article/202610231020001'], ['Newsis: elecciones locales 2026', 'https://www.newsis.com/view/NISX20260604_0003656115'],
      ['Youth Daily: alcaldía de Seúl', 'https://www.youthdaily.co.kr/news/article.html?no=220333'], ['Seoul Shinmun: condena de Yoon', 'https://m.seoul.co.kr/news/2026/02/19/20260219800002'],
      ['JoongAng Daily: encuesta de valores 2025', 'https://www.koreajoongangdaily.com/korea/for-first-time-ever-poll-data-suggests-koreans-prioritize-democracy-over-the-economy/12448075'],
      ['Gallup: confianza tras la ley marcial', 'https://news.gallup.com/poll/698039/south-korea-restores-trust-realigns-foreign-relations.aspx'],
      ['Korea Times: jóvenes y política (2026)', 'https://www.koreatimes.co.kr/southkorea/society/20260507/after-impeachment-disappointed-young-koreans-turn-away-from-politics'],
      ['The Teams: España n.º 1 para viajeros coreanos', 'https://www.theteams.kr/news/detail/5325'], ['Elle Korea: el Camino de Santiago', 'https://www.elle.co.kr/article/1893239'],
      ['MTN: Temporada de Corea en España (2025)', 'https://news.mtn.co.kr/news-detail/2025062711493690334']] },

  { id: 'educacion', ic: '🎓', t: 'Educación',
    intro: 'Uno de los sistemas más competitivos del mundo: casi todo gira en torno a un examen, el suneung, que este año es justo el día que volvéis (19 de noviembre).',
    bloques: [
      ['Las etapas (6-3-3-4)', [
        '**Primaria** (초등학교, chodeunghakgyo): 6 años, de los 6-7 a los 12. Obligatoria y gratuita.',
        '**Secundaria baja** (중학교, junghakgyo): 3 años, de los 12 a los 15. Obligatoria.',
        '**Bachillerato** (고등학교, godeunghakgyo): 3 años, de los 15 a los 18. No es obligatorio, pero lo hace casi todo el mundo y es gratuito desde 2021 (VERIFICAR). Hay bachilleratos generales, de élite (ciencias, idiomas, privados autónomos) y de formación profesional, entre ellos los «Meister» (마이스터고), muy prácticos y con empleo en grandes empresas.',
        '**Universidad**: 4 años (6 en Medicina). El curso empieza en marzo y hay vacaciones largas en verano e invierno.'
      ]],
      ['Las academias (hagwon, 학원)', [
        'Después del colegio, la mayoría va a academias privadas hasta la noche: inglés, matemáticas, preparación del examen… Por ley deben cerrar como tarde a las 22:00 en Seúl (VERIFICAR).',
        'En 2025, el **75,7 %** de los alumnos de primaria a bachillerato iba a academias. Las familias gastaron **27,5 billones de wones** (≈ 17.000 millones de €).',
        'Quien va paga de media **604.000 ₩ al mes** (≈ 380 €) por hijo, un récord; en Seúl, 803.000 ₩ (≈ 500 €).'
      ]],
      ['El suneung (수능) y cómo se entra en la universidad', [
        'El **suneung** es el examen nacional de acceso: un solo día, de 8:40 a 17:45. Este año es el **19 de noviembre de 2026**, con 551.864 inscritos; más de 170.000 son repetidores («N-su», N수생), la cifra más alta en 23 años.',
        'Ese día el país se para: se pide a empresas y oficinas que empiecen a las 10:00, la policía lleva en moto a los alumnos que llegan tarde, se corta el tráfico a 200 m de los centros y, durante el examen de inglés oral (13:10-13:35), se reorganizan los aterrizajes y despegues. Vuestro vuelo sale a las 11:10, antes del parón; aun así, salid con tiempo.',
        'Dos vías de entrada: **susi** (수시, plazas por expediente, entrevistas y actividades; el 80,3 % de las plazas de 2027) y **jeongsi** (정시, solo por la nota del suneung; 19,7 %, aunque en la práctica sube porque pasan las plazas que sobran del susi).',
        'Las universidades más deseadas son las «SKY»: Universidad Nacional de Seúl, Korea y Yonsei. Medicina es la carrera con la nota más alta del país.'
      ]],
      ['Otras salidas', [
        'Universidades cortas (전문대, de 2-3 años) más orientadas al empleo.',
        'Bachilleratos profesionales y Meister, con contratos en grandes empresas al terminar.',
        'Oposiciones a funcionario (공무원), muy populares por la estabilidad, con academias especializadas en el barrio de Noryangjin (Seúl).',
        'Los chicos suelen hacer el servicio militar (18 meses) durante la carrera o al acabar el bachillerato.'
      ]]
    ],
    fuentes: [['Gobierno de Corea: el día del suneung 2026', 'https://m.korea.kr/news/policyNewsView.do?newsId=148973935'], ['SBS: horario de oficinas el 19 de noviembre', 'https://biz.sbs.co.kr/amp/article/20000341054'],
      ['Money Today: repetidores récord', 'https://www.mt.co.kr/policy/2026/09/08/2026090810102413804'], ['Newsis: gasto en academias 2025', 'https://www.newsis.com/view/NISX20260312_0003545284'],
      ['Seoul Shinmun: academias 2025', 'https://m.seoul.co.kr/news/2026/03/12/20260312500156'], ['Local Naeil: plazas susi y jeongsi 2027', 'https://www.localnaeil.com/News/View/652829']] },

  { id: 'medico', ic: '🩺', t: 'Ser médico',
    intro: 'La profesión más deseada y mejor pagada de Corea, y el centro de un conflicto que tuvo los hospitales medio vacíos de residentes de 2024 a 2025.',
    bloques: [
      ['La carrera', [
        'Se entra con el suneung (o por susi) directamente desde el bachillerato: hace falta una de las notas más altas del país. Muchos repiten el examen uno o varios años para conseguirlo.',
        'Dura **6 años**: 2 de premédica y 4 de medicina. Casi todas las facultades que habían pasado a un modelo de posgrado (4 años después de otra carrera) han vuelto a los 6 años.',
        'Hay 40 facultades. Durante casi 20 años las plazas estuvieron congeladas en **3.058** al año.'
      ]],
      ['El examen nacional (의사국가시험)', [
        'Al acabar la carrera, el examen nacional de medicina tiene dos partes: un **práctico** con pacientes simulados (marzo-abril) y un **escrito** (julio en 2026).',
        'En 2026: aprobó el práctico el **93,5 %** (1.664 de 1.779) y el escrito el **90,8 %** (1.631 de 1.797). Después hay que pedir la licencia, que comprueba título y requisitos.',
        'Los dentistas (치과의사) y los médicos de medicina tradicional coreana (한의사, hanuisa) estudian carreras y exámenes aparte. La medicina tradicional es muy común: veréis muchas clínicas con el cartel 한의원.'
      ]],
      ['Residencia y especialidad', [
        'Tras la licencia: **1 año de internado** (인턴) y **3-4 años de residencia** (레지던트) en la especialidad; medicina interna y medicina de familia son de 3 años (VERIFICAR). Al final, examen de especialista (전문의).',
        'Jornadas durísimas: la ley limita la residencia a **80 horas por semana** (media de 4 semanas) y 36 horas seguidas; se ensaya bajar a 72 h y 24 h seguidas.',
        'Los médicos varones hacen el servicio militar como médico militar (군의관) o de salud pública en zonas rurales (공보의): **36 meses**, el doble que un soldado. Por eso cada vez más estudiantes de Medicina se van de soldados rasos (2.838 entre enero y agosto de 2025, frente a 150 en 2020); se debate bajarlo a 24 meses.'
      ]],
      ['Especialidades: las que se llenan y las que no', [
        'Las favoritas por sueldo y calidad de vida: dermatología, oftalmología y cirugía plástica (los médicos las llaman «피안성», pi-an-seong), y también radiología, rehabilitación y psiquiatría.',
        'Las que faltan: **pediatría** (en la convocatoria de 2026 se cubrió solo el 20,6 % de las plazas), cirugía cardiotorácica (25 %), urgencias y obstetricia. Fuera de Seúl, muchos hospitales no tienen candidatos.'
      ]],
      ['Sueldos', [
        'Media de un médico en 2023: **285 millones de ₩ al año** (≈ 180.000 €), la más alta entre las profesiones sanitarias y entre las más altas de la OCDE. Creció un 5,6 % al año entre 2013 y 2023.',
        'Depende mucho de dónde trabaje: hospital mediano, 354 millones (≈ 220.000 €); consulta privada (의원), 326 millones; hospital universitario grande, 200 millones (≈ 125.000 €).',
        'Para comparar: dentista, 203 millones; medicina tradicional, 104 millones; farmacéutico, 84 millones; enfermera, 52 millones (≈ 32.000 €).'
      ]],
      ['El gran conflicto (2024-2026)', [
        'Febrero de 2024: el gobierno de Yoon anuncia **2.000 plazas más** al año (de 3.058 a 5.058). Casi todos los residentes dimiten en bloque y muchos estudiantes dejan las clases; los hospitales universitarios funcionan meses a medio gas.',
        'Al final, para 2026 se volvió a 3.058 plazas. En septiembre de 2025 volvieron la mayoría: 7.984 residentes, un 76 % de los que había antes; en las especialidades populares volvió casi el 90 % y en las esenciales, en torno al 40 %.',
        'Febrero de 2026: el nuevo gobierno aprueba **490 plazas más para 2027** (3.548) y subir poco a poco hasta 2031 (668 más al año de media). Las plazas nuevas son de «médico regional», fuera de Seúl: estudios pagados a cambio de trabajar **10 años** en hospitales públicos de esa región. Médicos y asociaciones de pacientes se han quejado, por motivos opuestos.'
      ]]
    ],
    fuentes: [['Daily Medi: sueldos de los sanitarios (2023)', 'https://dailymedi.com/news/news_view.php?ca_id=&wr_id=940942'], ['Herald: sueldo por tipo de centro', 'https://www.heraldk.com/article/2026092822213461693'],
      ['Medigate: examen nacional 2026', 'https://www.medigatenews.com/news/2169063057'], ['Daily Pharm: aprobados 2026', 'https://m.dailypharm.com/user/news/340959'],
      ['Newsis: vuelta de los residentes (2025)', 'https://www.newsis.com/view/NISX20250908_0003320099'], ['Medical Times: vuelta por especialidad', 'https://www.medicaltimes.com/Mobile/News/NewsView.html?ID=1165051'],
      ['Daum: 490 plazas más para 2027', 'https://v.daum.net/v/z2dNXp4qWo'], ['Twig24: plan de plazas 2027-2031', 'https://www.twig24.com/news/2026/02/10/20260210500354'],
      ['Daily Medi: residencias cubiertas 2026', 'https://dailymedi.com/news/news_view.php?wr_id=934045'], ['Money Today: límite de 80 h', 'https://www.mt.co.kr/thebio/2025/09/23/2025092311470157706'],
      ['Youth Daily: servicio militar de los médicos', 'https://www.youthdaily.co.kr/mobile/article.html?no=226947']] },

  { id: 'sueldos', ic: '💼', t: 'Sueldos y trabajo',
    intro: 'Sueldos medios parecidos a los de España o algo más altos, pero con jornadas más largas, mucha diferencia entre grandes empresas y pymes, y la mayor brecha salarial entre hombres y mujeres de la OCDE.',
    bloques: [
      ['Salario mínimo', [
        '**2026: 10.320 ₩ por hora** (≈ 6,5 €), unos 2,16 millones al mes a jornada completa (≈ 1.350 €).',
        '**2027: 10.700 ₩ por hora** (+3,7 %), unos 2,24 millones al mes (≈ 1.400 €).'
      ]],
      ['Lo que se cobra', [
        'Sueldo medio al mes en 2025: **4,5 millones de ₩ los hombres** (≈ 2.800 €) y **2,96 millones las mujeres** (≈ 1.850 €). Ellas cobran el 65,7 % que ellos.',
        'Según la OCDE, la brecha entre hombres y mujeres es del 29 % (2024): la mayor de los 38 países miembros, casi el triple de la media.',
        'Fijos frente a temporales: unos 4,05 millones al mes frente a 2,11 millones (encuesta de agosto, VERIFICAR el año). Trabajar en un gran grupo (Samsung, Hyundai, LG, SK…) o ser funcionario es el sueño de muchos.',
        'Para comparar con las profesiones sanitarias, mirad «Ser médico».'
      ]],
      ['Vida diaria', [
        'Vivienda: en Seúl muchos alquilan con **jeonse** (전세): se deja al casero un depósito enorme (a menudo más de la mitad del valor del piso) y no se paga alquiler mensual; al irse, se devuelve.',
        'Es habitual cenar con los compañeros de trabajo (회식, hoesik) y salir tarde de la oficina, aunque la jornada máxima legal es de 52 horas a la semana (VERIFICAR).'
      ]]
    ],
    fuentes: [['Newsis: salario mínimo 2027', 'https://www.newsis.com/view/NISX20260715_0003709468'], ['Wikitree: sueldos de hombres y mujeres 2025', 'https://www.wikitree.co.kr/articles/1156885'],
      ['Herald: mitad de las mujeres, menos de 3 millones', 'https://www.heraldk.com/article/2026090106301487158'], ['Kyunghyang: fijos y temporales', 'https://khan.co.kr/article/202610211200011']] },

  { id: 'poblacion', ic: '👥', t: 'Población',
    intro: 'Unos 51 millones de habitantes, la natalidad más baja del mundo y uno de los envejecimientos más rápidos.',
    bloques: [
      ['Cifras', [
        '**51.117.378** empadronados a 31 de diciembre de 2025: sexto año seguido de bajada.',
        'El **21,2 %** tiene 65 años o más: Corea ya es una «sociedad superenvejecida».',
        'Casi la mitad del país vive en el área de Seúl (Seúl, Incheon y la provincia de Gyeonggi).'
      ]],
      ['La natalidad', [
        '2025: **0,80 hijos por mujer** (dato provisional), la más baja del mundo, aunque sube por segundo año (en 2023 fue 0,72).',
        '**254.500 nacimientos** en 2025, un 6,8 % más: la mayor subida en 15 años, sobre todo primeros hijos y madres de más de 35 años. Aun así, mueren más personas de las que nacen desde hace 6 años.',
        'Causas que se repiten: vivienda carísima, jornadas largas, coste de la educación (academias) y la presión sobre las mujeres para dejar el trabajo.'
      ]],
      ['Vuestras ciudades', [
        '**Seúl** (서울): unos 9,34 millones (2025), bajando desde 2009.',
        '**Busan** (부산): unos 3,24 millones, la segunda ciudad.',
        '**Jeonju** (전주): 625.437 a finales de 2025.',
        '**Gyeongju** (경주): 259.676 a finales de 2025 (con extranjeros).',
        '**Andong** (안동): unos 154.000 (censo de 2025).'
      ]]
    ],
    fuentes: [['Money Today: población 2025', 'https://www.mt.co.kr/policy/2026/01/04/2026010216565058654'], ['Newsis: natalidad 2025', 'https://www.newsis.com/view/NISX20260225_0003525439'],
      ['Índice nacional (Seúl y Busan)', 'https://www.index.go.kr/unity/potal/main/EachDtlPageDetail.do?idx_cd=1007'], ['Gyeongbuk: población por ciudad', 'https://www.gb.go.kr/Main/economy/page.do?mnu_uid=6816'],
      ['Nocut News: Jeonju', 'https://nocutnews.co.kr/news/6573371'], ['City Population: Andong', 'https://www.citypopulation.de/en/southkorea/admin/gyeongsangbuk_do/37040__andong_si/']] }
];
// Habitantes de cada ciudad (bajo el título en Planes); misma fuente que «Población».
const POBLACION = { seul: '9,34 millones de hab. (2025)', busan: '3,24 millones de hab. (2025)', jeonju: '625.000 hab. (2025)', gyeongju: '260.000 hab. (2025)', andong: '154.000 hab. (2025)' };
