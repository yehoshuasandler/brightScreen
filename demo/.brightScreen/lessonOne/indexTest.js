const codeFromUser = USER_CODE

const test = () => {
  const input = 'yo'
  const expectedOutput = 'yo'
  const testedValue = codeFromUser(input)

  if (testedValue === expectedOutput) {
    const message = {
      didPass: true,
      message: 'Passed Test 1'
    }
    console.log(JSON.stringify(message))
  } else {
    const message = {
      didPass: false,
      message: 'Did not return expected value'
    }
    console.log(JSON.stringify(message))
  }
}

test()