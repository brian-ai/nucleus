import * as serializer from './serializer'
import safeEmpty from './safeEmpty'

const calculateTimeDiference = (dt2, dt1) => {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000
  diff /= 60 * 60

  return Math.abs(Math.round(diff))
}

const getGreetingTime = () => {
  const today = new Date()
  const currenHour = today.getHours()
  let humanizedTime

  if (currenHour < 12) {
    humanizedTime = 'morning'
  } else if (currenHour < 18) {
    humanizedTime = 'afternoon'
  } else {
    humanizedTime = 'evening'
  }

  //TODO: Dynamize current user
  return {
    humanizedTime,
    sentence: `<emphasis level="moderate">Good ${humanizedTime}</emphasis>`
  }
}

export { getGreetingTime, safeEmpty, serializer, calculateTimeDiference }
