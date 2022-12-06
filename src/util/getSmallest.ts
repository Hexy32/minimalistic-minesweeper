export default function getSmallest(numbers: number[]) {
  let highestNumber = Infinity
  numbers.forEach(num => {
    if (highestNumber > num) {
      highestNumber = num
    }
  })

  return highestNumber
}
