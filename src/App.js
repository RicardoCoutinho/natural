import React from 'react'
import styled from 'styled-components'
import LogoImage from 'logo.svg'

export const handle1 = (n) => [...Array(n).keys()].reduce((acc, value) => acc + Math.pow(value + 1, 2), 0)
export const handle2 = (n) => Math.pow(((n*(n+1)) / 2), 2)

let requests = {}
let lastRequest = null

export const mockAPI = (number) => new Promise((resolve, reject) => {
  if (
    !(typeof(number) === "number" && number > 0 && number < 101 && number % 1 === 0)
  ) {
    reject(new Error('Number should be a natural number between 1 and 100!'));
  }

  const date = new Date()
  requests[`${number}`] = requests[`${number}`] ? requests[`${number}`] + 1 : 1

  const currentLastRequest = lastRequest
  lastRequest = date

  resolve({
    "datetime": date,
    "value": handle2(number) - handle1(number),
    "number": number,
    "occurrences": requests[`${number}`] - 1,
    "last_datetime": currentLastRequest
  })
})

const Wrapper = styled.form`
  width: 100%;
  height: 100%;
`

const Logo = styled.img`
  width: 400px;
  height: 400px;
`

const Background = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: cadetblue;

  h3 {
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    color: black;

    b {
      font-size: 30px;
      color: orange;
    }
  }

  h2 {
    font-size: 100px;
    font-weight: 600;
    text-align: center;
    color: white;
  }

  h1 {
    font-size: 300px;
    font-weight: 500;
    line-height: 0;
    text-align: center;
    text-shadow: 1px 1px #fe4902,
                2px 2px #fe4902,
                3px 3px #fe4902;
  }
`

const Foreground = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`

const InputText = styled.input`
  width: 400px;
  height: 50px;
  padding: 5px 10px;
  margin-top: 300px;
  text-align: center;
  font-size: 30px;
  border-radius: 5px;
  outline: none;
`

const SubmitButton = styled.button`
  width: 400px;
  height: 50px;
  padding: 5px 10px;
  position: absolute;
  z-index: 5;
  bottom: 0;
  border-radius: 200px 200px 0 0;
  outline: none;
  background-color: palevioletred;
  border: 2px dashed palevioletred;
  transition: all .3s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: darksalmon;
  }

  &:active {
    background-color: darkorchid;
    color: white;
  }
`

class App extends React.Component {

  state = {
    data: {},
    failed: null,
    number: "",
    result: null,
  }

  sanitizeInput = (string) => string.replace(/[^\d]/, '').slice(0, 3)

  fitInRange = (string, minNumber, maxNumber) => {
    const number = parseInt(string, 10)
    return number < minNumber ? `${minNumber}` : number > maxNumber ? `${maxNumber}` : string
  }

  updateNumber = (el) => {
    this.setState({
      number: this.fitInRange(this.sanitizeInput(el.target.value), 1, 100),
      result: null,
      failed: null,
    })
  }

  updateData = (number, result) => {
    const data = this.state.data
    data[`${number}`] = result
    this.setState({ data: data })
  }

  updateResult = (value) => this.setState({ result: value })

  handleSubmit = (e) => {
    e.preventDefault()
    if (this.state.number !== "") {
      this.getResult(this.state.number)
    }
  }

  getResult = async () => {
    const { number, data } = this.state

    if (data[number] !== undefined) {
      console.log('Fetched result from Momoized Object', data[number]);
      this.updateResult(data[number])
      return;
    }

    try {
      const result = await mockAPI(parseInt(number, 10))
      console.log('Fetched result from Mock API', result);
      this.updateData(number, result.value)
      this.updateResult(result.value)
    }
    catch(e) {
      // console.error(e)
      this.setState({ failed: e.message })
    }
  }

  render() {
    const { failed, number, result } = this.state

    return (
      <Wrapper onSubmit={this.handleSubmit}>
        <Background>
          { result !== null && <h2>{ result }</h2> }
          { failed && <h3>Woops! Are you sure you tried a number ?! Because the API told me: <br/><b>"{ failed }"</b></h3> }
          { number === '' && <Logo src={LogoImage} /> }
          { number !== '' && <h1>{ number }</h1> }
        </Background>
        <Foreground>
          <InputText
            type="text"
            placeholder="1..100 natural number :)"
            value={number}
            onChange={this.updateNumber}
            onPaste={(e) => e.preventDefault()}
          />
          { number !== '' && <SubmitButton type="submit">Press ENTER or Click me</SubmitButton> }
        </Foreground>
      </Wrapper>
    );
  }
}

export default App