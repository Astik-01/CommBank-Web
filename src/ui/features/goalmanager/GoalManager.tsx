import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import 'date-fns'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { updateGoal as updateGoalApi } from '../../../api/lib'
import { Goal } from '../../../api/types'
import { selectGoalsMap, updateGoal as updateGoalRedux } from '../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import DatePicker from '../../components/DatePicker'
import { Theme } from '../../components/Theme'

// NEW IMPORTS FOR ICON SUPPORT
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

type Props = { goal: Goal }

export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()
  const goal = useAppSelector(selectGoalsMap)[props.goal.id]

  const [name, setName] = useState<string | null>(null)
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [targetAmount, setTargetAmount] = useState<number | null>(null)

  // NEW STATE FOR ICON
  const [icon, setIcon] = useState<string | null>(goal.icon ?? null)
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => {
    setName(props.goal.name)
    setTargetDate(props.goal.targetDate)
    setTargetAmount(props.goal.targetAmount)
    setIcon(props.goal.icon ?? null)
  }, [
    props.goal.id,
    props.goal.name,
    props.goal.targetDate,
    props.goal.targetAmount,
    props.goal.icon,
  ])

  useEffect(() => {
    setName(goal.name)
    setIcon(goal.icon ?? null)
  }, [goal.name, goal.icon])

  const updateNameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextName = event.target.value
    setName(nextName)
    const updatedGoal: Goal = { ...props.goal, name: nextName, icon: icon ?? undefined }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  const updateTargetAmountOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTargetAmount = parseFloat(event.target.value)
    setTargetAmount(nextTargetAmount)
    const updatedGoal: Goal = {
      ...props.goal,
      name: name ?? props.goal.name,
      targetDate: targetDate ?? props.goal.targetDate,
      targetAmount: nextTargetAmount,
      icon: icon ?? undefined,
    }
    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  const pickDateOnChange = (date: MaterialUiPickersDate) => {
    if (date != null) {
      setTargetDate(date)
      const updatedGoal: Goal = {
        ...props.goal,
        name: name ?? props.goal.name,
        targetDate: date ?? props.goal.targetDate,
        targetAmount: targetAmount ?? props.goal.targetAmount,
        icon: icon ?? undefined,
      }
      dispatch(updateGoalRedux(updatedGoal))
      updateGoalApi(props.goal.id, updatedGoal)
    }
  }

  // ----------------------
  // UPDATE ICON WHEN USER SELECTS EMOJI
  // ----------------------
  const handleEmojiSelect = (emoji: any) => {
    const selected = emoji.native
    setIcon(selected)
    setShowPicker(false)

    const updatedGoal: Goal = {
      ...props.goal,
      name: name ?? props.goal.name,
      targetDate: targetDate ?? props.goal.targetDate,
      targetAmount: targetAmount ?? props.goal.targetAmount,
      icon: selected,
    }

    dispatch(updateGoalRedux(updatedGoal))
    updateGoalApi(props.goal.id, updatedGoal)
  }

  return (
    <GoalManagerContainer>

      {/* GOAL TITLE */}
      <NameInput value={name ?? ''} onChange={updateNameOnChange} />

      {/* ---------------- ICON PICKER UI ---------------- */}
      <Group>
        <Field name="Goal Icon" icon={faDollarSign} />
        <Value>
          <IconRow>
            {/* Display chosen icon */}
            {icon ? (
              <IconDisplay>{icon}</IconDisplay>
            ) : (
              <NoIconText>No icon selected</NoIconText>
            )}

            {/* Button to pick emoji */}
            <IconButton onClick={() => setShowPicker(!showPicker)}>
              {icon ? 'Change Icon' : 'Add Icon'}
            </IconButton>
          </IconRow>

          {/* Emoji Picker */}
          {showPicker && (
            <EmojiPickerWrapper>
              <Picker onSelect={handleEmojiSelect} title="Pick an emoji" />
            </EmojiPickerWrapper>
          )}
        </Value>
      </Group>

      {/* OTHER UI FIELDS */}
      <Group>
        <Field name="Target Date" icon={faCalendarAlt} />
        <Value>
          <DatePicker value={targetDate} onChange={pickDateOnChange} />
        </Value>
      </Group>

      <Group>
        <Field name="Target Amount" icon={faDollarSign} />
        <Value>
          <StringInput value={targetAmount ?? ''} onChange={updateTargetAmountOnChange} />
        </Value>
      </Group>

      <Group>
        <Field name="Balance" icon={faDollarSign} />
        <Value>
          <StringValue>{props.goal.balance}</StringValue>
        </Value>
      </Group>

      <Group>
        <Field name="Date Created" icon={faCalendarAlt} />
        <Value>
          <StringValue>{new Date(props.goal.created).toLocaleDateString()}</StringValue>
        </Value>
      </Group>
    </GoalManagerContainer>
  )
}

// ------------------------------------
// STYLED COMPONENTS BELOW
// ------------------------------------

const Field = (props: { name: string; icon: any }) => (
  <FieldContainer>
    <FontAwesomeIcon icon={props.icon} size="2x" />
    <FieldName>{props.name}</FieldName>
  </FieldContainer>
)

const GoalManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`
const Group = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
`
const NameInput = styled.input`
  background-color: transparent;
  border: none;
  font-size: 4rem;
  font-weight: bold;
  outline: none;
`

const FieldName = styled.h1`
  font-size: 1.8rem;
  margin-left: 1rem;
  color: rgba(174, 174, 174, 1);
  font-weight: normal;
`
const FieldContainer = styled.div`
  display: flex;
  align-items: center;
  width: 20rem;
`

const StringValue = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
`

const StringInput = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 1.8rem;
  font-weight: bold;
`

const Value = styled.div`
  margin-left: 2rem;
`

// ---------------- ICON UI STYLES ----------------

const IconRow = styled.div`
  display: flex;
  align-items: center;
`

const IconDisplay = styled.span`
  font-size: 2.5rem;
  margin-right: 1rem;
`

const NoIconText = styled.span`
  font-size: 1.5rem;
  color: gray;
  margin-right: 1rem;
`

const IconButton = styled.button`
  padding: 0.4rem 1rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
`

const EmojiPickerWrapper = styled.div`
  position: absolute;
  z-index: 10;
`
