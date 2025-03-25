import { ref, computed } from 'vue'

interface TimeOption {
  value: string;
  label: string;
}

export function useDateTime() {
  // Generate time options with 10-minute intervals (00:00 - 23:50)
  const generateTimeOptions = (): TimeOption[] => {
    const options: TimeOption[] = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const formattedHour = hour.toString().padStart(2, '0')
        const formattedMinute = minute.toString().padStart(2, '0')
        const timeString = `${formattedHour}:${formattedMinute}`
        options.push({
          value: timeString,
          label: timeString
        })
      }
    }
    return options
  }
  
  const timeOptions = ref<TimeOption[]>(generateTimeOptions())
  
  // Default date picker options
  const datePickerOptions = {
    disabledDate: (time: Date) => {
      // Disable dates in the past
      return time.getTime() < Date.now() - 8.64e7 // 8.64e7 is one day in milliseconds
    },
    shortcuts: [
      {
        text: 'Today',
        value: new Date(),
      },
      {
        text: 'Tomorrow',
        value: (() => {
          const date = new Date()
          date.setTime(date.getTime() + 3600 * 1000 * 24)
          return date
        })(),
      },
      {
        text: 'Next Week',
        value: (() => {
          const date = new Date()
          date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
          return date
        })(),
      },
    ],
  }
  
  // Format date for display (YYYY-MM-DD)
  const formatDate = (date: Date): string => {
    if (!date) return ''
    
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    
    return `${year}-${month}-${day}`
  }
  
  // Parse date string into Date object
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null
    
    const [year, month, day] = dateString.split('-').map(Number)
    if (!year || !month || !day) return null
    
    return new Date(year, month - 1, day)
  }
  
  // Format time for display
  const formatTime = (timeString: string): string => {
    if (!timeString) return ''
    
    // Handle 24-hour format to display in more readable format if needed
    const [hours, minutes] = timeString.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }
  
  // Combine date and time into a single Date object
  const combineDateAndTime = (dateString: string, timeString: string): Date | null => {
    if (!dateString || !timeString) return null
    
    const date = parseDate(dateString)
    if (!date) return null
    
    const [hours, minutes] = timeString.split(':').map(Number)
    
    date.setHours(hours)
    date.setMinutes(minutes)
    
    return date
  }
  
  return {
    timeOptions,
    datePickerOptions,
    formatDate,
    parseDate,
    formatTime,
    combineDateAndTime
  }
} 