import React from 'react'
import axios from 'axios'
import { render, cleanup, screen, within, fireEvent, act } from '@testing-library/react'

import App from './App'

jest.mock('axios')

describe('<App />', () => {
  let mockedJest: jest.Mocked<typeof axios>

  beforeEach(() => {
    mockedJest = axios as jest.Mocked<typeof axios>
    mockedJest.get.mockResolvedValue({
      data: [
        {
          id: 1,
          title: 'Backlog',
          cards: [
            {
              id: 1,
              title: 'Test 1',
              section_id: 1
            }
          ]
        },
        {
          id: 2,
          title: 'Ready for Development',
          cards: []
        }
      ]
    })
  })

  afterEach(cleanup)

  it('matches snapshot', async () => {
    const { asFragment } = render(<App />)

    await screen.findByText('Backlog')

    expect(asFragment).toMatchSnapshot()
  })

  it('renders sections successfully', async () => {
    render(<App />)

    const backlogText = await screen.findByText('Backlog')
    const readyForDevelopmentText = await screen.findByText('Ready for Development')

    expect(backlogText.nodeName).toBe('SPAN')
    expect(readyForDevelopmentText.nodeName).toBe('SPAN')
  })

  it('renders cards successfully', async () => {
    render(<App />)

    const cardText = await screen.findByText('Test 1')

    expect(cardText.nodeName).toBe('DIV')
  })

  it('renders a "Add another card" span', async () => {
    const testCardTitle = 'Test Card'
    const addAnotherCardText = 'Add another card'
    const addCardText = 'Add card'

    mockedJest.post.mockResolvedValue({
      data: {
        id: 15,
        title: testCardTitle
      }
    })

    render(<App />)

    const backlogSection = await screen.findByTestId('Backlog-section')
    const addAnotherCardSpan = await within(backlogSection).findByText(addAnotherCardText)

    await act(async () => {
      fireEvent.click(addAnotherCardSpan)

      const cardTitleTextArea = await screen.findByRole('textbox')
      const addCardInput = await within(backlogSection).findByText(addCardText)

      fireEvent.change(cardTitleTextArea, { target: { value: testCardTitle } })

      fireEvent.click(addCardInput)
    })

    const newCardText = await within(backlogSection).findByText(testCardTitle)

    expect(newCardText.nodeName).toBe('DIV')
  })
})
