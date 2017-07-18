/* eslint quotes: ["error", "backtick"] */
const straightMode = `///$tab HyperCube\n"MapDual__sorted_country":\nMapping\nLOAD\n*\nINLINE "\nsorted_country,sorted_country_qText}\n1,Sweden\n2,Denmark\n3,Norway\n4,Finland\n"\n(txt);\n\n"HyperCube":\nLOAD\n  Dual(ApplyMap('MapDual__sorted_country', sorted_country), sorted_country) AS "sorted_country",\n  "country_sort" AS "country_sort",\n  DATE("date", 'YYYY-MM-DD') AS "date",\n  INTERVAL("duration", 'hh:mm') AS "duration",\n  "mixed_dimension" AS "mixed_dimension",\n  "country" AS "country",\n  TIME("time", 'hh:mm:ss') AS "time",\n  TIMESTAMP("timestamp", 'YYYY-MM-DD hh:mm:ss[.fff]') AS "timestamp",\n  "year" AS "year",\n  "Sum(country_sort)" AS "Sum(country_sort)"\nINLINE "\nsorted_country,country_sort,date,duration,mixed_dimension,country,time,timestamp,year,Sum(country_sort)\n1,1,31908,1.3,1,Sweden,0.234,31908.234,1987,1\n2,2,29221,2.43,Denmark,Denmark,0.645,29221.645,1980,2\n3,3,30101,1.4000000000000001,1982-05-30,Norway,0.9,30101.9,1982,3\n4,4,31543,2.44,2.44,Finland,0.5,31543.5,1986,4\n"\n(txt);`;

export default {
  HyperCubes: { StraightMode: straightMode },
};
