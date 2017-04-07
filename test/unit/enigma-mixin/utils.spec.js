import convertQixGetLocalInfo from '../../../src/enigma-mixin/utils';

const input = { qDecimalSep: ',',
  qThousandSep: ' ',
  qListSep: ';',
  qMoneyDecimalSep: ',',
  qMoneyThousandSep: '.',
  qCurrentYear: 2017,
  qMoneyFmt: '#.##0,00 kr;-#.##0,00 kr',
  qTimeFmt: 'hh:mm:ss',
  qDateFmt: 'YYYY-MM-DD',
  qTimestampFmt: 'YYYY-MM-DD hh:mm:ss[.fff]',
  qCalendarStrings:
  { qDayNames: ['mån', 'tis', 'ons', 'tor', 'fre', 'lör', 'sön'],
    qMonthNames:
    ['jan',
      'feb',
      'mar',
      'apr',
      'maj',
      'jun',
      'jul',
      'aug',
      'sep',
      'okt',
      'nov',
      'dec'],
    qLongDayNames:
    ['måndag',
      'tisdag',
      'onsdag',
      'torsdag',
      'fredag',
      'lördag',
      'söndag'],
    qLongMonthNames:
    ['januari',
      'februari',
      'mars',
      'april',
      'maj',
      'juni',
      'juli',
      'augusti',
      'september',
      'oktober',
      'november',
      'december'] },
  qFirstWeekDay: 0,
  qReferenceDay: 4,
  qFirstMonthOfYear: 1,
  qCollation: 'sv-SE' };


describe('convertQixGetLocalInfo', () => {
  const output = convertQixGetLocalInfo(input);

  it('should include ThousandSep', () => {
    expect(output.ThousandSep).to.eql(input.qThousandSep);
    expect(output.DecimalSep).to.eql(input.qDecimalSep);
    expect(output.MoneyThousandSep).to.eql(input.qMoneyThousandSep);
    expect(output.MoneyDecimalSep).to.eql(input.qMoneyDecimalSep);
    expect(output.MoneyFormat).to.eql(input.qMoneyFmt);
    expect(output.TimeFormat).to.eql(input.qTimeFmt);
    expect(output.DateFormat).to.eql(input.qDateFmt);
    expect(output.TimestampFormat).to.eql(input.qTimestampFmt);
    expect(output.FirstWeekDay).to.eql(input.qFirstWeekDay);
    expect(output.ReferenceDay).to.eql(input.qReferenceDay);
    expect(output.FirstMonthOfYear).to.eql(input.qFirstMonthOfYear);
    expect(output.CollationLocale).to.eql(input.qCollation);
    expect(output.MonthNames).to.eql(input.qCalendarStrings.qMonthNames);
    expect(output.LongMonthNames).to.eql(input.qCalendarStrings.qLongMonthNames);
    expect(output.DayNames).to.eql(input.qCalendarStrings.qDayNames);
    expect(output.LongDayNames).to.eql(input.qCalendarStrings.qLongDayNames);
  });
});

