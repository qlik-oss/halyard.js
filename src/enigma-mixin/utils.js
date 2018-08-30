/**
 * @public
 * @param {object} localInfoData
 * @returns {object}
 */
export default function convertQixGetLocalInfo(localInfoData) {
  return {
    ThousandSep: localInfoData.qThousandSep,
    DecimalSep: localInfoData.qDecimalSep,
    MoneyThousandSep: localInfoData.qMoneyThousandSep,
    MoneyDecimalSep: localInfoData.qMoneyDecimalSep,
    MoneyFormat: localInfoData.qMoneyFmt,
    TimeFormat: localInfoData.qTimeFmt,
    DateFormat: localInfoData.qDateFmt,
    TimestampFormat: localInfoData.qTimestampFmt,
    FirstWeekDay: localInfoData.qFirstWeekDay,
    ReferenceDay: localInfoData.qReferenceDay,
    FirstMonthOfYear: localInfoData.qFirstMonthOfYear,
    CollationLocale: localInfoData.qCollation,
    MonthNames: localInfoData.qCalendarStrings.qMonthNames,
    LongMonthNames: localInfoData.qCalendarStrings.qLongMonthNames,
    DayNames: localInfoData.qCalendarStrings.qDayNames,
    LongDayNames: localInfoData.qCalendarStrings.qLongDayNames,
  };
}
