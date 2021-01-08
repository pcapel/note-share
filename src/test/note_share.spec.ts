import { makeRedBorder } from '../index'

describe('makeRedBorder', () => {
  it('alters a mutable object to have a border value', ()=> {
    const document = {
      body: {
        style: {
          border: ''
        }
      }
    }
    makeRedBorder((document as HTMLDocument))

    expect(document.body.style.border).toEqual('1px solid red')

  })
})
