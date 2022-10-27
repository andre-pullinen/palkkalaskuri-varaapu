import dayjs from 'dayjs'

const createRangeArray = (start, end) => {
  return [...Array(end - start + 1).keys()].map(x => x + start)
}
const createArray = amount => {
  return Array.from({ length: amount }, (_, i) => i + 1)
}

export const getDays = (days, month, year, isCurrentMonth = true) => {
  return days.map(day => {
    return {
      number: day,
      date: dayjs(`${year}-${month}-${day}`),
      isCurrentMonth
    }
  })
}

export const getDaysForDate = (date) => {
  const currentMonth = date
  const prevMonth = date.add(-1, 'month')
  const nextMonth = date.add(+1, 'month')
  const daysInMonth = currentMonth.daysInMonth()
  const lastDayOfMonth = currentMonth.endOf('month').day()
  const daysInPrevMonth = prevMonth.daysInMonth()
  const dayOfPrevMonth = prevMonth.endOf('month').day()
  return [
    ...getDays(createRangeArray(daysInPrevMonth - dayOfPrevMonth + 1, daysInPrevMonth), prevMonth.month(), prevMonth.year(), false),
    ...getDays(createArray(daysInMonth), currentMonth.month(), currentMonth.year()),
    ...getDays(createArray(7 - (lastDayOfMonth === 0 ? 7 : lastDayOfMonth)), nextMonth.month(), nextMonth.year(), false)
  ]
}
