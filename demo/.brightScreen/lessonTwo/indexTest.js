const codeFromUser = USER_CODE || function() { console.log('No User code Provided') }


const test = () => {
  const input = 'yo'
  const expectedOutput = 'yo'
  const testedValue = codeFromUser(input)

  if (testedValue === expectedOutput) {
    console.log('Passed Test 2')
    return true
  } else {
    console.log('Failed Test Two')
    return false
  }
}

test()