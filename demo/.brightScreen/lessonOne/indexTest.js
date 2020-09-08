const codeFromUser = USER_CODE

const test = () => {
  const input = 'yo'
  const expectedOutput = 'yo'
  const testedValue = codeFromUser(input)

  if (testedValue === expectedOutput) {
    console.log({
      didPass: true,
      message: 'Passed Test 1'
    })
  } else {
    console.log({
      didPass: false,
      message: 'Did not return expected value'
    })
  }
}

test()