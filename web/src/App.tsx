import { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'

import Section from './components/section'
import SectionI from './types/section'

import './App.css'

export const BoardContainer = styled.div`
  background-color: rgb(49, 121, 186);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  color: #393939;
  overflow-y: hidden;
  overflow-x: auto;
  position: absolute;
  padding: 5px;
  align-items: flex-start;
`

function App() {
  const [sections, setSections] = useState<SectionI[]>([])

  useEffect(() => {
    axios.get('http://localhost:3001/sections').then((response) => {
      setSections(response.data)
    })
  }, [])

  useEffect(() => {
    const sortedSections = sections.sort((a: SectionI, b: SectionI) => a.id - b.id)
    setSections(sortedSections)
  }, [sections])

  const onCardSubmit = (sectionId: number, title: string) => {
    axios
      .post('http://localhost:3001/cards', {
        sectionId,
        title
      })
      .then((response) => {
        let sectionsClone: SectionI[] = [...sections]
        for (let i = 0; i < sectionsClone.length; i++) {
          let section: SectionI = sectionsClone[i]
          if (section.id === sectionId) {
            section.cards.push({
              id: response.data.id,
              title: response.data.title,
              section_id: sectionId
            })

            setSections(sectionsClone)
          }
        }
      })
  }

  return (
    <BoardContainer>
      {sections.map((section: SectionI) => {
        return <Section section={section} onCardSubmit={onCardSubmit} key={section.id}></Section>
      })}
    </BoardContainer>
  )
}

export default App
