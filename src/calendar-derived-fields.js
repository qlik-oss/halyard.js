import DerivedFieldTemplate from './derived-fields-template';

const derivedFieldsDefinition = `Dual(Year($1), YearStart($1)) AS [Year] Tagged ('$axis', '$year'),
  Dual('Q'&Num(Ceil(Num(Month($1))/3)),Num(Ceil(NUM(Month($1))/3),00)) AS [Quarter] Tagged ('$quarter', '$cyclic'),
  Dual(Year($1)&'-Q'&Num(Ceil(Num(Month($1))/3)),QuarterStart($1)) AS [YearQuarter] Tagged ('$yearquarter', '$qualified'),
  Dual('Q'&Num(Ceil(Num(Month($1))/3)),QuarterStart($1)) AS [_YearQuarter] Tagged ('$yearquarter', '$hidden', '$simplified'),
  Month($1) AS [Month] Tagged ('$month', '$cyclic'),
  Dual(Year($1)&'-'&Month($1), monthstart($1)) AS [YearMonth] Tagged ('$axis', '$yearmonth', '$qualified'),
  Dual(Month($1), monthstart($1)) AS [_YearMonth] Tagged ('$axis', '$yearmonth', '$simplified', '$hidden'),
  Dual('W'&Num(Week($1),00), Num(Week($1),00)) AS [Week] Tagged ('$weeknumber', '$cyclic'),
  Date(Floor($1)) AS [Date] Tagged ('$axis', '$date', '$qualified'),
  Date(Floor($1), 'D') AS [_Date] Tagged ('$axis', '$date', '$hidden', '$simplified'),
  If (DayNumberOfYear($1) <= DayNumberOfYear(Today()), 1, 0) AS [InYTD] ,
Year(Today())-Year($1) AS [YearsAgo] ,
  If (DayNumberOfQuarter($1) <= DayNumberOfQuarter(Today()),1,0) AS [InQTD] ,
4*Year(Today())+Ceil(Month(Today())/3)-4*Year($1)-Ceil(Month($1)/3) AS [QuartersAgo] ,
Ceil(Month(Today())/3)-Ceil(Month($1)/3) AS [QuarterRelNo] ,
  If(Day($1)<=Day(Today()),1,0) AS [InMTD] ,
12*Year(Today())+Month(Today())-12*Year($1)-Month($1) AS [MonthsAgo] ,
Month(Today())-Month($1) AS [MonthRelNo] ,
  If(WeekDay($1)<=WeekDay(Today()),1,0) AS [InWTD] ,
(WeekStart(Today())-WeekStart($1))/7 AS [WeeksAgo] ,
Week(Today())-Week($1) AS [WeekRelNo];`;

/**
 * A field matching callback to identify which fields that are associated with a specific calendarTemplate.
 * @callback fieldMatchingCalendarCallback
 * @param {string} calendarTemplate
 * @param {Field}
 */

/**
 * Get the derived field definition for a field that matches the pattern
 * @public
 * @param {fieldMatchingCalendarCallback} fn - Field matcher function
 * @returns {DerivedFieldsTemplate}
 */
function getCalenderDerivedFieldDefinition(fn) {
  return new DerivedFieldTemplate({
    name: 'autoCalendar',
    fieldTag: 'date',
    derivedFieldDefinition: derivedFieldsDefinition,
    fieldMatchFunction: () => fn(f => f.calendarTemplate),
  });
}

export default getCalenderDerivedFieldDefinition;
